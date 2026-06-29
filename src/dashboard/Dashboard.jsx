import React, { useEffect } from "react";
import "./Dashboard.css";
import { CourseData } from "../context/courseContext";
import CourseCard from "../components/coursescard/CourseCard";
import { Link } from "react-router-dom";
import { MessageSquare, HelpCircle } from "lucide-react";

const Dashboard = ({ user }) => {
  const { mycourse, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchMyCourse();
  }, []);

  return (
    <div className="student-dashboard">
      <h2>All Enrolled Courses</h2>

      <div className="dashboard-content">
        {mycourse && mycourse.length > 0 ? (
          mycourse.map((e) => <CourseCard key={e._id} course={e} />)
        ) : (
          <p className="empty-text">No courses enrolled yet</p>
        )}
      </div>

      <div className="dashboard-links">
        {user?.role === "admin" ? (
          <Link to="/instructor" className="dashboard-link">
            <MessageSquare size={18} />
            Students' Doubts
          </Link>
        ) : (
          <Link to="/my-queries" className="dashboard-link">
            <HelpCircle size={18} />
            My Doubts
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
