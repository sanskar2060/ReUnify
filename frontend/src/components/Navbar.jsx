// components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src="/assets/logo.png" alt="logo" className="logo" />
          <span className="app-name">ReUnify</span>
        </Link>
      </div>
      
      <div className="navbar-middle">
        {isLoggedIn ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/events">Events</Link>
            <Link to="/network">Network</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/stories">Stories</Link>
            <Link to="/profile">Profile</Link>
          </>
        ) : (
          <Link to="/">Home</Link>
        )}
      </div>
      
      <div className="navbar-right">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="btn logout-btn">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;