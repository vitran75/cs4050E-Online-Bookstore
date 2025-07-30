import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ManageBooks.css';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '', authors: '', genre: '', isbn: '', publisher: '',
    coverImageUrl: '', samplePdfUrl: '', description: '',
    prices: [{ formatType: 'HARDCOVER', price: '' }]
  });


  useEffect(() => {
    fetch('http://localhost:8080/api/books')
      .then(res => res.json())
      .then(data => {
        console.log('Books response:', data); // Debugging
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          console.error('Expected array but got:', data);
          setBooks([]); // fallback
        }
      })
      .catch(err => console.error('Failed to fetch books:', err));
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      title: '', authors: '', genre: '', isbn: '', publisher: '',
      coverImageUrl: '', samplePdfUrl: '', description: '',
      prices: [{ formatType: 'HARDCOVER', price: '' }]
    });
    setEditingBook(null);
    setIsFormVisible(false);
  };



  const handleEdit = (book) => {
    setFormData({
      title: book.title || '',
      authors: book.authors || '',
      genre: book.genre || '',
      isbn: book.isbn || '',
      publisher: book.publisher || '',
      coverImageUrl: book.coverImageUrl || '',
      samplePdfUrl: book.samplePdfUrl || '',
      description: book.description || '',
      prices: book.prices?.length > 0
          ? [book.prices[0]]
          : [{ formatType: 'HARDCOVER', price: '' }]
    });

    setEditingBook(book);
    setIsFormVisible(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const url = editingBook
        ? `http://localhost:8080/api/books/${editingBook.id}`
        : 'http://localhost:8080/api/books';

      const method = editingBook ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(`Failed to ${editingBook ? 'update' : 'add'} book: ${text}`);
      }

      const bookData = JSON.parse(text);

      if (editingBook) {
        setBooks(prevBooks =>
          prevBooks.map(book => book.id === editingBook.id ? bookData : book)
        );
      } else {
        setBooks(prevBooks => [...prevBooks, bookData]);
      }

      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');

    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const res = await fetch(`http://localhost:8080/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to delete book');
      }

      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    } catch (err) {
      alert('Failed to delete book: ' + err.message);
    }
  };

  return (
    <div className="manage-books-container">
      {/* Header */}
      <header className="manage-books-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">
              <i className="fas fa-books"></i>
              Manage Books
            </h1>
            <p className="page-subtitle">Add, edit, and manage your book inventory</p>
          </div>
          <div className="header-actions">
            <Link to="/admin" className="btn btn-outline">
              <i className="fas fa-arrow-left"></i>
              Back to Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="manage-books-main">
        {/* Add Book Button */}
        <div className="action-bar">
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="btn btn-primary"
          >
            <i className="fas fa-plus"></i>
            Add New Book
          </button>
          {isFormVisible && (
            <button
              onClick={resetForm}
              className="btn btn-secondary"
            >
              <i className="fas fa-times"></i>
              Cancel
            </button>
          )}
        </div>

        {/* Book Form */}
        {isFormVisible && (
          <section className="book-form-section">
            <div className="form-header">
              <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="book-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="title">
                    <i className="fas fa-book"></i>
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="authors">
                    <i className="fas fa-user-edit"></i>
                    Authors *
                  </label>
                  <input
                    type="text"
                    id="authors"
                    name="authors"
                    placeholder="Enter author names"
                    value={formData.authors}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="genre">
                    <i className="fas fa-tags"></i>
                    Genre
                  </label>
                  <input
                    type="text"
                    id="genre"
                    name="genre"
                    placeholder="Enter genre"
                    value={formData.genre}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="isbn">
                    <i className="fas fa-barcode"></i>
                    ISBN
                  </label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    placeholder="Enter ISBN"
                    value={formData.isbn}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="publisher">
                    <i className="fas fa-building"></i>
                    Publisher
                  </label>
                  <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    placeholder="Enter publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="coverImageUrl">
                    <i className="fas fa-image"></i>
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    id="coverImageUrl"
                    name="coverImageUrl"
                    placeholder="https://example.com/cover.jpg"
                    value={formData.coverImageUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="samplePdfUrl">
                    <i className="fas fa-file-pdf"></i>
                    Sample PDF URL
                  </label>
                  <input
                    type="url"
                    id="samplePdfUrl"
                    name="samplePdfUrl"
                    placeholder="https://example.com/sample.pdf"
                    value={formData.samplePdfUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">
                    <i className="fas fa-align-left"></i>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    placeholder="Enter book description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="formatType">
                    <i className="fas fa-book-reader"></i>
                    Format Type *
                  </label>
                  <select
                      id="formatType"
                      name="formatType"
                      value={formData.prices?.[0]?.formatType || 'HARDCOVER'}
                      onChange={(e) => {
                        const updatedPrices = [{ ...(formData.prices?.[0] || {}), formatType: e.target.value }];
                        setFormData(prev => ({ ...prev, prices: updatedPrices }));
                      }}
                      required
                  >

                  <option value="HARDCOVER">Hardcover</option>
                    <option value="PAPERBACK">Paperback</option>
                    <option value="EBOOK">eBook</option>
                  </select>

                </div>
                <div className="form-group">
                  <label htmlFor="price">
                    <i className="fas fa-dollar-sign"></i>
                    Price *
                  </label>
                  <input
                      type="number"
                      id="price"
                      name="price"
                      step="0.01"
                      placeholder="Enter price"
                      value={formData.prices?.[0]?.price || ''}
                      onChange={(e) => {
                        const updatedPrices = [{ ...(formData.prices?.[0] || {}), price: e.target.value }];
                        setFormData(prev => ({ ...prev, prices: updatedPrices }));
                      }}
                      required
                  />


                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-save"></i>
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Books List */}
        <section className="books-list-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-list"></i>
              Book Library ({books.length} books)
            </h2>
          </div>

          {books.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-book-open"></i>
              <h3>No Books Found</h3>
              <p>Start building your library by adding your first book!</p>
              <button
                onClick={() => setIsFormVisible(true)}
                className="btn btn-primary"
              >
                <i className="fas fa-plus"></i>
                Add Your First Book
              </button>
            </div>
          ) : (
            <div className="books-grid">
              {books.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-cover">
                    {book.coverImageUrl ? (
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="book-cover-placeholder" style={{display: book.coverImageUrl ? 'none' : 'flex'}}>
                      <i className="fas fa-book"></i>
                    </div>
                  </div>

                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-authors">
                      <i className="fas fa-user"></i>
                      {book.authors}
                    </p>
                    {book.genre && (
                      <p className="book-genre">
                        <i className="fas fa-tag"></i>
                        {book.genre}
                      </p>
                    )}
                    {book.publisher && (
                      <p className="book-publisher">
                        <i className="fas fa-building"></i>
                        {book.publisher}
                      </p>
                    )}
                    {book.description && (
                      <p className="book-description">
                        {book.description.length > 100
                          ? `${book.description.substring(0, 100)}...`
                          : book.description
                        }
                      </p>
                    )}
                  </div>

                  <div className="book-actions">
                    <button
                      onClick={() => handleEdit(book)}
                      className="btn btn-edit"
                      title="Edit book"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="btn btn-delete"
                      title="Delete book"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ManageBooks;
