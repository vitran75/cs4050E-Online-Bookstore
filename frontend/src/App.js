import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import CartModal from './components/CartModal';
import Profile from './pages/Profile';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import ManageBooks from './pages/ManageBooks';
import ManageUsers from './pages/ManageUsers';
import ManagePromotions from './pages/ManagePromotions';
import CheckOut from './pages/CheckOut';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPassword from './components/ForgotPassword';
import Logout from './components/Logout';
import OrderConfirmation from './components/OrderConfirmation';
import OrderHistory from './components/OrderHistory';
import PrivateRoute from './pages/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import BookDetails from "./pages/BookDetails";

const App = () => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleCartClick = () => setIsCartOpen(true);
  const closeCartModal = () => setIsCartOpen(false);

  const handleAddToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCart.map((item) =>
            item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });

    setCartMessage(`${book.title} added to cart!`);
    setTimeout(() => setCartMessage(''), 3000);
    handleCartClick(); // Open the cart modal
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) return prevCart.filter((item) => item.id !== id);
      return prevCart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const handleRemoveItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
      <Router>
        <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
          <Header onCartClick={handleCartClick} />

          <main style={{ flex: 1 }}>
            <Routes>
              <Route
                  path="/"
                  element={
                    <Home
                        onAddToCart={handleAddToCart}
                        cartItems={cart}
                        onCartClick={handleCartClick}
                    />
                  }
              />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/checkout" element={<PrivateRoute><CheckOut /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
              <Route path="/history" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
              <Route path="/order-confirmation" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />
              <Route path="/book/:id" element={<BookDetails onAddToCart={handleAddToCart} />} />
              <Route path="/admin" element={<RoleRoute allowedRole="ADMIN"><AdminPanel /></RoleRoute>} />
              <Route path="/admin/books" element={<RoleRoute allowedRole="ADMIN"><ManageBooks /></RoleRoute>} />
              <Route path="/admin/users" element={<RoleRoute allowedRole="ADMIN"><ManageUsers /></RoleRoute>} />
              <Route path="/admin/promotions" element={<RoleRoute allowedRole="ADMIN"><ManagePromotions /></RoleRoute>} />
            </Routes>
          </main>

          <Footer />

          {isCartOpen && (
              <CartModal
                  cartItems={cart}
                  onClose={closeCartModal}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
              />
          )}

          {/* Toast Message */}
          {cartMessage && (
              <div style={{
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#ff0000',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                zIndex: 9999,
                boxShadow: '0 0 10px rgba(0,0,0,0.3)'
              }}>
                {cartMessage}
              </div>
          )}
        </div>
      </Router>
  );
};

export default App;
