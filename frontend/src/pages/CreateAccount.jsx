import React, { useState } from "react";

const CreateAccount = () => {
  const [subscription, setSubscription] = useState("free"); // free | 10 | 20
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    profilePic: null,
    about: "",
    email: "",
    dob: "",
    sex: "",
    phone: "",
    extra: "",
    education: "",
    experience: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubscriptionChange = (value) => {
    setSubscription(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // You can send it to backend API here
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Create Account</h2>

      <div>
        <label>Select Plan:</label><br />
        <button onClick={() => handleSubscriptionChange("free")}>Free</button>
        <button onClick={() => handleSubscriptionChange("10")}>$10</button>
        <button onClick={() => handleSubscriptionChange("20")}>$20</button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        {/* Free Plan Fields */}
        <div>
          <label>Name:</label>
          <input type="text" name="name" onChange={handleChange} required />
        </div>
        <div>
          <label>Role:</label>
          <input type="text" name="role" onChange={handleChange} required />
        </div>
        <div>
          <label>Profile Pic:</label>
          <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
        </div>

        {/* $10 Subscription Fields */}
        <fieldset disabled={subscription === "free"}>
          <legend>$10 Subscription Fields</legend>
          {subscription === "free" && <p style={{ color: "red" }}>Subscribe to access these fields</p>}
          <div>
            <label>About:</label>
            <textarea name="about" onChange={handleChange}></textarea>
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" onChange={handleChange} />
          </div>
          <div>
            <label>Date of Birth:</label>
            <input type="date" name="dob" onChange={handleChange} />
          </div>
          <div>
            <label>Sex:</label>
            <select name="sex" onChange={handleChange}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label>Phone Number:</label>
            <input type="tel" name="phone" onChange={handleChange} />
          </div>
          <div>
            <label>Something Extra:</label>
            <input type="text" name="extra" onChange={handleChange} />
          </div>
        </fieldset>

        {/* $20 Subscription Fields */}
        <fieldset disabled={subscription !== "20"}>
          <legend>$20 Subscription Fields</legend>
          {subscription !== "20" && <p style={{ color: "red" }}>Upgrade to $20 plan to access these fields</p>}
          <div>
            <label>Education Details:</label>
            <textarea name="education" onChange={handleChange}></textarea>
          </div>
          <div>
            <label>Experience Details:</label>
            <textarea name="experience" onChange={handleChange}></textarea>
          </div>
        </fieldset>

        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateAccount;
