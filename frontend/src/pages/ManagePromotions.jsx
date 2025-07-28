import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ManagePromotions.css';

const ManagePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [formData, setFormData] = useState({
    details: '',
    discount: '',
    code: '',
    validUntil: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/promotions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const promoArray = Array.isArray(data) ? data : [];
        setPromotions(promoArray);
      })
      .catch(err => {
        console.error('Failed to fetch promotions:', err);
        setPromotions([]);
      });
  }, []);

  // Filter promotions based on search and status
  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = 
      promo.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const currentDate = new Date();
    const expiryDate = promo.validUntil ? new Date(promo.validUntil) : null;
    const isExpired = expiryDate && expiryDate < currentDate;
    const isActive = !isExpired;
    
    const matchesStatus = 
      statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && isActive) ||
      (statusFilter === 'EXPIRED' && isExpired);
    
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({ details: '', discount: '', code: '', validUntil: '' });
    setEditingPromo(null);
    setIsFormVisible(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (promo) => {
    setFormData({
      details: promo.details,
      discount: promo.discount.toString(),
      code: promo.code,
      validUntil: promo.validUntil || ''
    });
    setEditingPromo(promo);
    setIsFormVisible(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const payload = {
      ...formData,
      discount: parseFloat(formData.discount),
      validUntil: formData.validUntil || null,
    };

    try {
      const url = editingPromo 
        ? `http://localhost:8080/api/promotions/${editingPromo.id}`
        : 'http://localhost:8080/api/promotions';
      
      const method = editingPromo ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || `Error ${editingPromo ? 'updating' : 'creating'} promotion`);

      if (editingPromo) {
        setPromotions(prev => 
          prev.map(p => p.id === editingPromo.id ? result.promotion || result : p)
        );
      } else {
        setPromotions(prev => [...prev, result.promotion || result]);
      }

      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promotion? This action cannot be undone.')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8080/api/promotions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error deleting promotion');
      
      setPromotions(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const getPromotionStatus = (promo) => {
    if (!promo.validUntil) return 'no-expiry';
    const currentDate = new Date();
    const expiryDate = new Date(promo.validUntil);
    const daysUntilExpiry = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'expiring-soon';
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'expiring-soon': return 'status-warning';
      case 'expired': return 'status-expired';
      case 'no-expiry': return 'status-permanent';
      default: return 'status-unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="manage-promotions-container">
      {/* Header */}
      <header className="manage-promotions-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">
              <i className="fas fa-tags"></i>
              Manage Promotions
            </h1>
            <p className="page-subtitle">Create and manage discount codes and promotional offers</p>
          </div>
          <div className="header-actions">
            <Link to="/admin" className="btn btn-outline">
              <i className="fas fa-arrow-left"></i>
              Back to Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="manage-promotions-main">
        {/* Controls Bar */}
        <div className="controls-bar">
          <div className="search-section">
            <div className="search-input-group">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search promotions by details or code..."
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
              <option value="ALL">All Promotions</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          <div className="action-buttons">
            <button 
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="btn btn-primary"
            >
              <i className="fas fa-plus"></i>
              Add Promotion
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

        {/* Promotion Form */}
        {isFormVisible && (
          <section className="promotion-form-section">
            <div className="form-header">
              <h2>
                <i className={`fas ${editingPromo ? 'fa-edit' : 'fa-plus'}`}></i>
                {editingPromo ? 'Edit Promotion' : 'Add New Promotion'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="promotion-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="details">
                    <i className="fas fa-info-circle"></i>
                    Promotion Details *
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    placeholder="Enter promotion description (e.g., Summer Sale - Get discounts on all books)"
                    value={formData.details}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="discount">
                    <i className="fas fa-percentage"></i>
                    Discount Percentage *
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    placeholder="10"
                    value={formData.discount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    max="100"
                    required
                  />
                  <small className="input-hint">Enter percentage (0-100)</small>
                </div>

                <div className="form-group">
                  <label htmlFor="code">
                    <i className="fas fa-ticket-alt"></i>
                    Promo Code *
                  </label>
                  <input
                    type="text"
                    id="code"  
                    name="code"
                    placeholder="SAVE20"
                    value={formData.code}
                    onChange={handleChange}
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                  <small className="input-hint">Must be unique (e.g., SAVE20, SUMMER2025)</small>
                </div>

                <div className="form-group">
                  <label htmlFor="validUntil">
                    <i className="fas fa-calendar-alt"></i>
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    id="validUntil"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <small className="input-hint">Leave empty for no expiry date</small>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  <i className={`fas ${editingPromo ? 'fa-save' : 'fa-plus'}`}></i>
                  {editingPromo ? 'Update Promotion' : 'Add Promotion'}
                </button>
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Promotions List */}
        <section className="promotions-list-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-list"></i>
              Promotion Library ({filteredPromotions.length} {filteredPromotions.length === 1 ? 'promotion' : 'promotions'})
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

          {filteredPromotions.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-tags"></i>
              <h3>
                {searchTerm || statusFilter !== 'ALL'
                  ? 'No Promotions Found'
                  : 'No Promotions Yet'
                }
              </h3>
              <p>
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start boosting sales by creating your first promotional offer!'
                }
              </p>
              {!searchTerm && statusFilter === 'ALL' && (
                <button 
                  onClick={() => setIsFormVisible(true)}
                  className="btn btn-primary"
                >
                  <i className="fas fa-plus"></i>
                  Create Your First Promotion
                </button>
              )}
            </div>
          ) : (
            <div className="promotions-grid">
              {filteredPromotions.map(promo => {
                const status = getPromotionStatus(promo);
                return (
                  <div key={promo.id} className="promotion-card">
                    <div className="promotion-header">
                      <div className="promotion-code">
                        <i className="fas fa-ticket-alt"></i>
                        <span className="code-text">{promo.code}</span>
                      </div>
                      <div className="promotion-discount">
                        <span className="discount-value">{promo.discount}%</span>
                        <span className="discount-label">OFF</span>
                      </div>
                    </div>

                    <div className="promotion-content">
                      <p className="promotion-details">{promo.details}</p>
                      
                      <div className="promotion-meta">
                        <div className="expiry-info">
                          <i className="fas fa-clock"></i>
                          <span>
                            {promo.validUntil 
                              ? `Expires: ${formatDate(promo.validUntil)}`
                              : 'No expiry date'
                            }
                          </span>
                        </div>
                        
                        <div className={`status-badge ${getStatusColor(status)}`}>
                          <i className={`fas ${
                            status === 'active' ? 'fa-check-circle' :
                            status === 'expiring-soon' ? 'fa-exclamation-triangle' :
                            status === 'expired' ? 'fa-times-circle' :
                            'fa-infinity'
                          }`}></i>
                          {status === 'active' ? 'Active' :
                           status === 'expiring-soon' ? 'Expiring Soon' :
                           status === 'expired' ? 'Expired' :
                           'Permanent'}
                        </div>
                      </div>

                      {promo.createdAt && (
                        <div className="creation-date">
                          <i className="fas fa-calendar-plus"></i>
                          Created: {formatDate(promo.createdAt)}
                        </div>
                      )}
                    </div>

                    <div className="promotion-actions">
                      <button
                        onClick={() => navigator.clipboard.writeText(promo.code)}
                        className="btn btn-copy"
                        title="Copy promo code"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                      
                      <button 
                        onClick={() => handleEdit(promo)}
                        className="btn btn-edit"
                        title="Edit promotion"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(promo.id)}
                        className="btn btn-delete"
                        title="Delete promotion"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ManagePromotions;
