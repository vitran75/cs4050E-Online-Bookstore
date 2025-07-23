import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderId } = state || {};

  const [order, setOrder] = useState(null);
  const [card, setCard] = useState(null);
  const [emailStatus, setEmailStatus] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const orderResponse = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
        const orderData = orderResponse.data;
        setOrder(orderData);

        const cardId = orderData?.paymentCard?.cardId;
        if (cardId) {
          const cardResponse = await axios.get(`http://localhost:8080/api/payment-cards/${cardId}`);
          setCard(cardResponse.data);
        }

        await axios.put(`http://localhost:8080/api/orders/${orderId}/send-confirmation-email`);
        setEmailStatus(true);
      } catch (error) {
        console.error("Error fetching order info:", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  const totalAmount = () => {
    if (!order) return "0.00";

    let subtotal = order.orderItems.reduce((sum, item) => {
      return sum + item.bookPrice.price * item.quantity;
    }, 0);

    if (order.promotion?.discountPercentage) {
      subtotal *= 1 - order.promotion.discountPercentage / 100;
    }

    return subtotal.toFixed(2);
  };

  const displayCardExpiry = () => {
    if (!card?.expirationDate) return "";
    const date = new Date(card.expirationDate);
    return `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const purchaseDate = order?.orderDate
    ? new Date(order.orderDate).toLocaleDateString()
    : "Unknown";

  return (
    <div className="bg-[#141414] min-h-screen text-white p-6 text-center">
      <h1 className="text-[#e50914] text-3xl font-bold mb-2">Order Confirmed</h1>
      <h2 className="text-lg mb-6">We appreciate your purchase!</h2>

      {!order ? (
        <p>Loading order details...</p>
      ) : (
        <div className="bg-[#222] rounded-lg p-6 mx-auto max-w-2xl text-left">
          <h3 className="text-[#e50914] mb-2">Order ID: {order.orderId}</h3>
          <h3 className="text-[#e50914] mb-2">Purchase Date: {purchaseDate}</h3>

          <h3 className="text-[#e50914] mt-4 mb-2">Items</h3>
          <ul className="space-y-2">
            {order.orderItems.map((item) => (
              <li key={item.id} className="bg-[#333] p-3 rounded">
                <span className="block font-semibold">{item.book.title}</span>
                <span>Qty: {item.quantity} @ ${item.bookPrice.price}</span>
              </li>
            ))}
          </ul>

          {card && (
            <div className="mt-5">
              <h3 className="text-[#e50914] mb-2">Payment Method</h3>
              <p>Card ending in {card.lastFourDigits} (exp {displayCardExpiry()})</p>
            </div>
          )}

          <h3 className="text-[#e50914] mt-6 mb-2">Total Paid: ${totalAmount()}</h3>
          {order.promotion && (
            <p>
              Discount: {order.promotion.promoCode} (-{order.promotion.discountPercentage}%)
            </p>
          )}
          {emailStatus && <p className="text-green-400 mt-3">Confirmation email has been sent.</p>}
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          className="w-52 py-3 px-5 bg-[#e50914] hover:bg-[#b20710] rounded-lg text-white transition"
          onClick={() => navigate("/profile")}
        >
          Back to Home
        </button>
        <button
          className="w-52 py-3 px-5 bg-[#e50914] hover:bg-[#b20710] rounded-lg text-white transition"
          onClick={() => navigate("/history")}
        >
          View Order History
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
