import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import all page components
import Home from "./pages/Home";
import Register from "./pages/Register";
import LoginForm from "./components/auth/LoginForm";
import SubscriptionPage from "./pages/SubscriptionPage";
import MyProfile from "./pages/MyProfile";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /home */}
        <Route path="/" element={<Navigate to="/home" />} />
        
        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginForm />} />

        {/* App Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/myprofile" element={<MyProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
