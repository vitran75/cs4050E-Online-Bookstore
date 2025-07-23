import React from 'react';
import Header from '../components/Header';
import OrderItem from '../components/OrderItem';
import '../styles/OrderHistory.css';

const OrderHistory = () => {
  const handleReorder = () => {
    if (window.confirm('Add all items from this order to your cart?')) {
      alert('Items have been added to your cart!');
    }
  };

  const books = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: "$12.99" },
    { title: "To Kill a Mockingbird", author: "Harper Lee", price: "$14.99" },
    { title: "1984", author: "George Orwell", price: "$13.99" },
  ];

  return (
    <div>
      <Header />
      <div className="container">
        <h1 className="page-title">Order History</h1>

        <div className="order-card">
          <div className="order-header">
            <div className="order-info">
              <div className="order-number">Order #BS-2024-001234</div>
              <div className="order-date">Placed on March 15, 2024</div>
            </div>
            <div className="order-status">Delivered</div>
          </div>

          <div className="order-items">
            {books.map((book, i) => (
              <OrderItem key={i} {...book} />
            ))}
          </div>

          <div className="order-footer">
            <div className="order-total">Total: $50.72</div>
            <button className="btn-primary" onClick={handleReorder}>Reorder</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
