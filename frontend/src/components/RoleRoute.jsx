import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const RoleRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const { exp, role } = jwtDecode(token);

    if (Date.now() >= exp * 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    if (role !== allowedRole) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};

export default RoleRoute;
