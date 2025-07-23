import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#111',
        color: '#f1f1f1',
        textAlign: 'center',
        padding: '20px 0',
        fontSize: '0.9rem',
        boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.5)',
        marginTop: '40px',
      }}
    >
      <div>
        <p>© 2025 BookByte. All rights reserved.</p>
        <p>
          Check out our project on{' '}
          <a
            href="https://github.com/vitran75/cs4050E-Online-Bookstore"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              color: '#f1f1f1',
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 500,
            }}
          >
            <i
              className="fab fa-github"
              style={{ marginRight: '8px', fontSize: '1.2rem' }}
            ></i>
            GitHub
          </a>
        </p>
        <p>
          <a
            href="/"
            style={{ textDecoration: 'underline', color: '#ff4444', fontWeight: 500 }}
          >
            Back to Home
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
