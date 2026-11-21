import { createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../api/axios";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuth(false);
  }, []);

  const fetchUser = useCallback(async () => {
    if (!localStorage.getItem("token")) {
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
      localStorage.setItem("token", data.token);
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

  async function loginWithToken(token) {
    localStorage.setItem("token", token);
    return fetchUser();
  }

  function logout() {
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
