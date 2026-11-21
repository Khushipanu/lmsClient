import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config";

/*
  Auth tokens
  -----------
  accessToken  (localStorage "token")        short-lived (15 min) JWT, sent on every request.
  refreshToken (localStorage "refreshToken") long-lived (30 days), only sent to /api/user/refresh.

  When a request fails with 401 because the access token expired, the response
  interceptor below quietly gets a new pair with the refresh token and retries
  the request, so the user never notices. If the refresh token is also invalid
  (logged out, password changed, expired) the user is logged out.
*/
const ACCESS_KEY = "token";
const REFRESH_KEY = "refreshToken";

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const saveTokens = ({ accessToken, token, refreshToken } = {}) => {
  const access = accessToken || token;
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

// Render's free plan sleeps after inactivity and takes ~30-60s to wake up,
// so allow long requests and tell the user what's happening.
const api = axios.create({ baseURL: API_URL, timeout: 90000 });
// Separate instance without interceptors, so a failing refresh can't loop.
const plain = axios.create({ baseURL: API_URL, timeout: 90000 });

let refreshing = null;

const doRefresh = async (staleAccess) => {
  // Another tab may have refreshed already while we waited for the lock.
  const current = getAccessToken();
  if (current && current !== staleAccess) return current;

  const refreshToken = getRefreshToken();
  if (!refreshToken) throw Object.assign(new Error("Not logged in"), { response: { status: 401 } });
  try {
    const { data } = await plain.post("/api/user/refresh", { refreshToken });
    saveTokens(data);
    return data.accessToken;
  } catch (err) {
    // Lost a race with another tab that rotated the token first? Use its result.
    const latest = getRefreshToken();
    if (latest && latest !== refreshToken) return getAccessToken();
    throw err;
  }
};

/**
 * Get a new access token. Concurrent callers share one request, and the Web
 * Locks API keeps two browser tabs from rotating the same refresh token at once.
 */
export const refreshSession = (staleAccess = getAccessToken()) => {
  if (!refreshing) {
    const run = () => doRefresh(staleAccess);
    const job = navigator.locks?.request ? navigator.locks.request("lms-token-refresh", run) : run();
    refreshing = job.finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
};

const AUTH_ENDPOINTS = /\/api\/user\/(login|refresh|logout|register|verify|forgot|reset)\b/;

const WAKE_TOAST = "server-waking";
let slowTimer = null;
let inFlight = 0;

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.token = token;

  if (config.skipWakeToast) return config; // e.g. long video uploads
  config._tracked = true;
  inFlight += 1;
  if (!slowTimer) {
    slowTimer = setTimeout(() => {
      toast.loading("Waking up the server… this can take up to a minute the first time.", { id: WAKE_TOAST });
    }, 5000);
  }
  return config;
});

const settle = (config) => {
  if (!config?._tracked) return;
  inFlight = Math.max(0, inFlight - 1);
  if (inFlight === 0) {
    clearTimeout(slowTimer);
    slowTimer = null;
    toast.dismiss(WAKE_TOAST);
  }
};

api.interceptors.response.use(
  (res) => {
    settle(res.config);
    return res;
  },
  async (err) => {
    settle(err.config);
    const original = err.config;
    const isAuthEndpoint = AUTH_ENDPOINTS.test(original?.url || "");

    if (err.response?.status !== 401 || !original || isAuthEndpoint) return Promise.reject(err);

    // 1st 401 → try once to refresh the access token, then replay the request.
    if (!original._retried && getRefreshToken()) {
      original._retried = true;
      try {
        await refreshSession(original.headers?.token);
        return api(original); // request interceptor attaches the new token
      } catch (refreshErr) {
        // Server asleep / network down: keep the session, just fail this request.
        if (refreshErr.response?.status !== 401) return Promise.reject(err);
      }
    }

    // Refresh token missing, expired or revoked → log out.
    if (getAccessToken() || getRefreshToken()) {
      clearTokens();
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(err);
  }
);

/** Human-friendly message for any API error. */
export const getErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ECONNABORTED") return "The server took too long to respond. Please try again.";
  if (err?.request && !err.response) return "Can't reach the server. It may be starting up — try again in a few seconds.";
  return err?.message || fallback;
};

export default api;
