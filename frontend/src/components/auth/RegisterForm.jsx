import React, { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState(''); // For success/error display

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Account created with', formData);
        setMessage('✅ Account created successfully!');
        // Optionally reset the form
        setFormData({ username: '', email: '', password: '' });
      } else {
        // Backend sent back validation errors
        console.log('Validation errors:', data);
        const errorMsg = Object.values(data).flat().join(' | ');
        setMessage(`❌ ${errorMsg}`);
      }
    } catch (err) {
      console.error('Error creating account', err);
      setMessage('❌ Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit">Register</button>
      </form>

      {/* Message displayed below the form */}
      {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default RegisterForm;
