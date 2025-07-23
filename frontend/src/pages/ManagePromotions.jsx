import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ManagePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [formData, setFormData] = useState({
    details: '',
    discount: '',
    code: '',
    validUntil: ''
  });

  useEffect(() => {
    fetch('http://localhost:8080/api/promotions')
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setPromotions(data) : [])
      .catch(err => console.error('Failed to fetch promotions:', err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      ...formData,
      discount: parseFloat(formData.discount), // ensure decimal
      validUntil: formData.validUntil || null,
    };

    try {
      const res = await fetch('http://localhost:8080/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error creating promotion');

      setPromotions(prev => [...prev, result.promotion]);
      setFormData({ details: '', discount: '', code: '', validUntil: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotion?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/promotions/${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error deleting promotion');
      setPromotions(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-red-500">Manage Promotions</h1>
        <Link to="/admin" className="text-sm text-red-400 hover:underline">&larr; Back to Admin</Link>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Add Promotion</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 bg-gray-800 p-6 rounded-lg shadow-md">
          <input type="text" name="details" placeholder="Details" value={formData.details} onChange={handleChange} className="input" required />
          <input type="number" step="0.01" name="discount" placeholder="Discount (%)" value={formData.discount} onChange={handleChange} className="input" required />
          <input type="text" name="code" placeholder="Promo Code (e.g., SAVE10)" value={formData.code} onChange={handleChange} className="input" required />
          <input type="date" name="validUntil" placeholder="Valid Until" value={formData.validUntil} onChange={handleChange} className="input" />
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded">Add Promotion</button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Promotion List</h2>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left py-2 px-4">Details</th>
              <th className="text-left py-2 px-4">Discount</th>
              <th className="text-left py-2 px-4">Code</th>
              <th className="text-left py-2 px-4">Valid Until</th>
              <th className="text-left py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.length > 0 ? promotions.map(promo => (
              <tr key={promo.id} className="border-b border-gray-600">
                <td className="py-2 px-4">{promo.details}</td>
                <td className="py-2 px-4">{promo.discount}%</td>
                <td className="py-2 px-4">{promo.code}</td>
                <td className="py-2 px-4">{promo.validUntil || 'N/A'}</td>
                <td className="py-2 px-4">
                  <button onClick={() => handleDelete(promo.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-400">No promotions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ManagePromotions;
