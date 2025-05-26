import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <img src="/assets/logo.png" alt="logo" className="logo" />
    <div>
      <Link to="/">Home</Link>
      <Link to="/blog">Blog</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/profile">Profile</Link>
    </div>
    <div>
      <Link to="/login" className="btn">Log in</Link>
      <Link to="/register" className="btn primary">Register</Link>
    </div>
  </nav>
);

export default Navbar;
