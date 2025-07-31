import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import '../styles/Checkout.css';

const Checkout = () => {
  // State for customer and cart data
  const [customerId, setCustomerId] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // State for data fetched from the backend
  const [savedPaymentInfo, setSavedPaymentInfo] = useState(null);

  // State for the data in the input forms
  const [cardFormData, setCardFormData] = useState({ decryptedCardNumber: '', expirationDate: '', decryptedCvv: '' });
  const [addressFormData, setAddressFormData] = useState({ streetLine: '', cityName: '', stateCode: '', postalCode: '', countryName: '' });

  // UI control state
  const [confirmationShown, setConfirmationShown] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Get customer ID and cart from storage on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.id ?? decoded.userId;
        if (id) setCustomerId(Number(id));
      } catch (err) {
        console.error("Failed to decode JWT:", err);
      }
    }
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);
  
  // Function to fetch the latest payment info
  const fetchPaymentAndAddress = async () => {
    if (!customerId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/payment-cards/customer/${customerId}`);
      if (!response.ok) throw new Error("No saved payment method found.");
      
      const data = await response.json();
      if (data && data.length > 0) {
        setSavedPaymentInfo(data[0]);
      } else {
        // If no card is found, show forms to add one
        setShowCardForm(true);
        setShowAddressForm(true);
      }
    } catch (error) {
      console.warn(error.message);
      setShowCardForm(true);
      setShowAddressForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch payment info when the component loads
  useEffect(() => {
    fetchPaymentAndAddress();
  }, [customerId]);

  // Handlers to show the individual edit forms
  const handleEditCard = () => {
    // Clear card form for security, but keep expiration date if available
    setCardFormData({ decryptedCardNumber: '', expirationDate: savedPaymentInfo?.expirationDate || '', decryptedCvv: '' });
    setShowCardForm(true);
  };

  const handleEditAddress = () => {
    // Pre-fill address form with existing data
    setAddressFormData(savedPaymentInfo.billingAddress);
    setShowAddressForm(true);
  };

  // 3. Main function to place the order
  const handleCompleteOrder = async () => {
    if (showCardForm || showAddressForm) {
        Swal.fire("Unsaved Changes", "Please save or cancel your changes before completing the order.", "warning");
        return;
    }
    if (!savedPaymentInfo || !savedPaymentInfo.billingAddress || cartItems.length === 0) {
      Swal.fire("Missing Information", "Please add a payment method and address, and ensure your cart is not empty.", "warning");
      return;
    }

    // This payload structure matches the DTO on your backend
    const orderPayload = {
      customerId,
      paymentCardId: savedPaymentInfo.cardId,
      addressId: savedPaymentInfo.billingAddress.id,
      orderItems: cartItems.map(item => ({
        bookId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to place order");
      }
      
      localStorage.removeItem('cart');
      setConfirmationShown(true);
    } catch (e) {
      Swal.fire("Order Error", e.message, "error");
    }
  };

  // 4. Function to SAVE updated card info
  const handleSaveCard = async () => {
    if (!cardFormData.decryptedCardNumber || !cardFormData.decryptedCvv) {
        Swal.fire("Incomplete Form", "Please fill out all new card details.", "warning");
        return;
    }
    
    const payload = {
        // We must send the existing address along with the new card details
        billingAddress: savedPaymentInfo.billingAddress,
        paymentCard: cardFormData,
    };

    try {
        const response = await fetch(`http://localhost:8080/api/payment-cards/${savedPaymentInfo.cardId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Card update failed");
        
        await fetchPaymentAndAddress(); // Refetch to get latest data
        setShowCardForm(false);
        Swal.fire("Success", "Your payment method has been updated.", "success");
    } catch (error) {
        Swal.fire("Update Error", error.message, "error");
    }
  };

  // 5. Function to SAVE updated address info
  const handleSaveAddress = async () => {
    if (Object.values(addressFormData).some(v => !v)) {
        Swal.fire("Incomplete Form", "Please fill out all address fields.", "warning");
        return;
    }

    const payload = {
        // We must send blank card info, as we are only updating the address
        paymentCard: { decryptedCardNumber: '', expirationDate: '', decryptedCvv: '' },
        billingAddress: addressFormData,
    };

    try {
        const response = await fetch(`http://localhost:8080/api/payment-cards/${savedPaymentInfo.cardId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Address update failed");

        await fetchPaymentAndAddress(); // Refetch to get latest data
        setShowAddressForm(false);
        Swal.fire("Success", "Your shipping address has been updated.", "success");
    } catch (error) {
        Swal.fire("Update Error", error.message, "error");
    }
  };

  if (isLoading) return <div className="loading-message">Loading...</div>;

  if (confirmationShown) {
    return (
      <div className="confirmation-container">
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
    <div className="checkout-container-wrapper">
      <div className="checkout-container">
        {/* === Payment Step === */}
        <div className="step">
          <h2 className="step-title">Payment Information</h2>
          {!showCardForm && savedPaymentInfo ? (
            <div className="saved-card">
              <div>**** **** **** {savedPaymentInfo.lastFourDigits}</div>
              <div>Expires {savedPaymentInfo.expirationDate}</div>
              <button onClick={handleEditCard}>Change</button>
            </div>
          ) : (
            <div className="form">
              <h3>Update Payment Method</h3>
              <input type="text" placeholder="Card Number" value={cardFormData.decryptedCardNumber} onChange={e => setCardFormData({...cardFormData, decryptedCardNumber: e.target.value})} />
              <input type="text" placeholder="MM/YY" value={cardFormData.expirationDate} onChange={e => setCardFormData({...cardFormData, expirationDate: e.target.value})} />
              <input type="password" placeholder="CVV" value={cardFormData.decryptedCvv} onChange={e => setCardFormData({...cardFormData, decryptedCvv: e.target.value})} />
              <button onClick={handleSaveCard}>Save Card</button>
              {savedPaymentInfo && <button onClick={() => setShowCardForm(false)}>Cancel</button>}
            </div>
          )}
        </div>

        {/* === Address Step === */}
        <div className="step">
          <h2 className="step-title">Shipping Address</h2>
          {!showAddressForm && savedPaymentInfo?.billingAddress ? (
            <div className="saved-address">
              <div>{savedPaymentInfo.billingAddress.streetLine}</div>
              <div>{savedPaymentInfo.billingAddress.cityName}, {savedPaymentInfo.billingAddress.stateCode} {savedPaymentInfo.billingAddress.postalCode}</div>
              <button onClick={handleEditAddress}>Change</button>
            </div>
          ) : (
            <div className="form">
              <h3>Update Shipping Address</h3>
              <input type="text" placeholder="Street Address" value={addressFormData.streetLine} onChange={e => setAddressFormData({...addressFormData, streetLine: e.target.value})} />
              <input type="text" placeholder="City" value={addressFormData.cityName} onChange={e => setAddressFormData({...addressFormData, cityName: e.target.value})} />
              <input type="text" placeholder="State" value={addressFormData.stateCode} onChange={e => setAddressFormData({...addressFormData, stateCode: e.target.value})} />
              <input type="text" placeholder="Zip Code" value={addressFormData.postalCode} onChange={e => setAddressFormData({...addressFormData, postalCode: e.target.value})} />
              <input type="text" placeholder="Country" value={addressFormData.countryName} onChange={e => setAddressFormData({...addressFormData, countryName: e.target.value})} />
              <button onClick={handleSaveAddress}>Save Address</button>
              {savedPaymentInfo?.billingAddress && <button onClick={() => setShowAddressForm(false)}>Cancel</button>}
            </div>
          )}
        </div>

        {/* === Review & Submit === */}
        <div className="step">
          <h2>Review Order</h2>
          <div className="order-items-container">
            {cartItems.map(item => (
              <div key={item.id} className="review-item">
                <span><strong>{item.title}</strong> (Qty: {item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Order Totals */}
          <div className="order-summary">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Tax (7%)</span>
              <span>${(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.07).toFixed(2)}</span>
            </div>
            <div className="summary-line total">
              <strong>Total</strong>
              <strong>${(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.07).toFixed(2)}</strong>
            </div>
          </div>

          <button className="btn-primary" onClick={handleCompleteOrder}>Complete Order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
