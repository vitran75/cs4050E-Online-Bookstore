<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Online Bookstore</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        body {
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            background-color: #111;
            color: #f1f1f1;
        }

        header {
            background: #1a1a1a;
            color: #ff4444;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.4rem;
            font-weight: bold;
        }

        .search-bar {
            flex: 1;
            margin: 0 2rem;
            display: flex;
        }

        .search-bar input {
            flex: 1;
            padding: 0.5rem;
            border: none;
            border-radius: 4px;
            background: #2b2b2b;
            color: #fff;
        }

        .search-bar button {
            margin-left: 8px;
            padding: 0.5rem 0.7rem;
            background: #ff4444;
            border: none;
            color: white;
            border-radius: 4px;
            cursor: pointer;
        }

        .header-icons a {
            margin-left: 12px;
            color: #ff4444;
            font-size: 1.1rem;
            text-decoration: none;
        }

        .btn, .small-btn {
            border-radius: 4px;
            text-decoration: none;
            font-size: 0.9rem;
            cursor: pointer;
            display: inline-block;
        }

        .btn {
            padding: 0.4rem 0.8rem;
            background: #ff4444;
            color: white;
            border: none;
        }

        .btn:hover {
            background: #e63939;
        }

        .small-btn {
            padding: 0.3rem 0.7rem;
            border: 1px solid #ff4444;
            background: transparent;
            color: #ff4444;
        }

        .small-btn:hover {
            background: #ff4444;
            color: white;
        }

        main {
            padding: 2rem;
        }

        h2 {
            color: #ff4444;
            margin-bottom: 1rem;
        }

        .book-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1.5rem;
        }

        .book-card {
            background: #1f1f1f;
            padding: 1rem;
            border-radius: 6px;
            text-align: center;
            box-shadow: 0 0 8px rgba(255, 68, 68, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .book-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(255, 68, 68, 0.2);
        }

        .book-card img {
            width: 150px;
            height: 225px;
            object-fit: cover;
            margin-bottom: 10px;
            border-radius: 4px;
            border: 1px solid #333;
        }

        .book-card h3 {
            font-size: 1.1rem;
            margin: 0.5rem 0 0.2rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .book-card p {
            margin: 0.2rem 0;
            color: #bbb;
            font-size: 0.9rem;
        }

        .book-actions {
            margin-top: 1rem;
            display: flex;
            justify-content: space-between;
        }

        .book-actions .btn {
            flex: 1;
            margin: 0 0.2rem;
            padding: 0.4rem 0;
        }

        footer {
            background: #1a1a1a;
            padding: 1rem;
            text-align: center;
            font-size: 0.9rem;
            color: #bbb;
        }

        footer a {
            color: #ff4444;
        }

        /* Popup Modals */
        .modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
        }

        .modal-content {
            width: 350px;
            background: white;
            border-radius: 10px;
            margin: 10% auto;
            overflow: hidden;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
        }

        .modal-header {
            background: #000;
            color: white;
            padding: 0.8rem 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h2 {
            margin: 0;
            font-size: 1.5rem;
        }

        .modal-header .close {
            cursor: pointer;
            font-size: 1.2rem;
        }

        .modal-form {
            padding: 1rem;
            display: flex;
            flex-direction: column;
        }

        .modal-form input {
            padding: 0.6rem;
            margin-bottom: 0.7rem;
            border: 1px solid #ccc;
            border-radius: 10px;
            font-size: 0.95rem;
        }

        .modal-btn {
            background: #000;
            color: white;
            font-weight: bold;
            border: none;
            border-radius: 10px;
            padding: 0.6rem;
            font-size: 1rem;
            cursor: pointer;
        }

        .modal-btn:hover {
            background: #333;
        }

        .release-date {
            color: #ff4444 !important;
            font-style: italic;
            margin-top: 0.5rem !important;
        }

    </style>
</head>

<body>

<header>
    <div class="logo">Online Bookstore</div>

    <div class="search-bar">
        <form action="/search" method="get">
            <input type="text" name="query" placeholder="Search title, author, genre">
            <button type="submit"><i class="fas fa-search"></i></button>
        </form>
    </div>

    <div class="header-icons">
        <a href="javascript:void(0);" class="small-btn" onclick="openLoginModal()">Sign-in</a>
        <a href="javascript:void(0);" class="small-btn" onclick="openRegisterModal()">Sign-up</a>
        <a href="/cart" title="Cart"><i class="fas fa-shopping-cart"></i></a>
        <a href="/profile" title="Profile"><i class="fas fa-user"></i></a>
    </div>
</header>

<main>
    <!-- Featured Books -->
    <section>
        <h2>Featured Books</h2>
        <div class="book-grid">
            <c:forEach var="book" items="${featuredBooks}">
                <div class="book-card">
                    <img src="${book.imageUrl}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>by ${book.author}</p>
                    <p>$${book.price}</p>
                    <div class="book-actions">
                        <a href="/book/${book.id}" class="btn">Details</a>
                        <button type="submit" class="btn">Add to Cart</button>
                    </div>
                </div>
            </c:forEach>
        </div>
    </section>

    <!-- Coming Soon -->
    <section style="margin-top: 3rem;">
        <h2>Coming Soon</h2>
        <div class="book-grid">
            <c:forEach var="book" items="${comingSoonBooks}">
                <div class="book-card">
                    <img src="${book.imageUrl}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>by ${book.author}</p>
                    <p class="release-date">${book.price}</p>
                </div>
            </c:forEach>
        </div>
    </section>
</main>

<footer>
    <a href="/admin">Admin Panel</a>
</footer>

<!-- Signup Modal -->
<div id="registerModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Sign-up</h2>
            <span class="close" onclick="closeRegisterModal()">&times;</span>
        </div>
        <form action="/register" method="post" class="modal-form">
            <input type="email" name="email" placeholder="Email" required />
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="New password" required />
            <input type="password" name="confirmPassword" placeholder="Confirm password" required />
            <button type="submit" class="modal-btn">Enter</button>
        </form>
    </div>
</div>

<!-- Login Modal -->
<div id="loginModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Sign-in</h2>
            <span class="close" onclick="closeLoginModal()">&times;</span>
        </div>
        <form action="/login" method="post" class="modal-form">
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Enter password" required />
            <button type="submit" class="modal-btn">Enter</button>
        </form>
    </div>
</div>

<script>
    function openRegisterModal() {
        document.getElementById('registerModal').style.display = 'block';
    }

    function closeRegisterModal() {
        document.getElementById('registerModal').style.display = 'none';
    }

    function openLoginModal() {
        document.getElementById('loginModal').style.display = 'block';
    }

    function closeLoginModal() {
        document.getElementById('loginModal').style.display = 'none';
    }

    window.onclick = function (e) {
        if (e.target === document.getElementById('registerModal')) closeRegisterModal();
        if (e.target === document.getElementById('loginModal')) closeLoginModal();
    };
</script>

</body>
</html>
