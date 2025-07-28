import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ManageUsers.css';

const API_BASE = 'http://localhost:8080/api/customers';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
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
    const token = localStorage.getItem('token');
    fetch(API_BASE, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Error fetching users:', err);
        setUsers([]);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      userId: null,
      firstName: '',
      lastName: '',
      email: '',
      decryptedPassword: '',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      isSubscriber: false,
    });
    setIsEditing(false);
    setIsFormVisible(false);
  };

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
    const token = localStorage.getItem('token');
    const url = isEditing ? `${API_BASE}/${formData.userId}` : API_BASE;
    const method = isEditing ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      
      resetForm();
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
    setIsFormVisible(true);
  };

  // Cancel edit
  const handleCancel = () => {
    resetForm();
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchUsers();
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  // Toggle active/inactive
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_BASE}/${user.userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...user, status: newStatus })
      });
      if (!res.ok) throw new Error(await res.text());
      fetchUsers();
    } catch (err) {
      alert('Error toggling status: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'status-active';
      case 'INACTIVE': return 'status-inactive';
      case 'SUSPENDED': return 'status-suspended';
      default: return 'status-unknown';
    }
  };

  const getRoleIcon = (role) => {
    return role === 'ADMIN' ? 'fas fa-crown' : 'fas fa-user';
  };

  return (
    <div className="manage-users-container">
      {/* Header */}
      <header className="manage-users-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">
              <i className="fas fa-users-cog"></i>
              Manage Users
            </h1>
            <p className="page-subtitle">Manage customer accounts and admin users</p>
          </div>
          <div className="header-actions">
            <Link to="/admin" className="btn btn-outline">
              <i className="fas fa-arrow-left"></i>
              Back to Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="manage-users-main">
        {/* Controls Bar */}
        <div className="controls-bar">
          <div className="search-section">
            <div className="search-input-group">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          <div className="action-buttons">
            <button 
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="btn btn-primary"
            >
              <i className="fas fa-user-plus"></i>
              Add New User
            </button>
            {isFormVisible && (
              <button 
                onClick={resetForm}
                className="btn btn-secondary"
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* User Form */}
        {isFormVisible && (
          <section className="user-form-section">
            <div className="form-header">
              <h2>
                <i className={`fas ${isEditing ? 'fa-user-edit' : 'fa-user-plus'}`}></i>
                {isEditing ? 'Edit User' : 'Add New User'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">
                    <i className="fas fa-user"></i>
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">
                    <i className="fas fa-user"></i>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="email">
                    <i className="fas fa-envelope"></i>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="decryptedPassword">
                    <i className="fas fa-lock"></i>
                    Password {!isEditing && '*'}
                    {isEditing && <span className="password-note">(Leave blank to keep current password)</span>}
                  </label>
                  <input
                    type="password"
                    id="decryptedPassword"
                    name="decryptedPassword"
                    placeholder={isEditing ? "Enter new password (optional)" : "Enter password"}
                    value={formData.decryptedPassword}
                    onChange={handleChange}
                    {...(isEditing ? {} : { required: true })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">
                    <i className="fas fa-user-tag"></i>
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">
                    <i className="fas fa-toggle-on"></i>
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>

                <div className="form-group checkbox-group full-width">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isSubscriber"
                      checked={formData.isSubscriber}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <div className="checkbox-content">
                      <i className="fas fa-star"></i>
                      <span>Newsletter Subscriber</span>
                      <small>User receives promotional emails and updates</small>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  <i className={`fas ${isEditing ? 'fa-save' : 'fa-user-plus'}`}></i>
                  {isEditing ? 'Update User' : 'Add User'}
                </button>
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Users List */}
        <section className="users-list-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-list"></i>
              User Directory ({filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'})
            </h2>
            {searchTerm && (
              <div className="search-info">
                <i className="fas fa-info-circle"></i>
                Showing results for "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="clear-search"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-users"></i>
              <h3>
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'No Users Found' 
                  : 'No Users Yet'
                }
              </h3>
              <p>
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start building your user base by adding your first user!'
                }
              </p>
              {!searchTerm && statusFilter === 'ALL' && (
                <button 
                  onClick={() => setIsFormVisible(true)}
                  className="btn btn-primary"
                >
                  <i className="fas fa-user-plus"></i>
                  Add Your First User
                </button>
              )}
            </div>
          ) : (
            <div className="users-grid">
              {filteredUsers.map(user => (
                <div key={user.userId} className="user-card">
                  <div className="user-avatar">
                    <i className={getRoleIcon(user.role)}></i>
                  </div>
                  
                  <div className="user-info">
                    <h3 className="user-name">
                      {user.firstName} {user.lastName}
                      {user.role === 'ADMIN' && (
                        <span className="admin-badge">
                          <i className="fas fa-crown"></i>
                          Admin
                        </span>
                      )}
                    </h3>
                    
                    <p className="user-email">
                      <i className="fas fa-envelope"></i>
                      {user.email}
                    </p>
                    
                    <div className="user-meta">
                      <span className={`status-badge ${getStatusColor(user.status)}`}>
                        <i className={`fas ${
                          user.status === 'ACTIVE' ? 'fa-check-circle' :
                          user.status === 'SUSPENDED' ? 'fa-ban' : 'fa-pause-circle'
                        }`}></i>
                        {user.status}
                      </span>
                      
                      {user.isSubscriber && (
                        <span className="subscriber-badge">
                          <i className="fas fa-star"></i>
                          Subscriber
                        </span>
                      )}
                    </div>
                    
                    {user.createdAt && (
                      <p className="user-joined">
                        <i className="fas fa-calendar-alt"></i>
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="user-actions">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="btn btn-edit"
                      title="Edit user"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    
                    <button 
                      onClick={() => handleToggleStatus(user)}
                      className={`btn ${user.status === 'ACTIVE' ? 'btn-warning' : 'btn-success'}`}
                      title={user.status === 'ACTIVE' ? 'Deactivate user' : 'Activate user'}
                    >
                      <i className={`fas ${user.status === 'ACTIVE' ? 'fa-pause' : 'fa-play'}`}></i>
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(user.userId)}
                      className="btn btn-delete"
                      title="Delete user"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ManageUsers;
