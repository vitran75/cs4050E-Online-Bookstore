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
                position: relative;
            }

            .search-bar input {
                flex: 1;
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 4px 0 0 4px;
                background: #2b2b2b;
                color: #fff;
                font-size: 0.95rem;
            }

            .search-bar select {
                padding: 0.5rem;
                border: none;
                background: #333;
                color: #fff;
                border-left: 1px solid #444;
                border-right: 1px solid #444;
                cursor: pointer;
            }

            .search-bar button {
                margin-left: 0;
                padding: 0.5rem 1rem;
                background: #ff4444;
                border: none;
                color: white;
                border-radius: 0 4px 4px 0;
                cursor: pointer;
                transition: background 0.2s;
            }

            .search-bar button:hover {
                background: #e63939;
            }

            /* Search suggestions dropdown */
            .search-suggestions {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #2b2b2b;
                border-radius: 0 0 4px 4px;
                z-index: 100;
                display: none;
            }

            .search-suggestions div {
                padding: 0.5rem 1rem;
                cursor: pointer;
            }

            .search-suggestions div:hover {
                background: #ff4444;
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

            /* Cart Modal Styles */
            .modal-body {
                padding: 1rem;
                max-height: 60vh;
                overflow-y: auto;
            }

            .cart-items {
                margin-bottom: 1rem;
            }

            .cart-item {
                display: flex;
                padding: 0.8rem 0;
                border-bottom: 1px solid #eee;
            }

            .cart-item-img {
                width: 60px;
                height: 90px;
                object-fit: cover;
                margin-right: 1rem;
            }

            .cart-item-details {
                flex: 1;
            }

            .cart-item-title {
                font-weight: bold;
                margin-bottom: 0.3rem;
            }

            .cart-item-author {
                color: #777;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            .cart-item-price {
                font-weight: bold;
            }

            .cart-item-actions {
                display: flex;
                align-items: center;
            }

            .quantity-control {
                display: flex;
                align-items: center;
                margin-right: 1rem;
            }

            .quantity-control button {
                width: 25px;
                height: 25px;
                background: #f1f1f1;
                border: none;
                cursor: pointer;
            }

            .quantity-control input {
                width: 30px;
                text-align: center;
                margin: 0 5px;
            }

            .remove-item {
                color: #ff4444;
                cursor: pointer;
                font-size: 0.9rem;
            }

            .empty-cart {
                text-align: center;
                padding: 2rem;
                color: #777;
            }

            .cart-summary {
                border-top: 1px solid #eee;
                padding-top: 1rem;
            }

            .cart-total {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }

            .total-amount {
                font-weight: bold;
            }

            .checkout-btn {
                width: 100%;
                padding: 0.8rem;
                font-size: 1rem;
            }

            /* Cart Animation */
            .fa-shopping-cart.pulse {
                animation: pulse 0.5s ease-in-out;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }

            .cart-count {
                background: #ff4444;
                color: white;
                border-radius: 50%;
                padding: 0.2rem 0.4rem;
                font-size: 0.7rem;
                position: relative;
                top: -10px;
                right: 5px;
            }

            /* Profile Modal Styles */
            .profile-tabs {
                display: flex;
                border-bottom: 1px solid #eee;
                margin-bottom: 1rem;
            }

            .tab-btn {
                padding: 0.8rem 1rem;
                background: none;
                border: none;
                cursor: pointer;
                font-size: 0.9rem;
                color: #777;
                position: relative;
            }

            .tab-btn.active {
                color: #000;
                font-weight: bold;
            }

            .tab-btn.active::after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 0;
                right: 0;
                height: 2px;
                background: #ff4444;
            }

            .tab-content {
                display: none;
            }

            .saved-card, .saved-address {
                background: #f9f9f9;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .saved-card i {
                font-size: 1.5rem;
                color: #555;
            }

            .saved-card span, .saved-address p {
                flex: 1;
                margin: 0;
            }

            .saved-address h4 {
                margin: 0 0 0.5rem 0;
                flex: 1;
            }

            .saved-address p {
                color: #555;
            }

        </style>
    </head>

    <body>

    <header>
        <div class="logo">Online Bookstore</div>

        <div class="search-bar">
            <form action="/search" method="get" id="searchForm">
                <input type="text" name="query" placeholder="Search title, author, genre" id="searchInput">
                <select name="filter" id="searchFilter">
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="genre">Genre</option>
                </select>
                <button type="submit"><i class="fas fa-search"></i></button>
            </form>
        </div>


        <div class="header-icons">
            <a href="javascript:void(0);" class="small-btn" onclick="openLoginModal()">Sign-in</a>
            <a href="javascript:void(0);" class="small-btn" onclick="openRegisterModal()">Sign-up</a>
            <a href="javascript:void(0);" onclick="openCartModal()" title="Cart">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count" style="display: none">0</span>
            </a>
            <a href="javascript:void(0);" onclick="openProfileModal()" title="Profile"><i class="fas fa-user"></i></a>
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
                            <button type="button" class="btn" onclick="addToCart('${book.id}')">Add to Cart</button>
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
        <a href="/admin">Admin View</a>
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

    <!-- Cart Modal -->
    <div id="cartModal" class="modal">
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h2>Your Shopping Cart</h2>
                <span class="close" onclick="closeCartModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="cart-items">
                    <!-- Cart items will be dynamically inserted here -->
                    <div class="empty-cart">Your cart is empty</div>
                </div>
                <div class="cart-summary">
                    <div class="cart-total">
                        <span>Subtotal:</span>
                        <span class="total-amount">$0.00</span>
                    </div>
                    <button class="modal-btn checkout-btn" onclick="window.location.href='/checkout'">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Profile Modal -->
    <div id="profileModal" class="modal">
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h2>My Profile</h2>
                <span class="close" onclick="closeProfileModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="profile-tabs">
                    <button class="tab-btn active" onclick="openTab(event, 'personalInfo')">Personal Info</button>
                    <button class="tab-btn" onclick="openTab(event, 'changePassword')">Change Password</button>
                    <button class="tab-btn" onclick="openTab(event, 'paymentInfo')">Payment Info</button>
                    <button class="tab-btn" onclick="openTab(event, 'addressInfo')">Address</button>
                </div>

                <!-- Personal Info Tab -->
                <div id="personalInfo" class="tab-content" style="display: block;">
                    <form class="modal-form">
                        <input type="text" name="firstName" placeholder="First Name" value="John">
                        <input type="text" name="lastName" placeholder="Last Name" value="Doe">
                        <input type="email" name="email" placeholder="Email" value="john.doe@example.com">
                        <input type="tel" name="phone" placeholder="Phone" value="(123) 456-7890">
                        <button type="submit" class="modal-btn">Update Info</button>
                    </form>
                </div>

                <!-- Change Password Tab -->
                <div id="changePassword" class="tab-content">
                    <form class="modal-form">
                        <input type="password" name="currentPassword" placeholder="Current Password">
                        <input type="password" name="newPassword" placeholder="New Password">
                        <input type="password" name="confirmPassword" placeholder="Confirm New Password">
                        <button type="submit" class="modal-btn">Change Password</button>
                    </form>
                </div>

                <!-- Payment Info Tab -->
                <div id="paymentInfo" class="tab-content">
                    <div class="saved-card">
                        <i class="fas fa-credit-card"></i>
                        <span>VISA ending in 4242</span>
                        <button class="small-btn">Edit</button>
                        <button class="small-btn" style="color: #ff4444;">Remove</button>
                    </div>
                    <form class="modal-form" style="margin-top: 1rem;">
                        <input type="text" name="cardNumber" placeholder="Card Number">
                        <input type="text" name="cardName" placeholder="Name on Card">
                        <div style="display: flex; gap: 1rem;">
                            <input type="text" name="expiry" placeholder="MM/YY" style="flex: 1;">
                            <input type="text" name="cvv" placeholder="CVV" style="flex: 1;">
                        </div>
                        <button type="submit" class="modal-btn">Add Payment Method</button>
                    </form>
                </div>

                <!-- Address Info Tab -->
                <div id="addressInfo" class="tab-content">
                    <div class="saved-address">
                        <h4>Primary Address</h4>
                        <p>123 Main St, Apt 4B<br>New York, NY 10001</p>
                        <button class="small-btn">Edit</button>
                    </div>
                    <form class="modal-form" style="margin-top: 1rem;">
                        <input type="text" name="street" placeholder="Street Address">
                        <input type="text" name="apt" placeholder="Apt, Suite, etc.">
                        <input type="text" name="city" placeholder="City">
                        <div style="display: flex; gap: 1rem;">
                            <input type="text" name="state" placeholder="State" style="flex: 1;">
                            <input type="text" name="zip" placeholder="ZIP Code" style="flex: 1;">
                        </div>
                        <button type="submit" class="modal-btn">Add Address</button>
                    </form>
                </div>
            </div>
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

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchForm = document.getElementById('searchForm');
        const searchFilter = document.getElementById('searchFilter');
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        searchForm.appendChild(suggestionsContainer);

        // Mock search suggestions - these would normally come from backend
        const mockSuggestions = {
            title: ['The Great Gatsby', 'To Kill a Mockingbird', '1984'],
            author: ['F. Scott Fitzgerald', 'Harper Lee', 'George Orwell'],
            genre: ['Classic Literature', 'Dystopian', 'Fiction']
        };

        searchInput.addEventListener('input', function() {
            const filter = searchFilter.value;
            const query = this.value.toLowerCase();

            if (query.length > 1) {
                const filtered = mockSuggestions[filter].filter(item =>
                    item.toLowerCase().includes(query)
                ).slice(0, 5);

                showSuggestions(filtered);
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });

        function showSuggestions(items) {
            if (items.length > 0) {
                suggestionsContainer.innerHTML = '';
                items.forEach(item => {
                    const div = document.createElement('div');
                    div.textContent = item;
                    div.addEventListener('click', function() {
                        searchInput.value = item;
                        suggestionsContainer.style.display = 'none';
                        searchForm.submit();
                    });
                    suggestionsContainer.appendChild(div);
                });
                suggestionsContainer.style.display = 'block';
            } else {
                suggestionsContainer.style.display = 'none';
            }
        }

        // Close suggestions when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target)) {
                suggestionsContainer.style.display = 'none';
            }
        });

        // Cart functionality
        let cart = [];

        function openCartModal() {
            updateCartDisplay();
            document.getElementById('cartModal').style.display = 'block';
        }

        function closeCartModal() {
            document.getElementById('cartModal').style.display = 'none';
        }

        function addToCart(bookId) {
            // In a real app, this would call your backend
            const book = getBookById(bookId); // You'll need to implement this
            if (book) {
                const existingItem = cart.find(item => item.id === bookId);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        price: parseFloat(book.price.replace('$', '')),
                        imageUrl: book.imageUrl,
                        quantity: 1
                    });
                }
                updateCartDisplay();
                showCartNotification();
                updateCartCount();
            }
        }

        function updateCartDisplay() {
            const cartItemsContainer = document.querySelector('.cart-items');
            const cartTotal = document.querySelector('.total-amount');

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
                cartTotal.textContent = '$0.00';
                return;
            }

            let itemsHTML = '';
            let subtotal = 0;

            cart.forEach(item => {
                subtotal += item.price * item.quantity;
                itemsHTML += `
                <div class="cart-item">
                    <img src="${item.imageUrl}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-author">by ${item.author}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button onclick="updateQuantity('${item.id}', -1)">-</button>
                            <input type="text" value="${item.quantity}" readonly>
                            <button onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                        <div class="remove-item" onclick="removeFromCart('${item.id}')">Remove</div>
                    </div>
                </div>
            `;
            });

            cartItemsContainer.innerHTML = itemsHTML;
            cartTotal.textContent = `$${subtotal.toFixed(2)}`;
        }

        function updateCartCount() {
            const cartCount = document.querySelector('.cart-count');
            if (cart.length > 0) {
                cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
                cartCount.style.display = 'inline';
            } else {
                cartCount.style.display = 'none';
            }
        }

        function updateQuantity(bookId, change) {
            const item = cart.find(item => item.id === bookId);
            if (item) {
                item.quantity += change;
                if (item.quantity < 1) {
                    cart = cart.filter(item => item.id !== bookId);
                }
                updateCartDisplay();
                updateCartCount();
            }
        }

        function removeFromCart(bookId) {
            cart = cart.filter(item => item.id !== bookId);
            updateCartDisplay();
            updateCartCount();
        }

        function showCartNotification() {
            const cartIcon = document.querySelector('.fa-shopping-cart');
            cartIcon.classList.add('pulse');
            setTimeout(() => {
                cartIcon.classList.remove('pulse');
            }, 1000);
        }

        // Profile Modal Functions
        function openProfileModal() {
            document.getElementById('profileModal').style.display = 'block';
        }

        function closeProfileModal() {
            document.getElementById('profileModal').style.display = 'none';
        }

        function openTab(evt, tabName) {
            const tabContents = document.getElementsByClassName('tab-content');
            for (let i = 0; i < tabContents.length; i++) {
                tabContents[i].style.display = 'none';
            }

            const tabButtons = document.getElementsByClassName('tab-btn');
            for (let i = 0; i < tabButtons.length; i++) {
                tabButtons[i].className = tabButtons[i].className.replace(' active', '');
            }

            document.getElementById(tabName).style.display = 'block';
            evt.currentTarget.className += ' active';
        }

        // Update window.onclick to handle profile modal
        window.onclick = function (e) {
            if (e.target === document.getElementById('registerModal')) closeRegisterModal();
            if (e.target === document.getElementById('loginModal')) closeLoginModal();
            if (e.target === document.getElementById('cartModal')) closeCartModal();
            if (e.target === document.getElementById('profileModal')) closeProfileModal();
        };

        // Helper function - you'll need to implement this based on your book data
        function getBookById(bookId) {
            // This should return the book object from your data
            // For now, returning a mock book
            return {
                id: bookId,
                title: "Sample Book",
                author: "Sample Author",
                price: "10.99",
                imageUrl: "https://via.placeholder.com/150x225?text=Sample"
            };
        }

        // Initialize cart count on page load
        document.addEventListener('DOMContentLoaded', function() {
            updateCartCount();
        });

    </script>

    </body>
    </html>
