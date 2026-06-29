import React, { useEffect, useState } from 'react'
import './Lecture.css'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import Loading from '../../components/loading/Loading'
import toast from 'react-hot-toast'
import { CourseData } from '../../context/courseContext'
import { getImageUrl } from '../../utils/imageUrl'

const Lecture = ({user}) => {
    const [lectures,setLectures]=useState([])
    const [lecture,setLecture]=useState([])
    const [loading,setLoading]=useState(true)
    const [lecLoading,setLecLoading]=useState(false)
    const [show,setShow]=useState(false)
    const params=useParams();
    const navigate=useNavigate()
    const [title,setTitle]=useState("")
    const [description,setDescription]=useState("")
    const [video,setVideo]=useState("")
    const [videoPrev,setVideoPrev]=useState("")
    const [btnLoading,setBtnLoading]=useState(false)
    const { fetchCourse, course } = CourseData()

    useEffect(()=>{
        if(user && user.role!=="admin" && !user.subscription?.includes(params.id) ){
            navigate("/")
        }
    },[user, params.id, navigate])

    useEffect(() => {
        fetchCourse(params.id)
        fetchLectures()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function fetchLectures(){
        try{
            const {data}=await api.get(`/api/lectures/${params.id}`)
            setLectures(data.lectures)
            setLoading(false)


        }catch(err){
            console.log(err)
            setLoading(false)
        }
    }
    async function fetchLecture(id){
        try{
            const {data}=await api.get(`/api/lecture/${id}`)
            setLecture(data.lecture)
            setLecLoading(false)
        }catch(err){
            console.log(err);
            setLecLoading(false)
        }
    }
    const changeVideoHandler=(e)=>{
        const file=e.target.files[0];
        const reader=new FileReader()
        reader.readAsDataURL(file);
        reader.onloadend=()=>{
            setVideoPrev(reader.result);
            setVideo(file)
        }
    }


    const submitHandler=async(e)=>{
        setBtnLoading(true);
        e.preventDefault()
        const myForm=new FormData()
        myForm.append("title",title)
        myForm.append("description",description)
        myForm.append("file",video) //make sure to write file
        try{
            const {data}=await api.post(`/api/courses/${params.id}`,myForm)
            toast.success(data.message)
            setBtnLoading(false)
            setShow(false)
            fetchLectures();
            setTitle("")
            setDescription("")
            setVideo("")
        }catch(err){
            toast.error(err.response.data.message)
            setBtnLoading(false)
           

}
    }
    const deleteHandler=async(id)=>{
        if(confirm("Are you sure You want to delete this lecture")){
            try{
                const {data}=await api.delete(`/api/lecture/${id}`)
                toast.success(data.message)
                fetchLectures()

            }catch(err){
                toast.error(err.response.data.message)
            }
        }


    }



  return (
   <>


   { loading?   <Loading/> :
   <>
   <div className="lecture-page">
      <div className="left">
        {
            lecLoading?<Loading/> : <> 
            { lecture.video ? (
              <div className="video-player">
                <video
                  src={getImageUrl(lecture.video)}
                  width={"100%"}
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                  autoPlay
                >
                </video>
                <div className="video-info">
                  <h1>{lecture.title} </h1>
                  <h3>{lecture.description}</h3>
                </div>
              </div>
            ) : (
              <div className="no-video">
                {course && (
                  <>
                    <img
                      src={getImageUrl(course.image)}
                      alt={course.title}
                      onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder-course.svg"; }}
                    />
                    <div className="no-video-content">
                      <h1>Select a Lecture</h1>
                      <p>Choose a lecture from the list to start watching.</p>
                    </div>
                  </>
                )}
              </div>
            )}
             </> 
        }
      </div>
      <div className="right">
        {user && user.role==="admin" && (
          <button className="common-btn toggle-form-btn" onClick={()=>setShow(!show)} >
            {show? "Close" : "Add Lecture +"}
          </button>
        )}
        {
            show && (
              <div className="lecture-form">
                <h2>Add Lecture</h2>
                <form onSubmit={submitHandler} >
                  <label htmlFor="lecture-title">Title</label>
                  <input
                    type="text"
                    id="lecture-title"
                    value={title}
                    onChange={e=>setTitle(e.target.value)}
                    required
                  />

                  <label htmlFor="lecture-description">Description</label>
                  <input
                    type="text"
                    id="lecture-description"
                    value={description}
                    onChange={e=>setDescription(e.target.value)}
                    required
                  />

                  <input
                    type="file"
                    placeholder="choose video"
                    onChange={changeVideoHandler}
                    required
                  />
                  {
                    videoPrev && <video src={videoPrev} alt="" width={300} controls> </video>
                  }
                  <button disabled={btnLoading} type="submit" className="common-btn" >
                    {btnLoading ? "Pls wait ..." : " Add"}
                  </button>
                </form>
              </div>
            )
        }
        <div className="lecture-list">
          {
            lectures && lectures.length > 0 ?
            lectures.map((e,i)=> (
              <div key={i} className="lecture-item">
                <div
                  onClick={()=>fetchLecture(e._id)}
                  className={`lecture-number ${lecture._id === e._id ? "active" : ""}`}
                >
                  <span className="lecture-index">{i + 1}</span>
                  <span className="lecture-title">{e.title}</span>
                </div>
                {
                  user && user.role==="admin" && (
                    <button
                      onClick={()=>deleteHandler(e._id)}
                      className="common-btn delete-btn"
                    >
                      Delete {e.title}
                    </button>
                  )
                }
              </div>
            ))
            : <p className="empty-message">No lectures yet</p>
          }
        </div>
      </div>
   </div>
   </>

   }



   </>
  )
}

export default Lecture
