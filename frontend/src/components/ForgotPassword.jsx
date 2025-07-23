import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForms.css';

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

    try {
      if (step === 1) {
        await axios.post('http://localhost:8080/api/customers/forgot-password', { email });
        setNotice(`Verification code sent to ${email}`);
        setError('');
        setStep(2);
      } else {
        await axios.post('http://localhost:8080/api/customers/reset-password', {
          email,
          code,
          newPassword,
        });
        setNotice('Password reset successful! Redirecting to login...');
        setError('');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(
          step === 1
              ? 'Unable to send verification code. Please check your email.'
              : 'Invalid code or error occurred. Please try again.'
      );
      setNotice('');
    }
  };

  return (
      <div className="w-full min-h-screen flex items-center justify-center bg-neutral-900 px-4">
        <div className="auth__container">
          <h2 className="auth__title">Forgot Password?</h2>
          <p className="auth__subtitle">Enter your email to receive a reset code.</p>

          {notice && <p className="auth__message text-green-400">{notice}</p>}
          {error && <p className="auth__message text-red-500">{error}</p>}

          <form onSubmit={handleFormSubmit} className="auth__form">
            {step === 1 ? (
                <>
                  <input
                      type="email"
                      value={email}
                      placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth__input"
                      required
                  />
                  <button type="submit" className="auth__button">
                    Send Reset Code
                  </button>
                </>
            ) : (
                <>
                  <input
                      type="text"
                      value={code}
                      placeholder="Enter verification code"
                      onChange={(e) => setCode(e.target.value)}
                      className="auth__input"
                      required
                  />
                  <input
                      type="password"
                      value={newPassword}
                      placeholder="Enter new password"
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="auth__input"
                      required
                  />
                  <button
                      type="submit"
                      className="auth__button"
                      disabled={!code || !newPassword}
                  >
                    Reset Password
                  </button>
                </>
            )}
          </form>

          <div className="auth__links mt-4">
            <p>
              <a href="/login">&larr; Back to Log In</a>
            </p>
          </div>
        </div>
      </div>
  );
};

export default ForgotPassword;
