import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/BookDetails.css';

const BookDetails = ({ onAddToCart }) => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/books/${id}`);
                setBook(res.data);
            } catch (err) {
                console.error('Failed to fetch book:', err);
            }
        };

        fetchBook();
    }, [id]);

    if (!book) return <div>Loading book details...</div>;
    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingItemIndex = cart.findIndex(item => item.id === book.id);
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                id: book.id,
                title: book.title,
                coverImageUrl: book.coverImageUrl,
                price: book.price,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${book.title} added to cart`);
    };

    return (
        <div className="book-details-page">
            <div className="book-details-container">
                <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="book-details-image"
                    onError={(e) => (e.target.src = '/fallback.jpg')}
                />
                <div className="book-details-content">
                    <h2>{book.title}</h2>
                    <p><strong>Authors:</strong> {book.authors}</p>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>Publisher:</strong> {book.publisher}</p>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p><strong>Description:</strong> {book.description}</p>
                    <p><strong>Price:</strong> ${book.price}</p>
                    <button className="btn" onClick={() => onAddToCart({
                        id: book.id,
                        title: book.title,
                        coverImageUrl: book.coverImageUrl,
                        price: book.price,
                        author: book.authors
                    })}>
                        Add to Cart
                    </button>

                </div>
            </div>
        </div>
    );
};

export default BookDetails;
