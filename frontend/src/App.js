import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import ManageBooks from './pages/ManageBooks';
import ManageUsers from './pages/ManageUsers';
import ManagePromotions from './pages/ManagePromotions';
import CheckOut from './pages/CheckOut';
// import SignUp from './pages/SignUp';
// import LogIn from './pages/LogIn';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
        {/* <Route path="/login" element={<LogIn />} /> */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/books" element={<ManageBooks />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/promotions" element={<ManagePromotions />} />
        <Route path="/checkout" element={<CheckOut />} />
      </Routes>
    </Router>
  );
};

export default App;
