import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import '../styles/Home.css';
import axios from 'axios';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/books'); 
        const data = res.data;

        const featuredBooks = data.filter((b) => b.status === 'AVAILABLE');
        const comingSoonBooks = data.filter((b) => b.status === 'COMING_SOON');

        setBooks(data);
        setFeatured(featuredBooks);
        setUpcoming(comingSoonBooks);
      } catch (err) {
        console.error('Error loading books:', err);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = (list) => {
    if (!searchTerm) return list;

    return list.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleAddToCart = (bookId) => {
    alert(`Add book ${bookId} to cart`);
  };

  return (
    <div>
      <Header />
      <main>
        <div className="search-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>

        {/* Featured Section */}
        <section>
          <h2>Featured Books</h2>
          <div className="book-grid">
            {filteredBooks(featured).length > 0 ? (
              filteredBooks(featured).map((book) => (
                <BookCard key={book.id} {...book} onAddToCart={handleAddToCart} />
              ))
            ) : (
              <p>No featured books found.</p>
            )}
          </div>
        </section>

        {/* Coming Soon Section */}
        <section style={{ marginTop: '3rem' }}>
          <h2>Coming Soon</h2>
          <div className="book-grid">
            {filteredBooks(upcoming).length > 0 ? (
              filteredBooks(upcoming).map((book) => (
                <BookCard key={book.id} {...book} onAddToCart={() => {}} />
              ))
            ) : (
              <p>No upcoming books found.</p>
            )}
          </div>
        </section>

        {/* All Books Section */}
        <section style={{ marginTop: '3rem' }}>
          <h2>All Books</h2>
          <div className="book-grid">
            {filteredBooks(books).length > 0 ? (
              filteredBooks(books).map((book) => (
                <BookCard key={book.id} {...book} onAddToCart={() => {}} />
              ))
            ) : (
              <p>No books found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
