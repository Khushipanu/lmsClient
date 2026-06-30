import React, { useState } from 'react'
import './auth.css'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn } from 'lucide-react'
import { UserData } from '../../context/UserContext.jsx'
import { CourseData } from '../../context/courseContext.jsx'

const Login = () => {
  const navigate = useNavigate()
  const { btnLoading, loginUser } = UserData();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { fetchMyCourse } = CourseData();

  const submitHandler = async (e) => {
    e.preventDefault()
    await loginUser(email, password, navigate, fetchMyCourse);
  }

  return (
    <div className="auth-page">
      <div className="auth-shape shape-1" />
      <div className="auth-shape shape-2" />

      <div className="auth-form">
        <div className="auth-icon">
          <LogIn size={28} />
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to access your courses</p>

        <form onSubmit={submitHandler}>
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-options">
            <Link to="/forgot">Forgot password?</Link>
          </div>

          <button disabled={btnLoading} type="submit" className="submit-btn">
            {btnLoading ? "Please wait..." : "Sign In"}
          </button>
        </form>

        <div className="divider"><span>or continue with</span></div>

        <button
          type="button"
          className="google-btn"
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/google`;
          }}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="google"
            className="google-icon"
          />
          <span>Google</span>
        </button>

        <div className="auth-footer">
          Don't have an account? <Link to='/register'>Create one</Link>
        </div>
      </div>
    </div>
  )
}

export default Login;
