import { createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { clearTokens, getAccessToken, getErrorMessage, getRefreshToken, saveTokens } from "../api/axios";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    clearTokens();
    setUser(null);
    setIsAuth(false);
  }, []);

  const fetchUser = useCallback(async () => {
    // No access token but a refresh token? The request below gets a 401 and
    // the axios interceptor refreshes the session automatically.
    if (!getAccessToken() && !getRefreshToken()) {
      clearSession();
      setLoading(false);
      return null;
    }
    try {
      const { data } = await api.get("/api/user/myprofile");
      setUser(data.user);
      setIsAuth(true);
      return data.user;
    } catch (err) {
      if (err.response?.status === 401) clearSession();
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    fetchUser();
    const onLogout = () => clearSession();
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, [fetchUser, clearSession]);

  async function registerUser(name, email, password, role) {
    setBtnLoading(true);
    try {
      const { data } = await api.post("/api/user/register", { name, email, password, role });
      sessionStorage.setItem("activationToken", data.activationToken);
      sessionStorage.setItem("pendingEmail", email);
      if (data.otp) sessionStorage.setItem("fallbackOtp", data.otp);
      else sessionStorage.removeItem("fallbackOtp");
      toast.success(data.message);
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, "Registration failed"));
      return false;
    } finally {
      setBtnLoading(false);
    }
  }

  async function verifyOtp(otp) {
    const activationToken = sessionStorage.getItem("activationToken");
    if (!activationToken) {
      toast.error("Your signup session expired. Please register again.");
      return false;
    }
    setBtnLoading(true);
    try {
      const { data } = await api.post("/api/user/verify", { otp: String(otp), activationToken });
      ["activationToken", "pendingEmail", "fallbackOtp"].forEach((k) => sessionStorage.removeItem(k));
      toast.success(data.message);
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, "Verification failed"));
      return false;
    } finally {
      setBtnLoading(false);
    }
  }

  async function loginUser(email, password) {
    setBtnLoading(true);
    try {
      const { data } = await api.post("/api/user/login", { email, password });
      saveTokens(data);
      setUser(data.user);
      setIsAuth(true);
      toast.success(data.message);
      return data.user;
    } catch (err) {
      toast.error(getErrorMessage(err, "Login failed"));
      return null;
    } finally {
      setBtnLoading(false);
    }
  }

  async function loginWithToken(accessToken, refreshToken) {
    saveTokens({ accessToken, refreshToken });
    return fetchUser();
  }

  function logout() {
    // Revoke the refresh token on the server (fire-and-forget), then forget both tokens.
    const refreshToken = getRefreshToken();
    if (refreshToken) api.post("/api/user/logout", { refreshToken }).catch(() => {});
    clearSession();
    toast.success("Logged out");
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        loading,
        btnLoading,
        registerUser,
        verifyOtp,
        loginUser,
        loginWithToken,
        logout,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

 
export const UserData = () => useContext(UserContext);
