// src/pages/Home.jsx
import React, { useState } from 'react';
import RegisterForm from '../components/auth/RegisterForm'; // Make sure the path is correct.

const Home = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterClick = () => {
    setIsRegistering(true);
  };

  const handleCancelClick = () => {
    setIsRegistering(false);
  };

  return (
    <div>
      <h1>Welcome to Our Platform</h1>
      <p>Join us today and be part of an amazing community!</p>

      {!isRegistering ? (
        <>
          <button onClick={handleRegisterClick}>Create Account</button>
        </>
      ) : (
        <>
          <h2>Create Your Account</h2>
          <RegisterForm />
          <button onClick={handleCancelClick}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Home;
