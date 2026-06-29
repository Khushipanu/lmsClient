import React, { useEffect, useState } from 'react'
import "./Profile.css"
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios';
import Layout from '../Utils/Layout';
import toast from 'react-hot-toast';

const Profile = ({user}) => {
    const navigate=useNavigate();
    
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(user?.role || "user");
    const [btnLoading, setBtnLoading] = useState(false);
    
    // Double-check admin role - redirect if not admin
    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);
    
    if (!user || user.role !== "admin") {
        return null; // Don't render anything while redirecting
    }

    const updateHandler=async(e)=>{
        e.preventDefault();
        setBtnLoading(true)

        try{
            const {data}=await api.put(`/api/user/updateProfile/${user._id}`,{
                name,email,password,role
            })
            toast.success(data.message)
            setBtnLoading(false)
             
        }catch(err){
            toast.error(err.response?.data?.message)
            setBtnLoading(false)
        }
    }
  
    


  return (
    <Layout>
        <div className="profile-page">
            <h1>Update Profile</h1>
            <form onSubmit={updateHandler} className="profile-form" >
                <label htmlFor="name">Name</label>
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} required />
                <label htmlFor="email">Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                <label htmlFor="password">Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                <label htmlFor="role">Role</label>
                <select value={role} onChange={(e)=>setRole(e.target.value)} required>
                    <option value="user">User</option>
                    <option value="instructor">Instructor</option>
                </select>
                <button type="submit" disabled={btnLoading} className="common-btn">
                    {btnLoading ? "Pls wait..." : "Update "}
                </button>
            </form>
        </div>
    </Layout>
    
  )
}

export default Profile
