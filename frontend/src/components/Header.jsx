import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

const Header = ({ title = 'BookByte' }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let isLoggedIn = false;

  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isLoggedIn = payload && payload.exp * 1000 > Date.now();
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
        <div className="header-content">
          <h1 className="logo">{title}</h1>

          <div className="nav-container">
            <div className="auth-section">
              {isLoggedIn ? (
                  <>
                    <div className="icon-container" onClick={() => navigate('/profile')}>
                      <FontAwesomeIcon icon={faUser} size="lg" />
                      <span className="icon-label">Profile</span>
                    </div>

                    <div className="icon-container" onClick={() => navigate('/checkout')}>
                      <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                      <span className="icon-label">Cart</span>
                    </div>

                    <button className="btn" onClick={handleLogout}>Sign Out</button>
                  </>
              ) : (
                  <>
                    <button className="btn" onClick={() => navigate('/login')}>Sign In</button>
                    <button className="btn" onClick={() => navigate('/signup')}>Sign Up</button>
                  </>
              )}
            </div>

            <button className="btn back-to-store" onClick={() => navigate('/')}>
              Back to Store
            </button>
          </div>
        </div>
      </header>
  );
};

export default Header;
