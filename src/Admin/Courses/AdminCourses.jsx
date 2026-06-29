import React, { useEffect, useState } from 'react'
import Layout from '../Utils/Layout'
import { useNavigate } from 'react-router-dom'
import { CourseData } from '../../context/courseContext';
import CourseCard from '../../components/coursescard/CourseCard';
import "./AdminCourses.css";
import toast from 'react-hot-toast';
import api from '../../api/axios';

const categories=[
    "Web Development",
    "App Development",
    "Game Development",
    "Data Science",
    "Artificial Intelligence"
]

const AdminCourses = ({user}) => {
    const navigate=useNavigate();
    const {courses,fetchCourses}=CourseData()
    
    const [title,setTitle]=useState("")
    const [description,setDescription]=useState("")
    const [category,setCategory]=useState("")
    const [price,setPrice]=useState("")
    const [duration,setDuration]=useState("")
    const [image,setImage]=useState("")
    const [imagePrev,setImagePrev]=useState("")
    const [btnLoading,setBtnLoading]=useState(false)
    const [showForm,setShowForm]=useState(false)
    
    // Double-check admin role - redirect if not admin
    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);
    
    if (!user || user.role !== "admin") {
        return null; // Don't render anything while redirecting
    }
    
    
        const changeImageHandler=(e)=>{
        const file=e.target.files[0];
        const reader=new FileReader()
        reader.readAsDataURL(file);
        reader.onloadend=()=>{
            setImagePrev(reader.result);
            setImage(file)
        }
    };
    

    const submitHandler=async(e)=>{
        e.preventDefault();
        setBtnLoading(true);

        const myForm= new FormData()
        myForm.append("title",title);
        myForm.append("category",category);
        myForm.append("price",price);
        myForm.append("duration",duration);
        myForm.append("description", description);
        myForm.append("createdBy",user._id);
        myForm.append("file",image);

        try{
            const {data}=await api.post("/api/course/new",myForm)
            toast.success(data.message)
            setBtnLoading(false)
            await fetchCourses()
            setImage("")
            setTitle("")
            setDescription("")
            setDuration("")
            setImagePrev("")
            setPrice("")
            setCategory("")

        }catch(err){
            toast.error(err.response?.data?.message);
            setBtnLoading(false)
        }
    }

    const myCourses = courses
        ? courses.filter(course => course.createdBy === user._id || course.createdBy === user.name)
        : [];

  return (
   <Layout>
     <div className="admin-courses">
        <div className="left">
            <h1>My Courses</h1>
            <div className="dashboard-content">
                {
                    myCourses.length > 0
                    ? myCourses.map(course => <CourseCard key={course._id} course={course} />)
                    : <p>No courses yet</p>
                }
            </div>
        </div>
        <div className="right">
            <button
                type="button"
                className="common-btn toggle-form-btn"
                onClick={() => setShowForm((prev) => !prev)}
            >
                {showForm ? "Close" : "Add Course"}
            </button>

            {showForm && (
                <div className="add-course">
                    <div className="course-form">
                        <h2>Add Course</h2>
                        <form onSubmit={submitHandler} >
                            <label htmlFor="text">Title</label>
                            <input type="text"
                             value={title} 
                             onChange={(e)=>setTitle(e.target.value)} 
                             required />

                             <label htmlFor="text">Description</label>
                            <input type="text"
                             value={description} 
                             onChange={(e)=>setDescription(e.target.value)} 
                             required />

                             <label htmlFor="text">Price</label>
                            <input type="number"
                             value={price} 
                             onChange={(e)=>setPrice(e.target.value)} 
                             required />


                             <select value={category} 
                             onChange={(e)=>setCategory(e.target.value)}>
                                <option value={""}> Select Category </option>
                                {
                                    categories.map((e)=> (
                                        <option value={e} key={e}> {e} </option>
                                    ))
                                }
                             </select>

                            <label htmlFor="text">Duration</label>

                            <input type="number"
                             value={duration} 
                             onChange={(e)=>setDuration(e.target.value)} 
                             required /> 

                             <input type="file" required onChange={changeImageHandler} />
                             {imagePrev && <img src={imagePrev} alt="preview" width={300}/> }
                             <button type="submit" disabled={btnLoading} className="common-btn" >
                                {btnLoading?"Pls wait" : "Add"}
                             </button>

                        </form>
                    </div>
                </div>
            )}
        </div>
     </div>
   </Layout>
  )
}

export default AdminCourses;
