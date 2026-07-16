// import React,{useState} from 'react'
// import './auth.css'
// import {Link, useNavigate} from "react-router-dom"
// import { UserData } from '../../context/UserContext'

// const Register = () => {
//   const navigate=useNavigate()
//   const {btnLoading,registerUser}=UserData()

//   const [email,setEmail]=useState("")
//   const [password,setPassword]=useState("")
//   const [name,setName]=useState("")
//   const [role,setRole]=useState("user")


//   const submitHandler=async(e)=>{
//     e.preventDefault()
//     await registerUser(name,email,password,role,navigate);
//   }


//   return (
//         <div className="auth-page">
//         <div className="auth-form">
//             <h2>Register</h2>
//             <form onSubmit={submitHandler}>
              
//                 <label htmlFor="name">Name</label>
//                 <input type="text"
//                 value={name}
//                 onChange={(e)=>setName(e.target.value)}    
//                 required /><br></br>

//                 <label htmlFor="email">Email</label>
//                 <input type="email"
//                 value={email}
//                 onChange={(e)=>setEmail(e.target.value)}
//                  required /><br></br>

//                 <label htmlFor="password">Password</label>
//                 <input type="password"
//                 value={password}
//                 onChange={(e)=>setPassword(e.target.value)}
//                 required /> <br></br>

//                 <label htmlFor="role">Role</label>
//                 <select value={role} 
//                 onChange={(e)=>setRole(e.target.value)}
//                  required>
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                 </select>
//                 <br></br>

//                 <button type="submit" disabled={btnLoading} className="common-btn">
//                  {btnLoading?"pls wait...":"Register"}

//                 </button>
//             </form>
//             <p>Have an account? <Link to='/login'> Login </Link> </p>
//         </div>
//     </div>
//   )
// }

// export default Register;

import React, { useState } from 'react'
import './auth.css'
import { Link, useNavigate } from "react-router-dom"
import { UserData } from '../../context/UserContext'

const Register = () => {
  const navigate = useNavigate()
  const { btnLoading, registerUser } = UserData()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("user")

  const submitHandler = async (e) => {
    e.preventDefault()
    await registerUser(name, email, password, role, navigate);
  }

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Register</h2>

        <form onSubmit={submitHandler}>

          {/* Name */}
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email */}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Role */}
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={btnLoading}
            className="common-btn"
          >
            {btnLoading ? "Please wait..." : "Register"}
          </button>

        </form>

        <p>
          Have an account? <Link to='/login'>Login</Link>
        </p>

      </div>
    </div>
  )
}

export default Register;

