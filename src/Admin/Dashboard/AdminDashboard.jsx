import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, PlayCircle, Users, MessageCircleQuestion, Plus, ArrowRight } from "lucide-react";
import api from "../../api/axios";
import AdminLayout from "../Utils/Layout";
import { UserData } from "../../context/UserContext";
import { CourseData } from "../../context/courseContext";
import { formatPrice, getImageUrl, onImageError } from "../../utils/imageUrl";

const AdminDashboard = () => {
  const { user } = UserData();
  const { mycourse } = CourseData();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/api/stats")
      .then(({ data }) => setStats(data.stats))
      .catch(() => setStats({}));
  }, []);

  const cards = [
    { label: "Courses", value: stats?.totalCourses, icon: BookOpen, to: "/admin/course" },
    { label: "Lectures", value: stats?.totalLectures, icon: PlayCircle, to: "/admin/course" },
    { label: "Students", value: stats?.totalUsers, icon: Users, to: "/admin/users" },
    { label: "Pending doubts", value: stats?.pendingQueries, icon: MessageCircleQuestion, to: "/admin/queries", alert: stats?.pendingQueries > 0 },
  ];

  return (
    <AdminLayout
      title={`Welcome, ${user?.name?.split(" ")[0] || "Instructor"}`}
      subtitle="Here's how your courses are doing."
      actions={
        <Link to="/admin/course?new=1" className="btn btn-primary">
          <Plus size={17} /> New course
        </Link>
      }
    >
      <div className="stat-grid">
        {cards.map(({ label, value, icon: Icon, to, alert }) => (
          <Link to={to} key={label} className={`stat-card ${alert ? "alert" : ""}`}>
            <div className="stat-icon">
              <Icon size={20} />
            </div>
            <div>
              <span>{label}</span>
              <strong>{stats ? value ?? 0 : <span className="skeleton" style={{ display: "block", width: 40, height: 28 }} />}</strong>
            </div>
          </Link>
        ))}
      </div>

      <div className="card card-pad" style={{ marginTop: 24 }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
          <h2 className="cd-h2" style={{ margin: 0 }}>
            Your courses
          </h2>
          <Link to="/admin/course" className="btn btn-sm btn-ghost">
            Manage all <ArrowRight size={15} />
          </Link>
        </div>
        {mycourse.length ? (
          <div className="table-list">
            {mycourse.slice(0, 5).map((c) => (
              <Link to={`/lecture/${c._id}`} key={c._id} className="table-row">
                <img src={getImageUrl(c.image)} alt="" onError={onImageError} />
                <div className="table-main">
                  <strong>{c.title}</strong>
                  <span>
                    {c.category} · {c.lectureCount || 0} lectures
                  </span>
                </div>
                <span className="table-price">{formatPrice(c.price)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="muted" style={{ padding: "12px 0" }}>
            You haven't created any courses yet.{" "}
            <Link to="/admin/course?new=1" className="link">
              Create your first course →
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
