import React from 'react'
import "./Coursedescription.css"
import { useNavigate, useParams } from 'react-router-dom'
import { CourseData } from '../../context/courseContext'
import { useEffect } from 'react'
import { useState } from 'react'
import api from '../../api/axios';
import toast from 'react-hot-toast'
import { UserData } from '../../context/UserContext'
import Loading from '../../components/loading/Loading'
import { getImageUrl } from '../../utils/imageUrl'

const Coursedescription = ({user}) => {
    const [loading,setLoading]=useState(false)
    const {fetchUser}=UserData()
    const navigate=useNavigate()
    const params=useParams()
    const {fetchCourse,course,fetchCourses,fetchMyCourse}=CourseData()
    useEffect(()=>{
        fetchCourse(params.id)
    },[])

const checkoutHandler=async()=>{
    if(!user){
        navigate("/login")
        return
    }
    setLoading(true)
    try{
        const {data:{order}}=await api.post(`/api/course/checkout/${params.id}`)
        if(!order || !order.id){
            throw new Error("Failed to create Razorpay order")
        }
        const options={
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE",
        amount: order.amount,
        currency: "INR",
        name: "LMS",
        description: "Learning management system",
        order_id: order.id,
        handler:async function(response){
            const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=response;
            try{
                const {data}=await api.post(`/api/verification/${params.id}`,{
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature
                });
                await fetchUser();
                await fetchCourses();
                await fetchMyCourse();
                toast.success(data.message);
                setLoading(false)
                navigate(`/payment-success/${razorpay_payment_id}`)
            }catch(err){
                toast.error(err.response?.data?.message || "Payment verification failed")
                setLoading(false)
            }
        },
        modal: {
            ondismiss: function(){
                setLoading(false);
                toast.info("Payment cancelled");
            }
        },
        theme:{
            color:"#4f46e5"
        }
        }
        const razorpay=new window.Razorpay(options);
        razorpay.open()
    }catch(err){
        console.error("Checkout error:", err)
        toast.error(err.response?.data?.message || err.message || "Checkout failed. Please try again.")
        setLoading(false)
    }
}

  return (
  <>{
    loading? <Loading/> :  <>
  {course && 
  (<div className="course-description" >
    <div className="course-description-container">
      <div className="course-main">
        <div className="course-image-wrapper">
          <img
            className="course-image"
            src={getImageUrl(course.image)}
            alt={course.title}
            onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder-course.svg"; }}
          />
        </div>

        <div className="course-info" >
          {course.category && <span className="category-badge">{course.category}</span>}
          <h2>{course.title}</h2>
          <p className="meta"><span>Instructor</span>{course.createdBy}</p>
          <p className="meta"><span>Duration</span>{course.duration} weeks</p>
          <p className="course-description-text">{course.description}</p>
        </div>
      </div>

      <div className="course-action-card">
        <h3>Course Price</h3>
        <p className="price">₹{course.price}</p>
        <p className="note">Get full lifetime access to this course.</p>
        {
          !user ? (
            <button onClick={() => navigate("/login")} className="common-btn">
              Login to Enroll
            </button>
          ) : user.subscription?.includes(course._id) ? (
            <button onClick={() => navigate(`/course/study/${course._id}`)} className="common-btn">
              Study
            </button>
          ) : (
            <button onClick={checkoutHandler} className="common-btn">
              Buy Now
            </button>
          )
        }
      </div>
    </div>
    </div>
   ) }
    
  </>
  }
  </>
  )
}

export default Coursedescription
