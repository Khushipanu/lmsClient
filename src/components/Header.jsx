import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  BookOpen,
  User,
  LogOut,
  MessageCircleQuestion,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { UserData } from "../context/UserContext";
import { Avatar, Logo } from "./ui";

const Header = () => {
  const { isAuth, user, logout } = UserData();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isInstructor = user?.role === "admin";

  useEffect(() => {
    setMenuOpen(false);
    setUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e) => menuRef.current && !menuRef.current.contains(e.target) && setUserMenu(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/courses", label: "Courses" },
    ...(isAuth ? [{ to: isInstructor ? "/admin/dashboard" : "/dashboard", label: isInstructor ? "Teach" : "My learning" }] : []),
    ...(isAuth ? [{ to: "/bot", label: "AI Tutor" }] : []),
    { to: "/about", label: "About" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />

        <nav className={`nav ${menuOpen ? "open" : ""}`} aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="nav-link">
              {l.label}
            </NavLink>
          ))}
          {!isAuth && (
            <div className="nav-mobile-auth">
              <Link to="/login" className="btn btn-block">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-block">
                Sign up free
              </Link>
            </div>
          )}
        </nav>

        <div className="header-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode" title="Toggle theme">
            {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          {isAuth ? (
            <div className="user-menu" ref={menuRef}>
              <button className="user-trigger" onClick={() => setUserMenu((v) => !v)} aria-expanded={userMenu}>
                <Avatar name={user?.name} src={user?.avatar} size={32} />
                <span className="user-trigger-name">{user?.name?.split(" ")[0]}</span>
                <ChevronDown size={16} />
              </button>
              {userMenu && (
                <div className="dropdown">
                  <div className="dropdown-head">
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                    <span className="badge badge-primary" style={{ marginTop: 6, width: "fit-content" }}>
                      {isInstructor ? <GraduationCap size={13} /> : <BookOpen size={13} />}
                      {isInstructor ? "Instructor" : "Student"}
                    </span>
                  </div>
                  {isInstructor ? (
                    <Link to="/admin/dashboard" className="dropdown-item">
                      <LayoutDashboard size={17} /> Instructor dashboard
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="dropdown-item">
                      <LayoutDashboard size={17} /> My learning
                    </Link>
                  )}
                  <Link to={isInstructor ? "/admin/queries" : "/my-queries"} className="dropdown-item">
                    <MessageCircleQuestion size={17} /> {isInstructor ? "Student doubts" : "My doubts"}
                  </Link>
                  <Link to="/account" className="dropdown-item">
                    <User size={17} /> Account settings
                  </Link>
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={17} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="header-auth">
              <Link to="/login" className="btn btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          )}

          <button className="icon-btn menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
