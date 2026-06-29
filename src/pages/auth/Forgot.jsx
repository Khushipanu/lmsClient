// import React from 'react'
// import './auth.css'
// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import { server } from '../../main';


// const Forgot = () => {
//     const[email,setEmail]=useState("");
//     const [btnLoading,setBtnLoading]=useState(false)
//     const navigate=useNavigate()

//     const handleSubmit=async(e)=>{
//         e.preventDefault();
//         setBtnLoading(true)
//         try{
//             const {data}=await axios.post(`${server}/api/user/forgot`,{email})
//             toast.success(data.message)
//             navigate('/login')
//             setBtnLoading(false)

//         }catch(err){
//             toast.error(err.response.data.message);
//             setBtnLoading(false)

//         }

//     }
//   return (
//     <div className="auth-page" >
//         <div className="auth-form">
//             <h2>Forgot Password</h2>
//             <form onSubmit={handleSubmit}>
//                 <label htmlFor="text">Enter Email</label>
//                 <input type="email" value={email} 
//                 onChange={(e)=>setEmail(e.target.value)}
//                 required
//                 />
//                 <button disabled={btnLoading} 
//                 className="common-btn" >
                    
//                     {btnLoading? "Pls wait" : "Forgot password"}
//                     </button>
//             </form>

//         </div>


      
//     </div>
//   )
// }

// export default Forgot;

import React, { useState } from 'react';
import './auth.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await api.post("/api/user/forgot", { email });
      toast.success(data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          {/* ✅ Fixed label + input connection */}
          <label htmlFor="email">Enter Email</label>

          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            disabled={btnLoading}
            className="common-btn"
          >
            {btnLoading ? "Please wait..." : "Forgot Password"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Forgot;
