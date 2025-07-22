import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import '../styles/Header.css';

const Header = ({ title = 'Online Bookstore' }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <header className="header">
        <div className="logo">{title}</div>
        <div className="header-icons">
          <button className="small-btn" onClick={() => setShowLogin(true)}>Sign-in</button>
          <button className="small-btn" onClick={() => setShowSignup(true)}>Sign-up</button>
          <button className="icon-btn" title="Profile">
            <i className="fas fa-user"></i>
          </button>
          <Link to="/" className="back-link">← Back to Store</Link>
        </div>
      </header>

      {/* Login Modal */}
      <Modal isOpen={showLogin} title="Sign-in" onClose={() => setShowLogin(false)}>
        <form className="modal-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Enter password" required />
          <button type="submit" className="modal-btn">Enter</button>
        </form>
      </Modal>

      {/* Signup Modal */}
      <Modal isOpen={showSignup} title="Sign-up" onClose={() => setShowSignup(false)}>
        <form className="modal-form">
          <input type="email" placeholder="Email" required />
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="New password" required />
          <input type="password" placeholder="Confirm password" required />
          <button type="submit" className="modal-btn">Register</button>
        </form>
      </Modal>
    </>
  );
};

export default Header;
