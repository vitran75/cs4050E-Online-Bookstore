import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { jwtDecode } from 'jwt-decode'; 

import '../styles/Checkout.css';

const Checkout = () => {
  const [customerId, setCustomerId] = useState(null);
  const [savedCard, setSavedCard] = useState(null);
  const [savedAddress, setSavedAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [confirmationShown, setConfirmationShown] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);
    
      const id = decoded.id ?? decoded.userId;
      if (!id || isNaN(id)) {
        throw new Error("Invalid ID in JWT");
      }
    
      setCustomerId(Number(id));
    } catch (err) {
      console.error("JWT decode error:", err.message);
      alert("Invalid token. Please log in again.");
    }
    

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    if (!customerId) return;

    fetch(`http://localhost:8080/api/payment-cards/customer/${customerId}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setSavedCard)
      .catch(() => setSavedCard(null));

    fetch(`http://localhost:8080/api/customers/${customerId}/addresses`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setSavedAddress(data[0]))
      .catch(() => setSavedAddress(null));
  }, [customerId]);

  const completeOrder = async () => {
    if (!savedCard || !savedAddress || cartItems.length === 0) {
      alert("Missing card, address, or cart items.");
      return;
    }

    const orderPayload = {
      customerId,
      paymentCardId: savedCard.id,
      addressId: savedAddress.id,
      orderItems: cartItems.map(item => ({
        bookId: item.bookId,
        quantity: item.quantity,
        price: item.unitPrice,
      })),
    };

    try {
      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error("Failed to place order");
      setConfirmationShown(true);
    } catch (e) {
      alert(e.message);
    }
  };

  const submitNewCard = () => {
    const cardNumber = document.getElementById("card-number").value;
    const expirationDate = document.getElementById("expiry").value;
    const cvv = document.getElementById("cvv").value;
    const cardHolderName = document.getElementById("cardholder").value;

    fetch(`http://localhost:8080/api/payment-cards/customer/${customerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardNumber, expirationDate, cvv, cardHolderName })
    })
      .then(res => res.ok ? res.json() : Promise.reject("Card submission failed"))
      .then(card => {
        setSavedCard(card);
        completeOrder();
      })
      .catch(alert);
  };

  const submitPayment = () => {
    showCardForm ? submitNewCard() : completeOrder();
  };

  if (!customerId) return <div>Loading...</div>;

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
        {/* === Payment Step === */}
        <div className="step">
          <h2 className="step-title">Payment Information</h2>
          {savedCard && !showCardForm ? (
            <div className="saved-card">
              <div>**** **** **** {savedCard.cardNumber?.slice(-4)}</div>
              <div>Expires {savedCard.expirationDate}</div>
              <button onClick={() => setShowCardForm(true)}>Change</button>
            </div>
          ) : (
            <div className="form">
              <input id="card-number" placeholder="Card Number" />
              <input id="expiry" placeholder="MM/YY" />
              <input id="cvv" placeholder="CVV" />
              <input id="cardholder" placeholder="Cardholder Name" />
              <button onClick={() => setShowCardForm(false)}>Use Saved Card</button>
            </div>
          )}
        </div>

        {/* === Address Step === */}
        <div className="step">
          <h2 className="step-title">Shipping Address</h2>
          {savedAddress && !showAddressForm ? (
            <div className="saved-address">
              <div>{savedAddress.fullName}</div>
              <div>{savedAddress.addressLine1}</div>
              <div>{savedAddress.city}, {savedAddress.state} {savedAddress.zipCode}</div>
              <button onClick={() => setShowAddressForm(true)}>Change</button>
            </div>
          ) : (
            <div className="form">
              {/* You can implement address form if needed */}
              <p>Address form (not implemented)</p>
              <button onClick={() => setShowAddressForm(false)}>Use Saved Address</button>
            </div>
          )}
        </div>

        {/* === Review & Submit === */}
        <div className="step">
          <h2>Review Order</h2>
          {cartItems.map(item => (
            <div key={item.bookId}>
              Book #{item.bookId} - Qty: {item.quantity} - ${item.unitPrice * item.quantity}
            </div>
          ))}
          <button className="btn-primary" onClick={submitPayment}>Complete Order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
