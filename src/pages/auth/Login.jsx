import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { UserData } from "../../context/UserContext";
import { SubmitButton } from "../../components/ui";
import { API_URL } from "../../config";
import AuthLayout from "./AuthLayout";

const OAUTH_ERRORS = {
  google_not_configured: "Google sign-in isn't set up on the server yet. Please use email and password.",
  google_cancelled: "Google sign-in was cancelled.",
  google_failed: "Google sign-in failed. Please try again, or use email and password.",
  auth_failed: "Google sign-in failed. Please try again.",
  oauth_callback_error: "Google sign-in failed. Please try again.",
};

export const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

export const GoogleButton = ({ label = "Continue with Google" }) => (
  <button
    type="button"
    className="btn btn-block btn-lg google-btn"
    onClick={() => {
      window.location.href = `${API_URL}/auth/google`;
    }}
  >
    <GoogleIcon /> {label}
  </button>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { btnLoading, loginUser } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const oauthError = OAUTH_ERRORS[params.get("err")];

  const submitHandler = async (e) => {
    e.preventDefault();
    const user = await loginUser(email, password);
    if (user) {
      const from = location.state?.from;
      navigate(from && from !== "/login" ? from : user.role === "admin" ? "/admin/dashboard" : "/dashboard", {
        replace: true,
      });
    }
  };

  return (
    <AuthLayout>
      <div className="auth-icon">
        <LogIn size={24} />
      </div>
      <h1>Welcome back</h1>
      <p className="auth-sub">Log in to continue learning.</p>

      {oauthError && (
        <div className="alert alert-danger" style={{ marginBottom: 18 }}>
          <AlertCircle size={18} /> {oauthError}
        </div>
      )}

      <form onSubmit={submitHandler}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <div className="input-icon">
            <Mail size={18} />
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <label htmlFor="password" className="label">
              Password
            </label>
            <Link to="/forgot" className="link" style={{ fontSize: 13 }}>
              Forgot password?
            </Link>
          </div>
          <div className="input-icon">
            <Lock size={18} />
            <input
              id="password"
              type={show ? "text" : "password"}
              className="input"
              placeholder="Your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="icon-btn input-action"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <SubmitButton loading={btnLoading}>{btnLoading ? "Logging in…" : "Log in"}</SubmitButton>
        <div className="divider">or</div>
        <GoogleButton />
      </form>

      <p className="auth-foot">
        New here? <Link to="/register">Create a free account</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
