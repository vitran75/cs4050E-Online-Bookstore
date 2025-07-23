import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminUsers.css';

const API_BASE = 'http://localhost:8080/api/customers';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: null,
    firstName: '',
    lastName: '',
    email: '',
    decryptedPassword: '',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    isSubscriber: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user list
  const fetchUsers = () => {
    fetch(API_BASE)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Submit form: add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing ? `${API_BASE}/${formData.userId}` : API_BASE;
    const method = isEditing ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(await res.text());
      // reset form
      setFormData({ userId: null, firstName: '', lastName: '', email: '', decryptedPassword: '', role: 'CUSTOMER', status: 'ACTIVE', isSubscriber: false });
      setIsEditing(false);
      fetchUsers();
    } catch (err) {
      alert('Error saving user: ' + err.message);
    }
  };

  // Load user into form for editing
  const handleEdit = (user) => {
    setFormData({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      decryptedPassword: '', // do not prefill password
      role: user.role,
      status: user.status,
      isSubscriber: user.isSubscriber,
    });
    setIsEditing(true);
  };

  // Cancel edit
  const handleCancel = () => {
    setFormData({ userId: null, firstName: '', lastName: '', email: '', decryptedPassword: '', role: 'CUSTOMER', status: 'ACTIVE', isSubscriber: false });
    setIsEditing(false);
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchUsers();
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  // Toggle active/inactive
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await fetch(`${API_BASE}/${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, status: newStatus })
      });
      if (!res.ok) throw new Error(await res.text());
      fetchUsers();
    } catch (err) {
      alert('Error toggling status: ' + err.message);
    }
  };

  return (
    <div className="manage-users-container">
      <header className="header">
        <div className="logo">Manage Users</div>
        <Link to="/admin" className="back-link">&larr; Back to Admin</Link>
      </header>

      <main>
        <section className="form-section">
          <h2>{isEditing ? 'Edit User' : 'Add User'}</h2>
          <form onSubmit={handleSubmit} className="user-form">
            <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="decryptedPassword" placeholder="Password" value={formData.decryptedPassword} onChange={handleChange} {...(isEditing ? {} : { required: true })} />
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
            <label>
              Subscriber:
              <input type="checkbox" name="isSubscriber" checked={formData.isSubscriber} onChange={handleChange} />
            </label>

            <div className="form-buttons">
              <button type="submit" className="btn-save">{isEditing ? 'Update' : 'Add'}</button>
              {isEditing && <button type="button" onClick={handleCancel} className="btn-cancel">Cancel</button>}
            </div>
          </form>
        </section>

        <section className="list-section">
          <h2>User List</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Subscriber</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.userId}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>{user.isSubscriber ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleToggleStatus(user)}>
                      {user.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
                    </button>
                    <button onClick={() => handleDelete(user.userId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default ManageUsers;
