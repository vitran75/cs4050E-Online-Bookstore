// src/pages/BookDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import '../styles/BookDetails.css';

const BookDetails = () => {
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

    return (
        <div className="book-details-page">
            <Header />
            <div className="book-details-container">
                <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    onError={(e) => (e.target.src = '/fallback.jpg')}
                    className="book-details-image"
                />
                <div className="book-details-content">
                    <h2>{book.title}</h2>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>Publisher:</strong> {book.publisher}</p>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p><strong>Description:</strong> {book.description}</p>
                    <p><strong>Price:</strong> ${book.price}</p>
                    <button className="btn">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
