import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const logResponse = await axios.post("http://localhost:8080/api/customers/login", {
        email,
        password
      });

      const role = logResponse.data.role;

      if (role === "ADMIN") {
        const response = await axios.get(`http://localhost:8080/api/admins/email/${email}`);
        localStorage.setItem("admin", JSON.stringify(response.data));
        navigate("/AdminPanel");

      } else if (role === "CUSTOMER") {
        const response = await axios.get(`http://localhost:8080/api/customers/email/${email}`);
        localStorage.setItem("customer", JSON.stringify(response.data));
        navigate("/"); // Redirect to home page for customers
      }

    } catch (e) {
      if (e.response?.status === 403) {
        Swal.fire({
          title: "Your Account is Suspended. Contact Support.",
          icon: "error",
          confirmButtonColor: "#e50914"
        });
      } else {
        Swal.fire({
          title: "Invalid Email or Password. Please try again.",
          icon: "error",
          confirmButtonColor: "#e50914"
        });
      }
      setError('Invalid credentials');
    }
  };

  return (
    <div
      className="grid place-items-center min-h-screen"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="shadow-lg p-8 rounded-lg border-t-4 border-red-500 bg-white bg-opacity-90 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-red-600">Log In</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md"
          />

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md"
          />

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Log In
          </button>

          {error && (
            <div className="bg-red-500 text-white text-sm py-1 px-3 rounded-md text-center">
              {error}
            </div>
          )}
        </form>

        <div className="mt-4 text-center text-sm">
          <a href="/forgot-password" className="text-blue-700 hover:underline block">Forgot Password?</a>
          <a href="/Sign-Up" className="text-gray-800 hover:underline block mt-2">
            Don’t have an account? <span className="font-medium">Sign Up now</span>
          </a>
          <a href="/Sign-Up/Admin" className="text-gray-800 hover:underline block mt-1">
            Are you an admin? <span className="font-medium">Sign Up here</span>
          </a>
        </div>
      </div>
    </div>
  );
}
