import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config";

// Render's free plan sleeps after inactivity and takes ~30-60s to wake up,
// so allow long requests and tell the user what's happening.
const api = axios.create({ baseURL: API_URL, timeout: 90000 });

const WAKE_TOAST = "server-waking";
let slowTimer = null;
let inFlight = 0;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
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
  (err) => {
    settle(err.config);
    // Token expired/invalid → log out everywhere.
    if (err.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
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
