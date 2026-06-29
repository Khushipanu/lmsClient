import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserData } from "../../context/UserContext.jsx";
import { Loader2 } from "lucide-react";
import "./auth.css";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchUser } = UserData();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);
    fetchUser().finally(() => {
      navigate("/");
    });
  }, [searchParams, fetchUser, navigate]);

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
