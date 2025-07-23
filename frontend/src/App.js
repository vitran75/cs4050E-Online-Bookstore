import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import ManageBooks from './pages/ManageBooks';
import ManageUsers from './pages/ManageUsers';
import ManagePromotions from './pages/ManagePromotions';
import CheckOut from './pages/CheckOut';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPassword from './components/ForgotPassword';
import Logout from './components/Logout';
import OrderConfirmation from './components/OrderConfirmation';
import OrderHistory from './components/OrderHistory';
import PrivateRoute from './pages/PrivateRoute';
import RoleRoute from './components/RoleRoute';

const App = () => {
  return (
    <Router>
      <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected customer routes */}
            <Route path="/checkout" element={
              <PrivateRoute><CheckOut /></PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute><Profile /></PrivateRoute>
            } />
            <Route path="/logout" element={
              <PrivateRoute><Logout /></PrivateRoute>
            } />
            <Route path="/history" element={
              <PrivateRoute><OrderHistory /></PrivateRoute>
            } />
            <Route path="/order-confirmation" element={
              <PrivateRoute><OrderConfirmation /></PrivateRoute>
            } />

            {/* Admin routes (role-restricted) */}
            <Route path="/admin" element={
              <RoleRoute allowedRole="ADMIN"><AdminPanel /></RoleRoute>
            } />
            <Route path="/admin/books" element={
              <RoleRoute allowedRole="ADMIN"><ManageBooks /></RoleRoute>
            } />
            <Route path="/admin/users" element={
              <RoleRoute allowedRole="ADMIN"><ManageUsers /></RoleRoute>
            } />
            <Route path="/admin/promotions" element={
              <RoleRoute allowedRole="ADMIN"><ManagePromotions /></RoleRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
