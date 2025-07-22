import React, { useState } from 'react';
import axios from 'axios';
import '../LogIn-SignUp.css';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!codeSent) {
      // Request verification code
      try {
        await axios.post('http://localhost:8080/api/customers/forgot-password', { email });
        setInfoMessage(`A verification code has been sent to ${email}.`);
        setErrorMessage('');
        setCodeSent(true);
      } catch (err) {
        setErrorMessage('Failed to send verification code. Please try again.');
        setInfoMessage('');
      }
    } else if (code && newPassword) {
      // Submit new password with code
      try {
        await axios.post('http://localhost:8080/api/customers/reset-password', { email, code, newPassword });
        setInfoMessage('Your password has been reset successfully.');
        setErrorMessage('');
        navigate('/Log-In');
      } catch (err) {
        setErrorMessage('Invalid code. Please double-check and try again.');
        setInfoMessage('');
      }
    }
  };

  return (
    <div className="forgot__password__container">
      <h2 className="forgot__password__h2">Reset Your Password</h2>
      <p className="forgot__password__h2">Enter your email to receive a password reset code.</p>

      {infoMessage && <p className="forgot__password__message">{infoMessage}</p>}
      {errorMessage && <p className="forgot__password__message" style={{ color: 'red' }}>{errorMessage}</p>}

      <form className="forgot__password__form" onSubmit={handlePasswordReset}>
        {!codeSent ? (
          <>
            <label htmlFor="email" className="forgot__password__h2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="forgot__password__input"
              placeholder="you@example.com"
            />
            <button type="submit" className="forgot__password__button">Send Code</button>
          </>
        ) : (
          <>
            <label htmlFor="code" className="forgot__password__h2">Verification Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="forgot__password__input"
              placeholder="Enter code"
            />
            {code && (
              <>
                <label htmlFor="newPassword" className="forgot__password__h2">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="forgot__password__input"
                  placeholder="Enter new password"
                />
              </>
            )}
            <button type="submit" className="forgot__password__button">
              {newPassword ? 'Update Password' : 'Verify Code'}
            </button>
          </>
        )}
      </form>

      <p className="forgot__password__back-to-login">
        <a href="/Log-In">← Return to Login</a>
      </p>
    </div>
  );
};

export default ForgotPassword;
