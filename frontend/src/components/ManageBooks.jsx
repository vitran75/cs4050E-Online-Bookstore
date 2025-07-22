import React, { useEffect, useState } from 'react';
import '../styles/AdminBooks.css';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '', authors: '', genre: '', isbn: '', publisher: '',
    coverImageUrl: '', samplePdfUrl: '', description: ''
  });

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error('Failed to fetch books:', err));
  }, []);

  const handleChange = e => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleAddBook = e => {
    e.preventDefault();
    fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook)
    })
      .then(res => res.json())
      .then(data => {
        setBooks(prev => [...prev, data]);
        setNewBook({ title: '', authors: '', genre: '', isbn: '', publisher: '', coverImageUrl: '', samplePdfUrl: '', description: '' });
      })
      .catch(err => alert('Error adding book: ' + err.message));
  };

  const handleDeleteBook = id => {
    fetch(`/api/books/${id}`, { method: 'DELETE' })
      .then(() => setBooks(prev => prev.filter(book => book.id !== id)))
      .catch(err => alert('Error deleting book: ' + err.message));
  };

  return (
    <main>
      <h1>Manage Books</h1>

      <form onSubmit={handleAddBook}>
        <input type="text" name="title" placeholder="Title" value={newBook.title} onChange={handleChange} required />
        <input type="text" name="authors" placeholder="Authors" value={newBook.authors} onChange={handleChange} required />
        <input type="text" name="genre" placeholder="Genre" value={newBook.genre} onChange={handleChange} />
        <input type="text" name="isbn" placeholder="ISBN" value={newBook.isbn} onChange={handleChange} />
        <input type="text" name="publisher" placeholder="Publisher" value={newBook.publisher} onChange={handleChange} />
        <input type="text" name="coverImageUrl" placeholder="Cover Image URL" value={newBook.coverImageUrl} onChange={handleChange} />
        <input type="text" name="samplePdfUrl" placeholder="Sample PDF URL" value={newBook.samplePdfUrl} onChange={handleChange} />
        <textarea name="description" rows="3" placeholder="Description" value={newBook.description} onChange={handleChange}></textarea>
        <button type="submit">Add Book</button>
      </form>

      <h1>Book List</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Authors</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.authors}</td>
              <td>
                <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default ManageBooks;
