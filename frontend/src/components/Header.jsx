import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {jwtDecode} from 'jwt-decode';

const Header = ({ title = 'BookByte' }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let isLoggedIn = false;

  try {
    if (token) {
      const decoded = jwtDecode(token);
      isLoggedIn = decoded && decoded.exp * 1000 > Date.now(); // token still valid
    }
  } catch (err) {
    isLoggedIn = false;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">{title}</div>
      <div className="header-icons">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="small-btn">Sign-in</Link> 
            <Link to="/signup" className="small-btn">Sign-up</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="small-btn">Sign-out</button>
        )}

        <Link to="/checkout" className="icon-btn" title="Cart">
          <i className="fas fa-shopping-cart"></i>
        </Link>
        <Link to="/profile" className="icon-btn" title="Profile">
          <i className="fas fa-user-circle"></i>
        </Link>

        <Link to="/" className="back-link">← Back to Store</Link>
      </div>
    </header>
  );
};

export default Header;
