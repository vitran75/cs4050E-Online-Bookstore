import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ coverImageUrl, title, authors, price, id, onAddToCart }) => {
    const navigate = useNavigate();

    return (
        <div className="book-card">
            <img
                src={coverImageUrl}
                alt={title}
                className="book-cover"
                onError={(e) => { e.target.src = '/fallback.jpg'; }}
            />
            <h3>{title}</h3>
            <p>by {authors}</p>
            <p>${price}</p>
            <div className="book-actions">
                <button className="book-btn" onClick={() => navigate(`/book/${id}`)}>Details</button>
                <button className="book-btn" onClick={() => onAddToCart(id)}>Add to Cart</button>
            </div>
        </div>
    );
};

export default BookCard;
