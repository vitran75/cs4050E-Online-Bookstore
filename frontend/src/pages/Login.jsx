import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

      // 🔐 Save token
      localStorage.setItem('token', token);

      if (role === "ADMIN") {
        const res = await axios.get(`http://localhost:8080/api/admins/email/${email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.setItem("admin", JSON.stringify(res.data));
        navigate("/admin");
      } else if (role === "CUSTOMER") {
        const res = await axios.get(`http://localhost:8080/api/customers/email/${email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.setItem("customer", JSON.stringify(res.data));
        navigate("/");
      }
    } catch (e) {
      const msg = e.response?.status === 403
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
      <div className="bg-black w-full max-w-md p-8 rounded-lg shadow-lg border border-neutral-700">
        <h2 className="text-center text-white text-xl font-semibold mb-6">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white mb-1">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-1">Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition duration-200"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-400 space-y-2">
          <a href="/forgot-password" className="block text-red-500 hover:underline">
            Forgot Password?
          </a>
          <a href="/signup" className="block hover:underline">
            Don’t have an account? <span className="text-red-500 font-medium">Sign Up now</span>
          </a>
          <a href="/signup" className="block hover:underline">
            Are you an admin? <span className="text-red-500 font-medium">Sign Up here</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
