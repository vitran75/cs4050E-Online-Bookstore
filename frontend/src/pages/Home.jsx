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

        const featuredBookIds = [21, 22, 24, 25, 26];
        const comingSoonBookIds = [18, 20, 27, 28, 29];

        const featuredBooks = data.filter((b) => featuredBookIds.includes(b.id));
        const comingSoonBooks = data.filter((b) => comingSoonBookIds.includes(b.id));

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
      // Safely normalize data
      const title = book.title?.toLowerCase() || "";
      const authors = Array.isArray(book.authors)
          ? book.authors.join(", ").toLowerCase()
          : (book.authors?.toLowerCase() || book.author?.toLowerCase() || "");
      const genre = book.genre?.toLowerCase() || "";

      switch (searchFilter) {
        case "title":
          return title.includes(term);
        case "author":
          return authors.includes(term);
        case "genre":
          return genre.includes(term);
        case "all":
          return (
              title.includes(term) ||
              authors.includes(term) ||
              genre.includes(term)
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
          <section className="book-section">

              <h2>FEATURED BOOKS</h2>
              <div className="book-grid">
                {filteredBooks(featured).map((book) => (
                    <BookCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        authors={book.authors}
                        price={book.price}
                        coverImageUrl={book.coverImageUrl}
                        onAddToCart={() => onAddToCart(book)}
                    />
                ))}
              </div>

          </section>

          {/* Coming Soon */}
          <section className="book-section">

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
          <section className="book-section">

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
