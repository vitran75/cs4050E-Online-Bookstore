<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin – Online Bookstore</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        body {
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            background-color: #111;
            color: #f1f1f1;
        }

        header {
            background-color: #1a1a1a;
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

        a.back-link {
            color: #ff4444;
            text-decoration: none;
            font-size: 0.95rem;
        }

        main {
            max-width: 960px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        h1 {
            color: #ff4444;
            margin-bottom: 2rem;
            font-size: 1.8rem;
        }

        .admin-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.5rem;
        }

        .admin-card {
            background-color: #1f1f1f;
            padding: 2rem 1rem;
            border-radius: 8px;
            text-align: center;
            color: #f1f1f1;
            text-decoration: none;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 0 8px rgba(255, 68, 68, 0.15);
        }

        .admin-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 18px rgba(255, 68, 68, 0.25);
        }

        .admin-card i {
            font-size: 2.5rem;
            color: #ff4444;
            margin-bottom: 0.6rem;
        }

        .admin-card span {
            display: block;
            font-size: 1.1rem;
            margin-top: 0.4rem;
        }
    </style>
</head>

<body>

<header>
    <div class="logo">Admin View</div>
    <a href="${pageContext.request.contextPath}/" class="back-link">&larr; Back to Store</a>
</header>

<main>


    <div class="admin-grid">
        <a class="admin-card" href="${pageContext.request.contextPath}/admin/books">
            <i class="fas fa-book"></i>
            <span>Manage Books</span>
        </a>

        <a class="admin-card" href="${pageContext.request.contextPath}/admin/users">
            <i class="fas fa-users-cog"></i>
            <span>Manage Users</span>
        </a>

        <a class="admin-card" href="${pageContext.request.contextPath}/admin/promotions">
            <i class="fas fa-tags"></i>
            <span>Manage Promotions</span>
        </a>
    </div>
</main>

</body>
</html>
