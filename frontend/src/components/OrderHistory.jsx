import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/OrderHistory.css';

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
            `http://localhost:8080/api/orders/customer/${userId}`
        );
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOrders();
  }, [userId]);

  if (loading) return <p>Loading your order history...</p>;
  if (error) return <p>{error}</p>;
  if (orders.length === 0) return <p>You have no past orders.</p>;

  return (
      <div className="order-history">
        {orders.map((order) => (
            <div className="order-card" key={order.orderId}>
              <h4>Order #{order.orderId}</h4>
              <p><strong>Date:</strong> {new Date(order.createdAt ?? order.orderDate).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</p>

              <ul className="order-items">
                {(order.orderItems || []).map((item, index) => (
                    <li key={index}>
                      <span>{item.book?.title ?? 'Untitled Book'}</span> &times; {item.quantity} (${item.unitPrice ? item.unitPrice.toFixed(2) : '0.00'} each)
                    </li>
                ))}
              </ul>
            </div>
        ))}
      </div>
  );
};

export default OrderHistory;
