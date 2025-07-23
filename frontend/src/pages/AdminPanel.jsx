import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  return (
    <>
      <header className="header">
        <div className="logo">Admin View</div>
        <Link to="/" className="back-link">&larr; Back to Store</Link>
      </header>

      <main>
        <h1>Admin Dashboard</h1>
        <div className="admin-grid">
          <Link to="/admin/books" className="admin-card">
            <i className="fas fa-book"></i>
            <span>Manage Books</span>
          </Link>

          <Link to="/admin/users" className="admin-card">
            <i className="fas fa-users-cog"></i>
            <span>Manage Users</span>
          </Link>

          <Link to="/admin/promotions" className="admin-card">
            <i className="fas fa-tags"></i>
            <span>Manage Promotions</span>
          </Link>
        </div>
      </main>
    </>
  );
};

export default AdminPanel;