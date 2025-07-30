import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import './index.css';    
import '@fortawesome/fontawesome-free/css/all.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import CartModal from './components/CartModal';

library.add(faUser, faShoppingCart);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
