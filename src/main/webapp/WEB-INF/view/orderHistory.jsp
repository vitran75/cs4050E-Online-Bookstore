<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Order History – Online Bookstore</title>
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

        .back-link {
            color: #ff4444;
            text-decoration: none;
            font-size: 0.95rem;
        }

        .container {
            max-width: 800px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        .page-title {
            color: #ff4444;
            font-size: 2rem;
            margin-bottom: 2rem;
        }

        .order-card {
            background-color: #1f1f1f;
            border-radius: 8px;
            padding: 2rem;
            box-shadow: 0 0 8px rgba(255, 68, 68, 0.15);
            border: 1px solid #333;
        }

        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid #333;
            padding-bottom: 1rem;
        }

        .order-number {
            font-size: 1.2rem;
            font-weight: bold;
            color: #ff4444;
            margin-bottom: 0.3rem;
        }

        .order-date {
            color: #bbb;
            font-size: 0.9rem;
        }

        .order-status {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
            background-color: #1f4f1f;
            color: #4f8f4f;
        }

        .order-items {
            margin-bottom: 1.5rem;
        }

        .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid #333;
        }

        .order-item:last-child {
            border-bottom: none;
        }

        .book-details {
            flex: 1;
        }

        .book-title {
            font-weight: bold;
            margin-bottom: 0.3rem;
        }

        .book-author {
            color: #bbb;
            font-size: 0.9rem;
        }

        .book-price {
            font-weight: bold;
            color: #ff4444;
            margin-left: 1rem;
        }

        .order-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #333;
            padding-top: 1rem;
        }

        .order-total {
            font-size: 1.2rem;
            font-weight: bold;
            color: #ff4444;
        }

        .btn-primary {
            background-color: #ff4444;
            color: white;
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            background-color: #e03e3e;
        }
    </style>
</head>
<body>
    <header>
        <div class="logo">Online Bookstore</div>
        <a href="/" class="back-link">&larr; Back to Store</a>
    </header>

    <div class="container">
        <h1 class="page-title">Order History</h1>

        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <div class="order-number">Order #BS-2024-001234</div>
                    <div class="order-date">Placed on March 15, 2024</div>
                </div>
                <div class="order-status">Delivered</div>
            </div>
            
            <div class="order-items">
                <div class="order-item">
                    <div class="book-details">
                        <div class="book-title">The Great Gatsby</div>
                        <div class="book-author">by F. Scott Fitzgerald</div>
                    </div>
                    <div class="book-price">$12.99</div>
                </div>
                <div class="order-item">
                    <div class="book-details">
                        <div class="book-title">To Kill a Mockingbird</div>
                        <div class="book-author">by Harper Lee</div>
                    </div>
                    <div class="book-price">$14.99</div>
                </div>
                <div class="order-item">
                    <div class="book-details">
                        <div class="book-title">1984</div>
                        <div class="book-author">by George Orwell</div>
                    </div>
                    <div class="book-price">$13.99</div>
                </div>
            </div>
            
            <div class="order-footer">
                <div class="order-total">Total: $50.72</div>
                <button class="btn-primary" onclick="reorderItems()">Reorder</button>
            </div>
        </div>
    </div>

    <script>
        function reorderItems() {
            if (confirm('Add all items from this order to your cart?')) {
                alert('Items have been added to your cart!');
            }
        }
    </script>
</body>
</html>