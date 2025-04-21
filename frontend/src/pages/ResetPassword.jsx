import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      return setMessage("Passwords do not match.");
    }

    try {
      const res = await axios.post("http://localhost:8000/api/reset-password-confirm/", {
        uid,
        token,
        new_password: password,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000); // redirect after success
    } catch (err) {
      setMessage("Reset failed. Invalid or expired link.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 rounded-lg w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="w-full px-4 py-2 border rounded-md mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full px-4 py-2 border rounded-md mb-4"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          Reset Password
        </button>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
