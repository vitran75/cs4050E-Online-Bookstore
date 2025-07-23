import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminPanel.css';

const ManagePromotions = () => {
  return (
    <main>
      <h1>Manage Promotions</h1>
      <p style={{ color: '#bbb' }}>This is where you'll manage promotions.</p>
      <Link to="/admin" className="back-link">← Back to Admin Panel</Link>
    </main>
  );
};

export default ManagePromotions;
