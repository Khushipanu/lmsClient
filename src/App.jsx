import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Verify from "./pages/auth/Verify";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Footer from "./components/footer/Footer";
import About from "./pages/about/About";
import Account from "./pages/Account/Account";
import { UserData } from "./context/UserContext";
import Loading from "./components/loading/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import Courses from "./pages/courses/Courses";
import Coursedescription from "./pages/Coursedescription/Coursedescription";
import Paymentsuccess from "./pages/Paymentsuccess/Paymentsuccess";
import Dashboard from "./dashboard/Dashboard";
import CourseStudy from "./pages/coursestudy/CourseStudy";
import Lecture from "./pages/Lecture/Lecture";
import AdminDashboard from "./Admin/Dashboard/AdminDashboard";
import AdminCourses from "./Admin/Courses/AdminCourses";
import Forgot from "./pages/auth/Forgot";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthSuccess from "./pages/auth/AuthSuccess";
import Bot from "./pages/Bot/Bot";
import MyQueries from "./pages/Query/MyQueries";
import AskQuery from "./pages/Query/AskQuery";
import InstructorQuery from "./pages/Query/InstructorQuery";

const App = () => {
  const { isAuth, user, loading } = UserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Header isAuth={isAuth} />

          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/about" element={<About />} />

            <Route path="/bot" element={<Bot />} />

            <Route path="/courses" element={<Courses />} />

            <Route path="/course/:id" element={<Coursedescription user={user} />} />

            <Route
              path="/login"
              element={isAuth ? <Navigate to="/" /> : <Login />}
            />

            <Route
              path="/account"
              element={<ProtectedRoute isAuth={isAuth}><Account user={user} /></ProtectedRoute>}
            />

            <Route
              path="/register"
              element={isAuth ? <Navigate to="/" /> : <Register />}
            />

            <Route
              path="/verify"
              element={isAuth ? <Navigate to="/" /> : <Verify />}
            />

            <Route
              path="/payment-success/:id"
              element={<ProtectedRoute isAuth={isAuth}><Paymentsuccess user={user} /></ProtectedRoute>}
            />

            <Route
              path="/:id/dashboard"
              element={<ProtectedRoute isAuth={isAuth}><Dashboard user={user} /></ProtectedRoute>}
            />

            <Route
              path="/course/study/:id"
              element={<ProtectedRoute isAuth={isAuth}><CourseStudy user={user} /></ProtectedRoute>}
            />

            <Route
              path="/lecture/:id"
              element={<ProtectedRoute isAuth={isAuth}><Lecture user={user} /></ProtectedRoute>}
            />

            <Route
              path="/admin/dashboard"
              element={
                isAuth && user?.role === "admin"
                  ? <AdminDashboard user={user} />
                  : <Navigate to={isAuth ? "/" : "/login"} />
              }
            />

            <Route
              path="/admin/course"
              element={
                isAuth && user?.role === "admin"
                  ? <AdminCourses user={user} />
                  : <Navigate to={isAuth ? "/" : "/login"} />
              }
            />

            <Route
              path="/forgot"
              element={isAuth ? <Navigate to="/" /> : <Forgot />}
            />

            <Route
              path="/reset-password/:token"
              element={isAuth ? <Navigate to="/" /> : <ResetPassword />}
            />

            <Route
              path="/auth-success"
              element={<AuthSuccess />}
            />

            {/* Student Ask Query */}
            <Route
              path="/ask-query/:courseId"
              element={<ProtectedRoute isAuth={isAuth}><AskQuery /></ProtectedRoute>}
            />
            <Route
              path="/my-queries"
              element={
                isAuth
                  ? user?.role === "admin"
                    ? <Navigate to="/instructor" />
                    : <MyQueries />
                  : <Navigate to="/login" />
              }
            />

            {/* Instructor View Queries */}
            <Route
              path="/instructor"
              element={
                isAuth && user?.role === "admin"
                  ? <InstructorQuery />
                  : <Navigate to={isAuth ? "/" : "/login"} />
              }
            />
           

          </Routes>

          <Footer />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;

