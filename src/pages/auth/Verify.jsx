import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../../context/UserContext';
import ReCAPTCHA from "react-google-recaptcha";


const Verify = () => {
  const [otp,setOtp]=useState("")
  const {btnLoading,verifyOtp}=UserData()
  const [show,setShow]=useState(false)
  const navigate=useNavigate()

  function onChange(value) {
  console.log("Captcha value:", value);
  setShow(true)
}


  const submitHandler=async(e)=>{
    e.preventDefault();
    await verifyOtp(Number(otp),navigate)
    
    
  }
  return (
    <div className="auth-page">
        <div className="auth-form">
            <h2>Verify Account</h2>

            <form onSubmit={submitHandler}>

            <label htmlFor="otp"> Otp </label> 
            <input type="number"  
             value={otp}
             onChange={e=>setOtp(e.target.value)}
             required />
             <ReCAPTCHA
               sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"} // fallback test key
               onChange={onChange}
  />
        {show && (
            <button
             disabled={btnLoading} 
             type="submit" 
             className="common-btn" >
              {btnLoading?"pls wait...":"verify"} 
               </button>)}
             </form>
             <p>
                Go to <Link to='/login'>Login  </Link> page
             </p>
        </div>
    </div>
  )
}

export default Verify;
