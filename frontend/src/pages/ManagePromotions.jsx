import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ManagePromotions = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    fetch('/api/promotions')
      .then(res => res.json())
      .then(data => setPromotions(data))
      .catch(err => console.error('Error fetching promotions:', err));
  }, []);

  const handleDelete = async (promoId) => {
    if (!window.confirm('Delete this promotion?')) return;

    try {
      const res = await fetch(`/api/promotions/${promoId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setPromotions(promotions.filter(p => p.id !== promoId));
    } catch (err) {
      alert('Error deleting promotion: ' + err.message);
    }
  };

  const handleEdit = async (promo) => {
    const newTitle = prompt('New promotion title:', promo.title);
    const newDiscount = prompt('New discount (%):', promo.discount);
    if (!newTitle || !newDiscount) return;

    try {
      const res = await fetch(`/api/promotions/${promo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, discount: parseFloat(newDiscount) }),
      });
      if (!res.ok) throw new Error('Edit failed');

      setPromotions(promotions.map(p => p.id === promo.id ? { ...p, title: newTitle, discount: parseFloat(newDiscount) } : p));
    } catch (err) {
      alert('Error editing promotion: ' + err.message);
    }
  };

  const handleToggle = async (promo) => {
    try {
      const res = await fetch(`/api/promotions/${promo.id}/toggle-active`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Toggle failed');

      setPromotions(promotions.map(p =>
        p.id === promo.id ? { ...p, active: !p.active } : p
      ));
    } catch (err) {
      alert('Error toggling promotion: ' + err.message);
    }
  };

  return (
    <>
      <header className="header">
        <div className="logo">Manage Promotions</div>
        <Link to="/admin" className="back-link">&larr; Back to Admin</Link>
      </header>

      <main>
        <h1 style={{ color: 'white' }}>Manage Promotions</h1>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Discount (%)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map(promo => (
              <tr key={promo.id} className={promo.active ? '' : 'inactive'}>
                <td>{promo.title}</td>
                <td>{promo.discount}</td>
                <td>{promo.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <button onClick={() => handleEdit(promo)}>Edit</button>{' '}
                  <button onClick={() => handleToggle(promo)}>
                    {promo.active ? 'Deactivate' : 'Reactivate'}
                  </button>{' '}
                  <button onClick={() => handleDelete(promo.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
};

export default ManagePromotions;
