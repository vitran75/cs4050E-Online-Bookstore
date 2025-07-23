import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  return (
    <>
      <header className="header">
        <div className="logo">Manage Users</div>
        <Link to="/admin" className="back-link">&larr; Back to Admin</Link>
      </header>

      <main>
      return (
  <>
    <h1 style={{ color: 'white' }}>Manage Users Page Loaded</h1>
  </>
);
        <h1>User List</h1>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
};

export default ManageUsers;