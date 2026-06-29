import React, { useEffect } from "react";
import "./CourseStudy.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/courseContext";
import { getImageUrl } from "../../utils/imageUrl";

const CourseStudy = ({ user }) => {
  const params = useParams();
  const { fetchCourse, course } = CourseData();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      user &&
      user.role !== "admin" &&
      !user.subscription?.includes(params.id)
    ) {
      navigate("/");
    } else {
      fetchCourse(params.id);
    }
  }, [user, params.id]);

  return (
    <>
      {course && (
        <div className="course-study-page">
          <div className="course-study-hero">
            <img
              src={getImageUrl(course.image)}
              alt={course.title}
              onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder-course.svg"; }}
            />

            <h2>{course.title}</h2>
            <p className="description">{course.description}</p>
            <div className="course-meta">
              <span>Instructor: {course.createdBy}</span>
              <span>Duration: {course.duration} weeks</span>
            </div>

            <div className="course-study-actions">
              <button
                className="common-btn watch-btn"
                onClick={() => navigate(`/lecture/${course._id}`)}
              >
                Watch Lectures
              </button>

              {user &&
                user.subscription?.includes(course._id) &&
                user._id !== course.createdBy && (
                  <button
                    className="ask-doubt-btn"
                    onClick={() => navigate(`/ask-query/${course._id}`)}
                  >
                    Ask Doubt
                  </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseStudy;
