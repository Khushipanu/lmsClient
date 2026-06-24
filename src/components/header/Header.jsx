
import React from "react";
import "./header.css";
import { Link } from "react-router-dom";
import logo from "../../assets/lms.jpeg";

const Header = ({ isAuth }) => {
  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        <img src={logo} alt="lms" />
        <span>Learning Management System</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/about">About</Link>
        <Link to="/bot">AI Bot</Link>
      </div>

      <div className="nav-action">
        {isAuth ? (
          <Link to="/account" className="account-btn">
            My Account
          </Link>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>

    </nav>
  );
};

export default Header;