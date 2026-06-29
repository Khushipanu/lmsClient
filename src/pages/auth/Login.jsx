import React, { useState } from 'react'
import './auth.css'
import {Link, useNavigate} from 'react-router-dom'
import { UserData } from '../../context/UserContext.jsx'
import { CourseData } from '../../context/courseContext.jsx'

const Login = () => {
  const navigate=useNavigate()
  const{btnLoading,loginUser}=UserData();
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  const {fetchMyCourse}=CourseData();
  
  const submitHandler=async(e)=>{
    e.preventDefault()
    await loginUser(email,password,navigate,fetchMyCourse);

  }

  return (
    <div className="auth-page">
        <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={submitHandler} >
                <label htmlFor="email">Email</label>
                <input type="email" 
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                required /><br></br>

                <label htmlFor="password">Password</label>
                <input type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required /> <br></br>

                <button disabled={btnLoading} type="submit" className="common-btn"> {btnLoading?"Please wait":"Login"}
                   </button>
            </form>
            <p>Don't have an account <Link to='/register'> Register  </Link> 
              </p>
         <p><Link to="/forgot"> Forgot password</Link> 
         </p>


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
