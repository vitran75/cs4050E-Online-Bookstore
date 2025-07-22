import React from 'react';
import Header from '../components/Header';
import '../styles/Checkout.css';

const Checkout = () => {
  const handleCompleteOrder = () => {
    alert('Order completed!');
  };

  return (
    <div>
      <Header title="Checkout" />
      <div className="checkout-container">
        <div className="checkout-steps">
          <h2 className="step-title">Payment Information</h2>
          <input type="text" placeholder="Card Number" />
          <input type="text" placeholder="Name on Card" />

          <h2 className="step-title">Shipping Address</h2>
          <input type="text" placeholder="Full Name" />
          <input type="text" placeholder="Street Address" />

          <button className="btn-primary" onClick={handleCompleteOrder}>Complete Order</button>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-item">
            <span>Sample Book</span>
            <span>$10.00</span>
          </div>
          <div className="order-total">
            <strong>Total:</strong> $10.00
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;