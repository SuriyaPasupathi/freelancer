import { useState } from 'react';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(form);
      localStorage.setItem('access', response.data.access); // Save token
      alert('Login successful');
      navigate('/subscription'); // Or wherever your protected route is
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
