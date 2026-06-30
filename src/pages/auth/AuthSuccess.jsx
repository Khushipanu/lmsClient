import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserData } from "../../context/UserContext.jsx";
import { Loader2 } from "lucide-react";
import "./auth.css";

const decodeJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchUser, setUser, setIsAuth } = UserData();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);

    // Decode token and set basic auth state immediately
    const payload = decodeJwt(token);
    if (payload && payload._id) {
      setUser({ _id: payload._id, role: payload.role || "user" });
      setIsAuth(true);
    }

    // Fetch full profile in the background, then go home
    fetchUser().finally(() => {
      navigate("/");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-form" style={{ textAlign: "center" }}>
        <Loader2 className="spin-icon" size={40} />
        <h2 className="mt-2">Signing you in...</h2>
        <p>Please wait while we complete the Google login.</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
