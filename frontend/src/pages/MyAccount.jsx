import React, { useState } from 'react';

const MyAccount = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    // other form fields
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    try {
      const res = await fetch("http://localhost:8000/api/my-account/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${yourToken}`, // Replace this with your actual token
        },
        body: form,
      });

      const data = await res.json();
      console.log("Saved!", data);
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  return (
    <div>
      <h1>My Account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        {/* Add more fields as needed */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MyAccount;
