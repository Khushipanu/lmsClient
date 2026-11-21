import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, KeyRound, CheckCircle2 } from "lucide-react";
import api, { getErrorMessage } from "../../api/axios";
import { SubmitButton } from "../../components/ui";
import AuthLayout from "./AuthLayout";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/user/forgot", { email });
      toast.success(data.message);
      setSent(true);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-icon">{sent ? <CheckCircle2 size={24} /> : <KeyRound size={24} />}</div>
      <h1>{sent ? "Check your inbox" : "Forgot password?"}</h1>
      <p className="auth-sub">
        {sent
          ? `If an account exists for ${email}, a reset link is on its way. It expires in 15 minutes.`
          : "Enter your email and we'll send you a link to reset your password."}
      </p>

      {!sent ? (
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <div className="input-icon">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <SubmitButton loading={loading}>{loading ? "Sending…" : "Send reset link"}</SubmitButton>
        </form>
      ) : (
        <button className="btn btn-block btn-lg" onClick={() => setSent(false)}>
          Use a different email
        </button>
      )}

      <p className="auth-foot">
        Remembered it? <Link to="/login">Back to log in</Link>
      </p>
    </AuthLayout>
  );
};

export default Forgot;
