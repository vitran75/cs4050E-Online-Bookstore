import React from 'react';

const BookCard = ({ coverImageUrl, title, author, price, id, onAddToCart }) => (
    <div className="book-card">
        <img
            src={coverImageUrl}
            alt={title}
            className="book-cover"
            onError={(e) => { e.target.src = '/fallback.jpg'; }} // optional fallback
        />
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
