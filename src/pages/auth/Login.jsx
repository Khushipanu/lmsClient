import React, { useState } from 'react'
import './auth.css'
import { Link, useNavigate } from 'react-router-dom'
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
      <div className="auth-form">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue learning</p>
        <form onSubmit={submitHandler}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button disabled={btnLoading} type="submit">
            {btnLoading ? "Please wait" : "Login"}
          </button>
        </form>

        <div className="auth-links">
          <p>Don't have an account? <Link to='/register'>Register</Link></p>
          <p><Link to="/forgot">Forgot password?</Link></p>
        </div>

        <div className="divider"><span>OR</span></div>

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
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  )
}

export default Login;
