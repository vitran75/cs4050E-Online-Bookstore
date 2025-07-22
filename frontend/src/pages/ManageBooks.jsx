import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '', authors: '', genre: '', isbn: '', publisher: '',
    coverImageUrl: '', samplePdfUrl: '', description: ''
  });

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(setBooks)
      .catch(err => console.error('Failed to fetch books:', err));
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(newBook => {
      setBooks([...books, newBook]);
      setFormData({ title: '', authors: '', genre: '', isbn: '', publisher: '', coverImageUrl: '', samplePdfUrl: '', description: '' });
    })
    .catch(err => alert('Failed to add book: ' + err.message));
  };

  const handleDelete = id => {
    fetch(`/api/books/${id}`, { method: 'DELETE' })
      .then(() => setBooks(books.filter(book => book.id !== id)))
      .catch(err => alert('Failed to delete book: ' + err.message));
  };

  return (
    <>
      <header>
        <div className="logo">Manage Books</div>
        <Link to="/admin" className="back-link">&larr; Back to Admin</Link>
      </header>

      <main>
        <h1>Add a New Book</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
          <input type="text" name="authors" placeholder="Authors" value={formData.authors} onChange={handleChange} required />
          <input type="text" name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} />
          <input type="text" name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleChange} />
          <input type="text" name="publisher" placeholder="Publisher" value={formData.publisher} onChange={handleChange} />
          <input type="text" name="coverImageUrl" placeholder="Cover Image URL" value={formData.coverImageUrl} onChange={handleChange} />
          <input type="text" name="samplePdfUrl" placeholder="Sample PDF URL" value={formData.samplePdfUrl} onChange={handleChange} />
          <textarea name="description" rows="3" placeholder="Description" value={formData.description} onChange={handleChange} />
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
                  <button onClick={() => handleDelete(book.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
};

export default ManageBooks;
