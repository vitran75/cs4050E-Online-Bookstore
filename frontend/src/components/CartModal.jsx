import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CartModal.css'; // ensure your styles are loaded

const CartModal = ({ cartItems, onClose, onUpdateQuantity, onRemoveItem }) => {
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose(); // Close the modal first
        navigate('/checkout'); // Then navigate to checkout page
    };

    return (
        <div className="cart-modal-overlay">
            <div className="cart-modal">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Your Cart</h2>

                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        <ul>
                            {cartItems.map((item) => (
                                <li key={item.id} style={{ marginBottom: '1rem' }}>
                                    <div><strong>{item.title}</strong></div>
                                    <div>Author: {item.author}</div>
                                    <div>Price: ${item.price}</div>
                                    <div>
                                        Quantity:
                                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity === 1}>−</button>
                                        <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button onClick={() => onRemoveItem(item.id)} style={{ marginTop: '6px', backgroundColor: 'darkred' }}>Remove</button>
                                </li>
                            ))}
                        </ul>

                        <button className="checkout-btn" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartModal;
