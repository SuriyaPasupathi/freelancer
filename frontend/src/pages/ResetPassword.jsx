import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get UID and token from the URL query parameters
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirm) {
      return setMessage("Passwords do not match.");
    }

    try {
      // Make POST request to API to reset the password
      const res = await axios.post("http://localhost:8000/api/reset-password-confirm/", {
        uid,
        token,
        new_password: password,
      });

      // Show success message
      setMessage(res.data.message);

      // Redirect to login page after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // Show error message if something goes wrong
      setMessage("Reset failed. Invalid or expired link.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 rounded-lg w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-4">Reset Password</h2>

        {/* New password input */}
        <input
          type="password"
          placeholder="New password"
          className="w-full px-4 py-2 border rounded-md mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Confirm password input */}
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full px-4 py-2 border rounded-md mb-4"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        {/* Submit button */}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
          Reset Password
        </button>

        {/* Message (success or error) */}
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("successful") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
