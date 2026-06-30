
import React from 'react'
import "./CourseCard.css"
import { UserData } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { CourseData } from '../../context/courseContext'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../utils/imageUrl'

const CourseCard = ({ course, showAdminActions = true }) => {
  const navigate = useNavigate()
  const { user, isAuth } = UserData()
  const { fetchCourses } = CourseData()

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        const { data } = await api.delete(`/api/course/${id}`)
        toast.success(data.message)
        fetchCourses()
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong")
      }
    }
  }

  // ✅ Check if admin created this course (works with name or ID)
  const isCreatedByAdmin =
    user &&
    user.role === "admin" &&
    (course.createdBy === user.name || course.createdBy === user._id)

  return (
    <div>
      <div className="course-card">
        <img
          src={getImageUrl(course.image)}
          alt={course.title}
          className="course-image"
          onError={(e) => { e.target.src = "/placeholder-course.svg"; }}
        />
        <h3>{course.title}</h3>
        <p>Instructor - {course.createdBy}</p>
        <p>Duration - {course.duration} weeks</p>
        <p>Price - ₹{course.price}</p>

        {/* ------------------- MAIN BUTTON LOGIC ------------------- */}
        {!isAuth || !showAdminActions ? (
          // ❌ Public / courses listing: always show Get Started
          <button onClick={() => navigate(isAuth ? `/course/${course._id}` : `/login`)} className="common-btn">
            Get Started
          </button>
        ) : (
          <>
            {/* ✅ If admin in admin view */}
            {user.role === "admin" ? (
              <>
                {isCreatedByAdmin ? (
                  <>
                    <button
                      onClick={() => navigate(`/course/study/${course._id}`)}
                      className="common-btn"
                    >
                      Study
                    </button>
                    <br />
                    <button
                      onClick={() => deleteHandler(course._id)}
                      className="common-btn"
                      style={{ backgroundColor: "red" }}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  // Admin who did NOT create this course → only Get Started
                  <button
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="common-btn"
                  >
                    Get Started
                  </button>
                )}
              </>
            ) : (
              // ✅ Normal logged-in user in admin/private view
              user.subscription?.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="common-btn"
                >
                  Get Started
                </button>
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CourseCard
