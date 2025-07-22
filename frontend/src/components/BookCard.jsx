import React from 'react';

const BookCard = ({ imageUrl, title, author, price, id, onAddToCart }) => (
  <div className="book-card">
    <img src={imageUrl} alt={title} />
    <h3>{title}</h3>
    <p>by {author}</p>
    <p>${price}</p>
    <div className="book-actions">
      <a href={`/book/${id}`} className="btn">Details</a>
      <button className="btn" onClick={() => onAddToCart(id)}>Add to Cart</button>
    </div>
  </div>
);

export default BookCard;