// src/pages/Checkout.jsx

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import '../styles/Checkout.css';

const Checkout = () => {
  const [showCardForm, setShowCardForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedCard, setSavedCard] = useState(null);
  const [savedAddress, setSavedAddress] = useState(null);
  const [confirmationShown, setConfirmationShown] = useState(false);

  const customerId = 1; // Replace with actual logged-in user ID

  useEffect(() => {
    fetch(`/api/payment-cards/customer/${customerId}`)
      .then(res => res.json())
      .then(setSavedCard)
      .catch(() => setSavedCard(null));

    fetch(`/api/customers/${customerId}/addresses`)
      .then(res => res.json())
      .then(data => setSavedAddress(data[0]))
      .catch(() => setSavedAddress(null));
  }, []);

  const completeOrder = () => setConfirmationShown(true);

  const submitPaymentCard = () => {
    const cardNumber = document.getElementById("card-number").value;
    const expirationDate = document.getElementById("expiry").value;
    const cvv = document.getElementById("cvv").value;
    const cardHolderName = document.getElementById("cardholder").value;

    fetch(`/api/payment-cards/customer/${customerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardNumber, expirationDate, cvv, cardHolderName })
    })
      .then(res => res.json())
      .then(() => completeOrder())
      .catch(err => alert("Payment Error: " + err.message));
  };

  if (confirmationShown) {
    return (
      <div>
        <Header title="Checkout" />
        <div className="confirmation-message">
          <i className="fas fa-check-circle"></i>
          <h2>Order Confirmed!</h2>
          <div className="order-number">Order #BS-2024-001234</div>
          <p>Thank you for your purchase!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Checkout" />
      <div className="checkout-container">
        <div className="checkout-steps">
          {/* Payment Step */}
          <div className="step active">
            <div className="step-header">
              <h2 className="step-title">Payment Information</h2>
              <div className="step-number">1</div>
            </div>
            {savedCard && !showCardForm ? (
              <div className="saved-card">
                <div className="card-info">
                  <div className="card-number">**** **** **** {savedCard.cardNumber.slice(-4)}</div>
                  <div className="card-details">Visa | Expires {savedCard.expirationDate} | {savedCard.cardHolderName}</div>
                </div>
                <button className="change-btn" onClick={() => setShowCardForm(true)}>Change</button>
              </div>
            ) : (
              <div id="payment-form">
                <div className="form-group">
                  <label htmlFor="card-number">Card Number</label>
                  <input type="text" id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiry">Expiry Date</label>
                    <input type="text" id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" placeholder="123" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="cardholder">Cardholder Name</label>
                  <input type="text" id="cardholder" placeholder="John Doe" />
                </div>
                <button className="btn-secondary" onClick={() => setShowCardForm(false)}>Use Saved Card</button>
              </div>
            )}
          </div>

          {/* Shipping Step */}
          <div className="step">
            <div className="step-header">
              <h2 className="step-title">Shipping Address</h2>
              <div className="step-number">2</div>
            </div>
            {savedAddress && !showAddressForm ? (
              <div className="saved-address">
                <div className="address-info">
                  <div><strong>{savedAddress.fullName}</strong></div>
                  <div>{savedAddress.addressLine1}{savedAddress.addressLine2 && `, ${savedAddress.addressLine2}`}</div>
                  <div>{savedAddress.city}, {savedAddress.state} {savedAddress.zipCode}</div>
                  <div>{savedAddress.country}</div>
                </div>
                <button className="change-btn" onClick={() => setShowAddressForm(true)}>Change</button>
              </div>
            ) : (
              <div id="address-form">
                <div className="form-group">
                  <label htmlFor="full-name">Full Name</label>
                  <input type="text" id="full-name" placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label htmlFor="address1">Address Line 1</label>
                  <input type="text" id="address1" placeholder="123 Main Street" />
                </div>
                <div className="form-group">
                  <label htmlFor="address2">Address Line 2 (Optional)</label>
                  <input type="text" id="address2" placeholder="Apt 4B" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" placeholder="New York" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <select id="state">
                      <option value="">Select State</option>
                      <option value="NY">New York</option>
                      <option value="CA">California</option>
                      <option value="TX">Texas</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zip">ZIP Code</label>
                    <input type="text" id="zip" placeholder="10001" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select id="country">
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                </div>
                <button className="btn-secondary" onClick={() => setShowAddressForm(false)}>Use Saved Address</button>
              </div>
            )}
          </div>

          {/* Review Step */}
          <div className="step">
            <div className="step-header">
              <h2 className="step-title">Review Order</h2>
              <div className="step-number">3</div>
            </div>
            <p style={{ color: '#bbb', marginBottom: '1rem' }}>
              Please review your order details before completing your purchase.
            </p>
            <button className="btn-primary" onClick={submitPaymentCard}>Complete Order</button>
          </div>
        </div>

        <div className="order-summary">
          <h3 style={{ color: '#ff4444', marginBottom: '1rem' }}>Order Summary</h3>
          <div className="order-item">
            <div className="book-info">
              <div className="book-title">Sample Book</div>
              <div className="book-author">by Author</div>
            </div>
            <div className="book-price">$10.00</div>
          </div>
          <div className="order-totals">
            <div className="total-row"><span>Subtotal:</span><span>$10.00</span></div>
            <div className="total-row"><span>Shipping:</span><span>$2.00</span></div>
            <div className="total-row"><span>Tax:</span><span>$0.80</span></div>
            <div className="total-row final"><span>Total:</span><span>$12.80</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
