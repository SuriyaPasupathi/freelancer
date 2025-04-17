import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './components/auth/LoginForm';
import Register from './components/auth/RegisterForm';
import SubscriptionPage from './pages/subscriptions'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subscribe" element={<SubscriptionPage />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
