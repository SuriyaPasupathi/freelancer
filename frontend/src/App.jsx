import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import all page components
import Register from "./pages/Register";
import LoginForm from "./components/auth/LoginForm";
import SubscriptionPage from "./pages/subscriptions";
import ForgotPassword from "./pages/ForgotPassword";

import ProfilePage from "./pages/Userprofile";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />

        {/* App Pages */}
  
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/Userprofile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;
