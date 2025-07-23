import React from 'react';

const OrderItem = ({ title, author, price }) => (
  <div className="order-item">
    <div className="book-details">
      <div className="book-title">{title}</div>
      <div className="book-author">by {author}</div>
    </div>
    <div className="book-price">{price}</div>
  </div>
);

export default OrderItem;