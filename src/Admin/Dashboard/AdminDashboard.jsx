import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import api from "../../api/axios";
import "./AdminDashboard.css";


const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLectures: 0,
    totalUsers: 0,
  });

  async function fetchStats() {
    try {
      const { data } = await api.get("/api/stats");
      setStats(data.stats);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchStats();
  }, [user, navigate]);
  return (
    <div>
      <Layout>
        <div className="main-content">
          <div className="box">
            <p>My Courses</p>
            <p>{stats.totalCourses}</p>
          </div>
          <div className="box">
            <p>Total Lectures</p>
            <p>{stats.totalLectures}</p>
          </div>
          <div className="box">
            <p>Enrolled Users</p>
            <p>{stats.totalUsers}</p>
          </div>
        </div>
      </Layout>

      <Link to="/instructor">Student Queries</Link>
    </div>
  );
};

export default AdminDashboard;
