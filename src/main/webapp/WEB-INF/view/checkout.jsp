<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Checkout – Online Bookstore</title>
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

        .checkout-container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 2rem;
        }

        .checkout-steps {
            background-color: #1f1f1f;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 0 8px rgba(255, 68, 68, 0.15);
        }

        .order-summary {
            background-color: #1f1f1f;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 0 8px rgba(255, 68, 68, 0.15);
            height: fit-content;
            position: sticky;
            top: 2rem;
        }

        .step {
            margin-bottom: 2rem;
            padding: 1.5rem;
            border: 1px solid #333;
            border-radius: 8px;
            background-color: #2a2a2a;
        }

        .step.active {
            border-color: #ff4444;
            background-color: #1a1a1a;
        }

        .step-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .step-title {
            color: #ff4444;
            font-size: 1.2rem;
            font-weight: bold;
        }

        .step-number {
            background-color: #ff4444;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .saved-card, .saved-address {
            background-color: #333;
            padding: 1rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card-info, .address-info {
            flex: 1;
        }

        .card-number {
            font-family: monospace;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }

        .card-details {
            color: #bbb;
            font-size: 0.9rem;
        }

        .change-btn {
            background-color: transparent;
            color: #ff4444;
            border: 1px solid #ff4444;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .change-btn:hover {
            background-color: #ff4444;
            color: white;
        }

        .form-group {
            margin-bottom: 1rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #ddd;
            font-weight: 500;
        }

        .form-group input, .form-group select {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #444;
            border-radius: 4px;
            background-color: #2a2a2a;
            color: #f1f1f1;
            font-size: 1rem;
        }

        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #ff4444;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .hidden {
            display: none;
        }

        .btn-primary {
            background-color: #ff4444;
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            margin-top: 1rem;
        }

        .btn-primary:hover {
            background-color: #e03e3e;
        }

        .btn-secondary {
            background-color: transparent;
            color: #ff4444;
            border: 1px solid #ff4444;
            padding: 0.8rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .btn-secondary:hover {
            background-color: #ff4444;
            color: white;
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

        .book-info {
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
        }

        .order-totals {
            border-top: 2px solid #444;
            padding-top: 1rem;
            margin-top: 1rem;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }

        .total-row.final {
            font-weight: bold;
            font-size: 1.2rem;
            color: #ff4444;
            border-top: 1px solid #444;
            padding-top: 0.5rem;
        }

        .confirmation-message {
            background-color: #1f4f1f;
            border: 1px solid #4f8f4f;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            text-align: center;
        }

        .confirmation-message i {
            font-size: 3rem;
            color: #4f8f4f;
            margin-bottom: 1rem;
        }

        .order-number {
            font-size: 1.5rem;
            font-weight: bold;
            color: #ff4444;
            margin: 1rem 0;
        }

        @media (max-width: 768px) {
            .checkout-container {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .order-summary {
                position: static;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="logo">Online Bookstore</div>
        <a href="/" class="back-link">&larr; Back to Store</a>
    </header>

    <div class="checkout-container">
        <div class="checkout-steps">
            <!-- Step 1: Payment Information -->
            <div class="step active" id="payment-step">
                <div class="step-header">
                    <h2 class="step-title">Payment Information</h2>
                    <div class="step-number">1</div>
                </div>

                <div class="saved-card" id="saved-card">
                    <div class="card-info">
                        <div class="card-number">Loading...</div>
                        <div class="card-details">Please wait</div>
                    </div>
                    <button class="change-btn" onclick="showPaymentForm()">Change</button>
                </div>

                <div id="payment-form" class="hidden">
                    <div class="form-group">
                        <label for="card-number">Card Number</label>
                        <input type="text" id="card-number" placeholder="1234 5678 9012 3456">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiry">Expiry Date</label>
                            <input type="text" id="expiry" placeholder="MM/YY">
                        </div>
                        <div class="form-group">
                            <label for="cvv">CVV</label>
                            <input type="text" id="cvv" placeholder="123">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="cardholder">Cardholder Name</label>
                        <input type="text" id="cardholder" placeholder="John Doe">
                    </div>
                    <button class="btn-secondary" onclick="hidePaymentForm()">Use Saved Card</button>
                </div>
            </div>

            <!-- Step 2: Shipping Address -->
            <div class="step" id="shipping-step">
                <div class="step-header">
                    <h2 class="step-title">Shipping Address</h2>
                    <div class="step-number">2</div>
                </div>

                <div class="saved-address" id="saved-address">
                    <div class="address-info">
                        <div>Loading address...</div>
                    </div>
                    <button class="change-btn" onclick="showAddressForm()">Change</button>
                </div>

                <div id="address-form" class="hidden">
                    <div class="form-group">
                        <label for="full-name">Full Name</label>
                        <input type="text" id="full-name" placeholder="John Doe">
                    </div>
                    <div class="form-group">
                        <label for="address1">Address Line 1</label>
                        <input type="text" id="address1" placeholder="123 Main Street">
                    </div>
                    <div class="form-group">
                        <label for="address2">Address Line 2 (Optional)</label>
                        <input type="text" id="address2" placeholder="Apt 4B">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="city">City</label>
                            <input type="text" id="city" placeholder="New York">
                        </div>
                        <div class="form-group">
                            <label for="state">State</label>
                            <select id="state">
                                <option value="">Select State</option>
                                <option value="NY">New York</option>
                                <option value="CA">California</option>
                                <option value="TX">Texas</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="zip">ZIP Code</label>
                            <input type="text" id="zip" placeholder="10001">
                        </div>
                        <div class="form-group">
                            <label for="country">Country</label>
                            <select id="country">
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn-secondary" onclick="hideAddressForm()">Use Saved Address</button>
                </div>
            </div>

            <!-- Step 3: Review Order -->
            <div class="step" id="review-step">
                <div class="step-header">
                    <h2 class="step-title">Review Order</h2>
                    <div class="step-number">3</div>
                </div>
                <p style="color: #bbb; margin-bottom: 1rem;">Please review your order details before completing your purchase.</p>
                <button class="btn-primary" onclick="submitPaymentCard()">Complete Order</button>
            </div>
        </div>

        <!-- Confirmation Page (Hidden by default) -->
        <div id="confirmation-page" class="hidden">
            <div class="confirmation-message">
                <i class="fas fa-check-circle"></i>
                <h2>Order Confirmed!</h2>
                <div class="order-number">Order #BS-2024-001234</div>
                <p>Thank you for your purchase!</p>
            </div>
        </div>

        <div class="order-summary">
            <h3 style="color: #ff4444; margin-bottom: 1rem;">Order Summary</h3>
            <!-- Static order items for now -->
            <div class="order-item">
                <div class="book-info">
                    <div class="book-title">Sample Book</div>
                    <div class="book-author">by Author</div>
                </div>
                <div class="book-price">$10.00</div>
            </div>
            <div class="order-totals">
                <div class="total-row"><span>Subtotal:</span><span>$10.00</span></div>
                <div class="total-row"><span>Shipping:</span><span>$2.00</span></div>
                <div class="total-row"><span>Tax:</span><span>$0.80</span></div>
                <div class="total-row final"><span>Total:</span><span>$12.80</span></div>
            </div>
        </div>
    </div>

    <script>
        const customerId = 1; // Replace with logged-in user ID

        function showPaymentForm() {
            document.getElementById('saved-card').style.display = 'none';
            document.getElementById('payment-form').classList.remove('hidden');
        }

        function hidePaymentForm() {
            document.getElementById('saved-card').style.display = 'flex';
            document.getElementById('payment-form').classList.add('hidden');
        }

        function showAddressForm() {
            document.getElementById('saved-address').style.display = 'none';
            document.getElementById('address-form').classList.remove('hidden');
        }

        function hideAddressForm() {
            document.getElementById('saved-address').style.display = 'flex';
            document.getElementById('address-form').classList.add('hidden');
        }

        function completeOrder() {
            document.querySelector('.checkout-steps').style.display = 'none';
            document.getElementById('confirmation-page').classList.remove('hidden');
            document.title = 'Order Confirmed – Online Bookstore';
        }

        function submitShippingAddress() {
            // Placeholder for address submission logic
            completeOrder();
        }

        function submitPaymentCard() {
            const paymentCard = {
                cardNumber: document.getElementById("card-number").value,
                expirationDate: document.getElementById("expiry").value,
                cvv: document.getElementById("cvv").value,
                cardHolderName: document.getElementById("cardholder").value
            };

            fetch(`/api/payment-cards/customer/${customerId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(paymentCard)
            })
            .then(res => {
                if (!res.ok) throw new Error("Failed to save card");
                return res.json();
            })
            .then(data => {
                console.log("Card saved:", data);
                submitShippingAddress();
            })
            .catch(err => alert("Payment Error: " + err.message));
        }

        document.addEventListener('DOMContentLoaded', function () {
            // Load saved card
            fetch(`/api/payment-cards/customer/${customerId}`)
                .then(res => res.json())
                .then(card => {
                    document.querySelector('.card-number').textContent = `**** **** **** ${card.cardNumber.slice(-4)}`;
                    document.querySelector('.card-details').textContent = `Visa | Expires ${card.expirationDate} | ${card.cardHolderName}`;
                })
                .catch(() => {
                    document.querySelector('.card-number').textContent = `No saved card`;
                    document.querySelector('.card-details').textContent = ``;
                });

            // Load saved address
            fetch(`/api/customers/${customerId}/addresses`)
                .then(res => res.json())
                .then(addresses => {
                    const addr = addresses[0];
                    document.querySelector('#saved-address .address-info').innerHTML = `
                        <div><strong>${addr.fullName}</strong></div>
                        <div>${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}</div>
                        <div>${addr.city}, ${addr.state} ${addr.zipCode}</div>
                        <div>${addr.country}</div>
                    `;
                })
                .catch(() => {
                    document.querySelector('#saved-address .address-info').innerHTML = `<div>No saved address</div>`;
                });
        });
    </script>
</body>
</html>