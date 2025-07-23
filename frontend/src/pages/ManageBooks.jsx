import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '', authors: '', genre: '', isbn: '', publisher: '',
    coverImageUrl: '', samplePdfUrl: '', description: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(`Failed to add book: ${text}`);
      }

      const newBook = JSON.parse(text);
      setBooks(prevBooks => [...prevBooks, newBook]);
      setFormData({
        title: '', authors: '', genre: '', isbn: '', publisher: '',
        coverImageUrl: '', samplePdfUrl: '', description: ''
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = id => {
    fetch(`http://localhost:8080/api/books/${id}`, { method: 'DELETE' })
      .then(() => setBooks(prevBooks => prevBooks.filter(book => book.id !== id)))
      .catch(err => alert('Failed to delete book: ' + err.message));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-red-500">Manage Books</h1>
        <Link to="/admin" className="text-sm text-red-400 hover:underline">&larr; Back to Admin</Link>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Add a New Book</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 bg-gray-800 p-6 rounded-lg shadow-md">
          <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="input" required />
          <input type="text" name="authors" placeholder="Authors" value={formData.authors} onChange={handleChange} className="input" required />
          <input type="text" name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} className="input" />
          <input type="text" name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleChange} className="input" />
          <input type="text" name="publisher" placeholder="Publisher" value={formData.publisher} onChange={handleChange} className="input" />
          <input type="text" name="coverImageUrl" placeholder="Cover Image URL" value={formData.coverImageUrl} onChange={handleChange} className="input" />
          <input type="text" name="samplePdfUrl" placeholder="Sample PDF URL" value={formData.samplePdfUrl} onChange={handleChange} className="input" />
          <textarea name="description" rows="3" placeholder="Description" value={formData.description} onChange={handleChange} className="input" />
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded">Add Book</button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Book List</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left py-2 px-4">Title</th>
                <th className="text-left py-2 px-4">Authors</th>
                <th className="text-left py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(books) && books.map(book => (
                <tr key={book.id} className="border-b border-gray-600">
                  <td className="py-2 px-4">{book.title}</td>
                  <td className="py-2 px-4">{book.authors}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => handleDelete(book.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-400">No books available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ManageBooks;
