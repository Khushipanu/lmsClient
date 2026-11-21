import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { MailCheck, KeyRound } from "lucide-react";
import { UserData } from "../../context/UserContext";
import { SubmitButton } from "../../components/ui";
import AuthLayout from "./AuthLayout";

const Verify = () => {
  const navigate = useNavigate();
  const { btnLoading, verifyOtp } = UserData();
  const [otp, setOtp] = useState("");
  // Read once on mount — verifyOtp clears these on success, which must not
  // bounce the user back to /register before we navigate to /login.
  const [{ email, fallbackOtp, hasToken }] = useState(() => ({
    email: sessionStorage.getItem("pendingEmail"),
    fallbackOtp: sessionStorage.getItem("fallbackOtp"),
    hasToken: Boolean(sessionStorage.getItem("activationToken")),
  }));

  if (!hasToken) return <Navigate to="/register" replace />;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (await verifyOtp(otp)) navigate("/login", { replace: true });
  };

  return (
    <AuthLayout>
      <div className="auth-icon">
        <MailCheck size={24} />
      </div>
      <h1>Check your email</h1>
      <p className="auth-sub">
        {fallbackOtp ? "Enter the 6-digit code for " : "We sent a 6-digit code to "}
        <strong style={{ color: "var(--text)" }}>{email || "your email"}</strong>. It expires in 15 minutes.
      </p>

      {fallbackOtp && (
        <div className="alert alert-warning" style={{ marginBottom: 18 }}>
          <KeyRound size={18} />
          <span>
            Email delivery is unavailable right now. Your code is <strong>{fallbackOtp}</strong>
          </span>
        </div>
      )}

      <form onSubmit={submitHandler}>
        <div className="field">
          <label htmlFor="otp">Verification code</label>
          <input
            id="otp"
            className="input otp-input"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="••••••"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            autoFocus
            required
          />
          <span className="field-hint">Can't find it? Check your spam or promotions folder.</span>
        </div>
        <SubmitButton loading={btnLoading} disabled={btnLoading || otp.length !== 6}>
          {btnLoading ? "Verifying…" : "Verify & continue"}
        </SubmitButton>
      </form>

      <p className="auth-foot">
        Wrong email or no code? <Link to="/register">Start over</Link>
      </p>
    </AuthLayout>
  );
};

export default Verify;
