import React from 'react'
import "./Coursedescription.css"
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { CourseData } from '../../context/courseContext'
import { useEffect } from 'react'
import { server } from '../../main'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { UserData } from '../../context/UserContext'
import Loading from '../../components/loading/Loading'

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
    const token=localStorage.getItem("token")
    setLoading(true)
    const {data:{order}}=await axios.post(`${server}/api/course/checkout/${params.id}`,{},{
        headers:{
            token:token,
        },
    })
    const options={
    key: "rzp_test_ROslDaduV67FAP",// Enter the Key ID generated from the Dashboard
    amount: order.id, // Amount is in currency subunits. 
    currency: "INR",
    name: "LMS", //your business name
    description: "Learning management system",
    order_id: order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler:async function(response){
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=response;
        try{
            const {data}=await axios.post(`${server}/api/verification/${params.id}`,{
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature

            },{
                headers:{
                    token,
                }
            }
        );
        await fetchUser();
        await fetchCourses();
        await fetchMyCourse();
        toast.success(data.message);
        setLoading(false)
        navigate(`/payment-success/${razorpay_payment_id}`)



        }catch(err){
            toast.error(err.response.data.message)
            setLoading(false)
        }
    },
    modal: {
        ondismiss: function(){
            setLoading(false);
            navigate("/");
            toast.info("Payment cancelled");
        }
    },
    theme:{
        color:"#8a4baf"

    }
   

    }
    const razorpay=new window.Razorpay(options);
    razorpay.open()

}

  return (
  <>{
    loading? <Loading/> :  <>
  {course && 
  (<div className="course-description" > 
    <div className="course-header">
        
        <img src={`${server}/${course.image}`} alt="" 
        />
        <div className="course-info" >
            <h2> {course.title}   </h2>
            <p>Instructor:{course.createdBy}</p>
            <p>Duration:{course.duration} weeks </p>
             </div>

    </div>
                   <p>{course.description}</p>
                   <p>Let's get started with course at ₹{course.price}</p>
            {
                user && user.subscription.includes(course._id)? 
                (
                <button onClick={()=>navigate(`/course/study/${course._id}`)} className="common-btn">Study</button>
            ):(
                <button onClick={checkoutHandler} className="common-btn" >Buy Now </button>
            )
            }
    
   
     
    </div>
   ) }
    
  </>
  }
  </>
  )
}

export default Coursedescription
