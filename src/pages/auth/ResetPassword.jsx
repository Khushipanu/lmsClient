import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, ShieldCheck } from "lucide-react";
import api, { getErrorMessage } from "../../api/axios";
import { SubmitButton } from "../../components/ui";
import AuthLayout from "./AuthLayout";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords don't match");
    setLoading(true);
    try {
      const { data } = await api.post(`/api/user/reset?token=${encodeURIComponent(token)}`, { password });
      toast.success(data.message);
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-icon">
        <ShieldCheck size={24} />
      </div>
      <h1>Set a new password</h1>
      <p className="auth-sub">Choose something at least 6 characters long.</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="password">New password</label>
          <div className="input-icon">
            <Lock size={18} />
            <input
              id="password"
              type="password"
              className="input"
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="confirm">Confirm password</label>
          <div className="input-icon">
            <Lock size={18} />
            <input
              id="confirm"
              type="password"
              className="input"
              minLength={6}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
        </div>
        <SubmitButton loading={loading}>{loading ? "Saving…" : "Update password"}</SubmitButton>
      </form>
      <p className="auth-foot">
        <Link to="/login">Back to log in</Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPassword;
