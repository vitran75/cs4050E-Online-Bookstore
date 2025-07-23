import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const InputField = ({ type, placeholder, icon, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const actualType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="relative w-full">
      <input
        type={actualType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-2 pr-10 bg-zinc-800 text-white border border-zinc-600 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
      />
      {icon && type !== 'password' && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
          <i className="material-symbols-outlined">{icon}</i>
        </span>
      )}
      {type === 'password' && (
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 cursor-pointer"
        >
          <i className="material-symbols-outlined">
            {showPassword ? 'visibility' : 'visibility_off'}
          </i>
        </span>
      )}
    </div>
  );
};

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const logResponse = await axios.post("http://localhost:8080/api/customers/login", { email, password });
      const role = logResponse.data.role;

      if (role === "ADMIN") {
        const response = await axios.get(`http://localhost:8080/api/admins/email/${email}`);
        localStorage.setItem("admin", JSON.stringify(response.data));
        navigate("/admin");
      } else if (role === "CUSTOMER") {
        const response = await axios.get(`http://localhost:8080/api/customers/email/${email}`);
        localStorage.setItem("customer", JSON.stringify(response.data));
        navigate("/");
      }
    } catch (e) {
      Swal.fire({
        title: e.response?.status === 403 ? "Your Account is Suspended. Contact Support." : "Invalid Email or Password. Please try again.",
        icon: "error",
        confirmButtonColor: "#e50914"
      });
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="bg-zinc-900 w-full max-w-md p-8 rounded-lg shadow-2xl border border-zinc-800">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">Log In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            type="email"
            value={email}
            placeholder="Email"
            icon="mail"
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type="password"
            value={password}
            placeholder="Password"
            icon="lock"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition duration-200"
          >
            Log In
          </button>
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        </form>

        <div className="mt-6 text-center text-sm text-zinc-300 space-y-2">
          <a href="/forgot-password" className="text-blue-500 hover:underline block">Forgot Password?</a>
          <a href="/signup" className="hover:underline block">
            Don’t have an account? <span className="font-medium text-red-500">Sign Up now</span>
          </a>
          <a href="/Sign-Up/Admin" className="hover:underline block">
            Are you an admin? <span className="font-medium text-red-500">Sign Up here</span>
          </a>
        </div>
      </div>
    </div>
  );
}
