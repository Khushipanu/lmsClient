import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserData } from "./context/UserContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AiFab from "./components/AiFab";
import { PageLoader, ProtectedRoute } from "./components/ui";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Courses from "./pages/courses/Courses";
import Coursedescription from "./pages/Coursedescription/Coursedescription";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import Forgot from "./pages/auth/Forgot";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthSuccess from "./pages/auth/AuthSuccess";
import Account from "./pages/Account/Account";
import Dashboard from "./dashboard/Dashboard";
import Lecture from "./pages/Lecture/Lecture";
import Paymentsuccess from "./pages/Paymentsuccess/Paymentsuccess";
import Bot from "./pages/Bot/Bot";
import AskQuery from "./pages/Query/AskQuery";
import MyQueries from "./pages/Query/MyQueries";
import InstructorQuery from "./pages/Query/InstructorQuery";
import AdminDashboard from "./Admin/Dashboard/AdminDashboard";
import AdminCourses from "./Admin/Courses/AdminCourses";
import AdminUsers from "./Admin/Users/AdminUsers";
import NotFound from "./pages/NotFound";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/** Pages only for logged-out visitors (login, register…). */
const GuestRoute = ({ children }) => {
  const { isAuth, user } = UserData();
  const location = useLocation();
  if (!isAuth) return children;
  const from = location.state?.from;
  return <Navigate to={from || (user?.role === "admin" ? "/admin/dashboard" : "/dashboard")} replace />;
};

const RedirectToLecture = () => <Navigate to={`/lecture/${useParams().id}`} replace />;

const App = () => {
  const { isAuth, user, loading } = UserData();
  const isInstructor = user?.role === "admin";

  if (loading) return <PageLoader full label="Loading…" />;

  const auth = (el, allow = true) => (
    <ProtectedRoute isAuth={isAuth} allow={allow}>
      {el}
    </ProtectedRoute>
  );

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<Coursedescription />} />

          {/* Auth */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/verify" element={<GuestRoute><Verify /></GuestRoute>} />
          <Route path="/forgot" element={<GuestRoute><Forgot /></GuestRoute>} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth-success" element={<AuthSuccess />} />

          {/* Logged in */}
          <Route path="/dashboard" element={auth(<Dashboard />)} />
          <Route path="/:id/dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/account" element={auth(<Account />)} />
          <Route path="/lecture/:id" element={auth(<Lecture />)} />
          <Route path="/course/study/:id" element={<RedirectToLecture />} />
          <Route path="/payment-success/:id" element={auth(<Paymentsuccess />)} />
          <Route path="/bot" element={auth(<Bot />)} />
          <Route path="/ask-query/:courseId" element={auth(<AskQuery />)} />
          <Route
            path="/my-queries"
            element={isInstructor ? <Navigate to="/admin/queries" replace /> : auth(<MyQueries />)}
          />

          {/* Instructor */}
          <Route path="/admin/dashboard" element={auth(<AdminDashboard />, isInstructor)} />
          <Route path="/admin/course" element={auth(<AdminCourses />, isInstructor)} />
          <Route path="/admin/users" element={auth(<AdminUsers />, isInstructor)} />
          <Route path="/admin/queries" element={auth(<InstructorQuery />, isInstructor)} />
          <Route path="/instructor" element={<Navigate to="/admin/queries" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <AiFab />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "var(--primary)", secondary: "var(--on-primary)" } },
        }}
      />
    </BrowserRouter>
  );
};

export default App;
