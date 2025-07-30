import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import '../styles/Home.css';
import '../styles/Header.css';
import axios from 'axios';

const Home = ({ onAddToCart }) => {
  const [books, setBooks] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('title');
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

    const term = searchTerm.toLowerCase();
    return list.filter((book) => {
      switch (searchFilter) {
        case 'title':
          return book.title.toLowerCase().includes(term);
        case 'author':
          return book.author.toLowerCase().includes(term);
        case 'genre':
          return book.genre?.toLowerCase().includes(term);
        case 'all':
          return (
              book.title.toLowerCase().includes(term) ||
              book.author.toLowerCase().includes(term) ||
              book.genre?.toLowerCase().includes(term)
          );
        default:
          return true;
      }
    });
  };

  return (
      <div className="home-page">
        <main>
          <div className="search-container">
            <div className="search-bar-wrapper">
              <input
                  type="text"
                  placeholder="Search books by title, author, or genre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
              />
              <select
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="search-filter"
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="genre">Genre</option>
                <option value="all">All</option>
              </select>
              <button className="search-button">Search</button>
            </div>
          </div>

          {/* Featured Books */}
          <section>
            <h2>FEATURED BOOKS</h2>
            <div className="book-grid">
              {filteredBooks(featured).length > 0 ? (
                  filteredBooks(featured).map((book) => (
                      <BookCard
                          key={book.id}
                          id={book.id}
                          title={book.title}
                          authors={book.authors}
                          price={book.price}
                          coverImageUrl={book.coverImageUrl}
                          onAddToCart={() => onAddToCart(book)}
                      />
                  ))
              ) : (
                  <p>No featured books found.</p>
              )}
            </div>
          </section>

          {/* Coming Soon */}
          <section>
            <h2>COMING SOON</h2>
            <div className="book-grid">
              {filteredBooks(upcoming).length > 0 ? (
                  filteredBooks(upcoming).map((book) => (
                      <BookCard
                          key={book.id}
                          id={book.id}
                          title={book.title}
                          authors={book.authors}
                          price={book.price}
                          coverImageUrl={book.coverImageUrl}
                          onAddToCart={() => onAddToCart(book)}
                      />
                  ))
              ) : (
                  <p>No upcoming books found.</p>
              )}
            </div>
          </section>

          {/* All Books */}
          <section>
            <h2>ALL BOOKS</h2>
            <div className="book-grid">
              {filteredBooks(books).length > 0 ? (
                  filteredBooks(books).map((book) => (
                      <BookCard
                          key={book.id}
                          id={book.id}
                          title={book.title}
                          authors={book.authors}
                          price={book.price}
                          coverImageUrl={book.coverImageUrl}
                          onAddToCart={() => onAddToCart(book)}
                      />
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
