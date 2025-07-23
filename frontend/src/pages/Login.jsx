import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/AuthForms.css';

const LogInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/customers/login", {
        email,
        password
      });

      const { role, token } = response.data;
      localStorage.setItem('token', token);

      const userEndpoint =
          role === "ADMIN"
              ? `http://localhost:8080/api/admins/email/${email}`
              : `http://localhost:8080/api/customers/email/${email}`;

      const res = await axios.get(userEndpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.setItem(
          role === "ADMIN" ? "admin" : "customer",
          JSON.stringify(res.data)
      );

      navigate(role === "ADMIN" ? "/admin" : "/");
    } catch (e) {
      const msg =
          e.response?.status === 403
              ? "Your account is suspended. Contact support."
              : "Invalid Email or Password.";

      Swal.fire({
        title: e.response?.data || msg,
        icon: "error",
        confirmButtonColor: "#e50914"
      });
    }
  };

  return (
      <div className="w-full min-h-screen flex items-center justify-center bg-neutral-900 px-4">
        <div className="auth__container">
          <h2 className="auth__title">Sign In</h2>

          <form onSubmit={handleSubmit} className="auth__form">
            <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="auth__input"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="auth__input"
            />

            <button type="submit" className="auth__button">
              Log In
            </button>
          </form>

          <div className="auth__links">
            <p>
              <a href="/forgot-password">Forgot Password?</a>
            </p>
            <p>
              Don’t have an account? <a href="/signup">Sign Up now</a>
            </p>
            <p>
              Are you an admin? <a href="/signup">Sign Up here</a>
            </p>
          </div>
        </div>
      </div>
  );
};

export default LogInPage;
