import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LogIn-SignUp.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      // Request password reset code
      try {
        await axios.post('http://localhost:8080/api/customers/forgot-password', { email });
        setNotice(`Verification code sent to ${email}`);
        setError('');
        setStep(2);
      } catch (err) {
        setError('Unable to send verification code. Please check your email.');
        setNotice('');
      }
    } else if (step === 2) {
      // Submit new password
      try {
        await axios.post('http://localhost:8080/api/customers/reset-password', {
          email,
          code,
          newPassword,
        });
        setNotice('Password reset successful! Redirecting to login...');
        setError('');
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        setError('Invalid code or error occurred. Please try again.');
        setNotice('');
      }
    }
  };

  return (
    <div className="forgot__password__container">
      <h2 className="forgot__password__h2">Forgot Password?</h2>
      <p className="forgot__password__h2">
        Enter your email to receive a reset code.
      </p>

      {notice && <p className="forgot__password__message">{notice}</p>}
      {error && <p className="forgot__password__message" style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleFormSubmit} className="forgot__password__form">
        {step === 1 && (
          <>
            <label htmlFor="email" className="forgot__password__h2">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              required
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="forgot__password__input"
            />
            <button type="submit" className="forgot__password__button">
              Send Reset Code
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label htmlFor="code" className="forgot__password__h2">Verification Code</label>
            <input
              id="code"
              type="text"
              value={code}
              required
              placeholder="Enter the code"
              onChange={(e) => setCode(e.target.value)}
              className="forgot__password__input"
            />

            <label htmlFor="newPassword" className="forgot__password__h2">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              required
              placeholder="Enter your new password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="forgot__password__input"
            />

            <button
              type="submit"
              className="forgot__password__button"
              disabled={!code || !newPassword}
            >
              Reset Password
            </button>
          </>
        )}
      </form>

      <p className="forgot__password__back-to-login">
        <a href="/login">← Back to Log In</a>
      </p>
    </div>
  );
};

export default ForgotPassword;
