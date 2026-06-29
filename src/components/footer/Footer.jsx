import React from 'react'
import './Footer.css'
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p className="footer-brand">LMS Platform</p>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} LMS Platform. All rights reserved.
        </p>
        <div className="social-links">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
