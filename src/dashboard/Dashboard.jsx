import { Link, Navigate } from "react-router-dom";
import { BookOpen, Compass, MessageCircleQuestion, Sparkles } from "lucide-react";
import { CourseData } from "../context/courseContext";
import { UserData } from "../context/UserContext";
import CourseCard, { CourseCardSkeleton } from "../components/CourseCard";
import { EmptyState } from "../components/ui";

const Dashboard = () => {
  const { user } = UserData();
  const { mycourse, myLoading } = CourseData();

  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="page">
      <div className="container">
        <div className="welcome-card fade-up">
          <div>
            <span className="eyebrow">My learning</span>
            <h1>
              {greeting}, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p>
              {mycourse.length
                ? `You're enrolled in ${mycourse.length} ${mycourse.length === 1 ? "course" : "courses"}. Keep the streak going!`
                : "You haven't enrolled in any courses yet — let's find your first one."}
            </p>
          </div>
          <div className="welcome-actions">
            <Link to="/bot" className="quick-link">
              <Sparkles size={20} />
              <span>Ask AI tutor</span>
            </Link>
            <Link to="/my-queries" className="quick-link">
              <MessageCircleQuestion size={20} />
              <span>My doubts</span>
            </Link>
            <Link to="/courses" className="quick-link">
              <Compass size={20} />
              <span>Explore</span>
            </Link>
          </div>
        </div>

        <div className="section-head" style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 22 }}>Enrolled courses</h2>
        </div>

        {myLoading && !mycourse.length ? (
          <div className="grid grid-courses">
            {[1, 2, 3].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : mycourse.length ? (
          <div className="grid grid-courses">
            {mycourse.map((c) => (
              <CourseCard key={c._id} course={c} enrolled />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            text="Browse the catalog and enroll in a course to start learning."
            action={
              <Link to="/courses" className="btn btn-primary">
                Browse courses
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
