import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, UserPlus, BookOpen, GraduationCap } from "lucide-react";
import { UserData } from "../../context/UserContext";
import { SubmitButton } from "../../components/ui";
import AuthLayout from "./AuthLayout";
import { GoogleButton } from "./Login";

const Register = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { btnLoading, registerUser } = UserData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [role, setRole] = useState(params.get("role") === "instructor" ? "admin" : "user");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (await registerUser(name.trim(), email.trim(), password, role)) navigate("/verify");
  };

  return (
    <AuthLayout>
      <div className="auth-icon">
        <UserPlus size={24} />
      </div>
      <h1>Create your account</h1>
      <p className="auth-sub">Start learning in less than a minute.</p>

      <form onSubmit={submitHandler}>
        <div className="field">
          <span className="label">I want to</span>
          <div className="segmented" role="radiogroup">
            <button
              type="button"
              role="radio"
              aria-checked={role === "user"}
              className={role === "user" ? "active" : ""}
              onClick={() => setRole("user")}
            >
              <BookOpen size={16} /> Learn
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={role === "admin"}
              className={role === "admin" ? "active" : ""}
              onClick={() => setRole("admin")}
            >
              <GraduationCap size={16} /> Teach
            </button>
          </div>
          <span className="field-hint">
            {role === "admin"
              ? "Instructors can create courses, upload lectures and answer student doubts."
              : "Students can enroll in courses, watch lectures and ask doubts."}
          </span>
        </div>

        <div className="field">
          <label htmlFor="name">Full name</label>
          <div className="input-icon">
            <User size={18} />
            <input
              id="name"
              className="input"
              placeholder="Your name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

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
          <label htmlFor="password">Password</label>
          <div className="input-icon">
            <Lock size={18} />
            <input
              id="password"
              type={show ? "text" : "password"}
              className="input"
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={6}
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

        <SubmitButton loading={btnLoading}>{btnLoading ? "Sending code…" : "Create account"}</SubmitButton>
        <div className="divider">or</div>
        <GoogleButton label="Sign up with Google" />
      </form>

      <p className="auth-foot">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
