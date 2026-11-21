import { Link } from "react-router-dom";
import { BRAND } from "../config";
import { Logo } from "./ui";

const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-grid">
      <div className="footer-brand">
        <Logo />
        <p>Learn practical skills from real instructors — video lessons, an AI tutor and direct doubt support.</p>
      </div>
      <div>
        <h4>Learn</h4>
        <Link to="/courses">All courses</Link>
        <Link to="/dashboard">My learning</Link>
        <Link to="/bot">AI tutor</Link>
      </div>
      <div>
        <h4>Teach</h4>
        <Link to="/register?role=instructor">Become an instructor</Link>
        <Link to="/admin/dashboard">Instructor dashboard</Link>
      </div>
      <div>
        <h4>Company</h4>
        <Link to="/about">About us</Link>
        <Link to="/account">Account</Link>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>
        © {new Date().getFullYear()} {BRAND}. All rights reserved.
      </span>
      <span>Made with care for learners everywhere.</span>
    </div>
  </footer>
);

export default Footer;
