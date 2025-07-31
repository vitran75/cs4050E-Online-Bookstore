import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import '../styles/Checkout.css';

const Checkout = () => {
  // State for customer and cart data
  const [customerId, setCustomerId] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // State for saved data from the backend
  const [savedPaymentInfo, setSavedPaymentInfo] = useState(null);

  // State for new card and address forms
  const [newCardData, setNewCardData] = useState({ decryptedCardNumber: '', expirationDate: '', decryptedCvv: '' });
  const [newAddressData, setNewAddressData] = useState({ streetLine: '', cityName: '', stateCode: '', postalCode: '', countryName: '' });

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

  // 2. Fetch payment info (which includes the address) once we have a customer ID
  useEffect(() => {
    if (!customerId) return;

    const fetchPaymentAndAddress = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/payment-cards/customer/${customerId}`);
        if (!response.ok) throw new Error("No saved payment method found.");
        
        const data = await response.json();
        if (data && data.length > 0) {
          setSavedPaymentInfo(data[0]);
        } else {
          // If no card is found, show the forms to add one
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

    fetchPaymentAndAddress();
  }, [customerId]);

  // 3. Main function to place the order
  const completeOrder = async (paymentDetails) => {
    const finalPaymentInfo = paymentDetails || savedPaymentInfo;

    if (!finalPaymentInfo || !finalPaymentInfo.billingAddress || cartItems.length === 0) {
      Swal.fire("Missing Information", "Please provide payment and address details, and ensure your cart is not empty.", "warning");
      return;
    }

    const orderPayload = {
      customer: { userId: customerId },
      paymentCard: { cardId: finalPaymentInfo.cardId },
      orderItems: cartItems.map(item => ({
        book: { id: item.id },
        quantity: item.quantity,
        unitPrice: item.price
      }))
    };


    try {
      const token = localStorage.getItem('token');

      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Order failed response:", errorText);
        throw new Error(errorText || "Failed to place order");
      }
      
      localStorage.removeItem('cart');
      setConfirmationShown(true);
    } catch (e) {
      Swal.fire("Order Error", e.message, "error");
    }
  };

  // 4. Function to handle submitting a new card and address
  const submitNewCardAndAddress = async () => {
    if (Object.values(newCardData).some(v => !v) || Object.values(newAddressData).some(v => !v)) {
      Swal.fire("Incomplete Form", "Please fill out all new card and address fields.", "warning");
      return;
    }

    const payload = {
      paymentCard: newCardData,
      billingAddress: newAddressData,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/payment-cards/customer/${customerId}/new-address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Card submission failed");
      
      const savedData = await response.json();
      // Use the newly saved card and address to complete the order
      completeOrder(savedData);

    } catch (error) {
      Swal.fire("Submission Error", error.message, "error");
    }
  };

  // 5. Decides whether to use saved info or submit new info
  const handleSubmitPayment = () => {
    if (showCardForm || showAddressForm) {
      submitNewCardAndAddress();
    } else {
      completeOrder();
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
          {savedPaymentInfo && !showCardForm ? (
            <div className="saved-card">
              <div>**** **** **** {savedPaymentInfo.lastFourDigits}</div>
              <div>Expires {savedPaymentInfo.expirationDate}</div>
              <button onClick={() => setShowCardForm(true)}>Change</button>
            </div>
          ) : (
            <div className="form">
              <input type="text" placeholder="Card Number" value={newCardData.decryptedCardNumber} onChange={e => setNewCardData({...newCardData, decryptedCardNumber: e.target.value})} />
              <input type="text" placeholder="MM/YY" value={newCardData.expirationDate} onChange={e => setNewCardData({...newCardData, expirationDate: e.target.value})} />
              <input type="password" placeholder="CVV" value={newCardData.decryptedCvv} onChange={e => setNewCardData({...newCardData, decryptedCvv: e.target.value})} />
              {savedPaymentInfo && <button onClick={() => setShowCardForm(false)}>Use Saved Card</button>}
            </div>
          )}
        </div>

        {/* === Address Step === */}
        <div className="step">
          <h2 className="step-title">Shipping Address</h2>
          {savedPaymentInfo?.billingAddress && !showAddressForm ? (
            <div className="saved-address">
              <div>{savedPaymentInfo.billingAddress.streetLine}</div>
              <div>{savedPaymentInfo.billingAddress.cityName}, {savedPaymentInfo.billingAddress.stateCode} {savedPaymentInfo.billingAddress.postalCode}</div>
              <div>{savedPaymentInfo.billingAddress.countryName}</div>
              <button onClick={() => setShowAddressForm(true)}>Change</button>
            </div>
          ) : (
            <div className="form">
              <input type="text" placeholder="Street Address" value={newAddressData.streetLine} onChange={e => setNewAddressData({...newAddressData, streetLine: e.target.value})} />
              <input type="text" placeholder="City" value={newAddressData.cityName} onChange={e => setNewAddressData({...newAddressData, cityName: e.target.value})} />
              <input type="text" placeholder="State" value={newAddressData.stateCode} onChange={e => setNewAddressData({...newAddressData, stateCode: e.target.value})} />
              <input type="text" placeholder="Zip Code" value={newAddressData.postalCode} onChange={e => setNewAddressData({...newAddressData, postalCode: e.target.value})} />
              <input type="text" placeholder="Country" value={newAddressData.countryName} onChange={e => setNewAddressData({...newAddressData, countryName: e.target.value})} />
              {savedPaymentInfo?.billingAddress && <button onClick={() => setShowAddressForm(false)}>Use Saved Address</button>}
            </div>
          )}
        </div>

        {/* === Review & Submit === */}
        <div className="step">
          <h2>Review Order</h2>
          {cartItems.map(item => (
              <div key={item.id} className="review-item">
                <strong>{item.title}</strong> — Qty: {item.quantity} — ${item.price * item.quantity}
              </div>
          ))}
          <button className="btn-primary" onClick={handleSubmitPayment}>Complete Order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
