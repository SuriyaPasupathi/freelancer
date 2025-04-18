import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import all page components
import Register from "./pages/Register";
import LoginForm from "./components/auth/LoginForm";
import SubscriptionPage from "./pages/subscriptions";
import CreateAccount from "./pages/CreateAccount";
import ForgotPassword from "./pages/ForgotPassword";

import ProfilePage from "./pages/Userprofile";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/CreateAccount" element={<CreateAccount />} />

        {/* App Pages */}
  
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/Userprofile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;
