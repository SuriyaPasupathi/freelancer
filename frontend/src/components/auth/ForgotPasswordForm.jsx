import { useState } from 'react';
import { forgotPassword } from '../../api/auth';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      alert('Password reset failed');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
        <button type="submit">Reset Password</button>
      </form>
      {success && <p>Check your email for reset instructions.</p>}
    </div>
  );
};

export default ForgotPasswordForm;
