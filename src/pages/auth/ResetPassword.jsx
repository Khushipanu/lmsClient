import React from 'react'
import "./auth.css"
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const ResetPassword = () => {
    const [password,setPassword]=useState("")
    const [btnLoading,setBtnLoading]=useState(false);
    const navigate=useNavigate()
    const params=useParams();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setBtnLoading(true)
        try{
            const {data}=await api.post(`/api/user/reset?token=${params.token}`,{password})
            toast.success(data.message)
            navigate('/login')
            setBtnLoading(false)

        }catch(err){
            toast.error(err.response.data.message);
            setBtnLoading(false)

        }
    }
  return (
     <div className="auth-page" >
        <div className="auth-form">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit} >

                <label htmlFor="text">Enter password </label>
                <input type="password" value={password} 
                onChange={(e)=>setPassword(e.target.value)}
                required
                />
                <button disabled={btnLoading} className="common-btn" >
                    
                    {btnLoading? "Pls wait..." : "Reset"}
                    </button>
            </form>

        </div>
    </div>
  )
}

export default ResetPassword;
