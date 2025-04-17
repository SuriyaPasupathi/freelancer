import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import navigate

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');
  const navigate = useNavigate(); // <-- Init navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Account created successfully! Redirecting...');
        setMessageColor('green');

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorMsg = Object.values(data).flat().join(' | ');
        setMessage(`❌ ${errorMsg}`);
        setMessageColor('red');
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('❌ Something went wrong.');
      setMessageColor('red');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Register</button>
      </form>
      {message && <p style={{ marginTop: '1rem', color: messageColor }}>{message}</p>}
    </div>
  );
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '0.6rem',
  marginBottom: '1rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  width: '100%',
  padding: '0.6rem',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default RegisterForm;
