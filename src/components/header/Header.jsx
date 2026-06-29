import React, { useState } from "react";
import "./header.css";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/lms.jpeg";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

const Header = ({ isAuth }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="LMS logo" />
        <span>LMS</span>
      </Link>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/courses" onClick={() => setMenuOpen(false)}>Courses</NavLink>
        <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
        <NavLink to="/bot" onClick={() => setMenuOpen(false)}>AI Bot</NavLink>
      </div>

      <div className="nav-action">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

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

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </nav>
  );
};

export default Header;
