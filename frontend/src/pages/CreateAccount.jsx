import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ used for navigation
  const [subscriptionType, setSubscriptionType] = useState("free");

  const [formData, setFormData] = useState({
    name: "",
    profile_pic: null,
    job_title: "",
    job_specialization: "",
    email: "",
    mobile: "",
    services: "",
    experiences: "",
    skills: "",
    tools: "",
    education: "",
    certifications: "",
    video_intro: null,
    portfolio: "",
  });

  useEffect(() => {
    if (location.state?.subscription_type) {
      setSubscriptionType(location.state.subscription_type);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    const form = new FormData();
    form.append("subscription_type", subscriptionType);
    for (const [key, value] of Object.entries(formData)) {
      if (value) form.append(key, value);
    }

    try {
      const res = await axios.post("http://localhost:8000/api/createaccount/", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Account created successfully!");

      // ✅ Redirect to user profile page and pass response data
      navigate("/userprofile", {
        state: { profile: res.data },
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to create account.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Your Profile</h1>

      {/* Subscription Type Selector */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Subscription Type:</label>
        <select
          value={subscriptionType}
          onChange={(e) => setSubscriptionType(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="free">Free</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Free Tier */}
        <div className="p-4 border rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border rounded-md" required />
            <input type="file" name="profile_pic" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded-md" />
            <input name="job_title" value={formData.job_title} onChange={handleChange} placeholder="Job Title" className="w-full p-2 border rounded-md" required />
            <input name="job_specialization" value={formData.job_specialization} onChange={handleChange} placeholder="Specialization" className="w-full p-2 border rounded-md" required />
          </div>
        </div>

        {/* Standard Tier */}
        {subscriptionType !== "free" && (
          <div className="p-4 border rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-2">Standard Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded-md" required />
              <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" className="w-full p-2 border rounded-md" required />
            </div>
            <textarea name="services" value={formData.services} onChange={handleChange} placeholder="Services" className="w-full p-2 border rounded-md" />
            <textarea name="experiences" value={formData.experiences} onChange={handleChange} placeholder="Experience" className="w-full p-2 border rounded-md" />
            <textarea name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills" className="w-full p-2 border rounded-md" />
            <textarea name="tools" value={formData.tools} onChange={handleChange} placeholder="Tools" className="w-full p-2 border rounded-md" />
          </div>
        )}

        {/* Premium Tier */}
        {subscriptionType === "premium" && (
          <div className="p-4 border rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-2">Premium Add-ons</h2>
            <input name="education" value={formData.education} onChange={handleChange} placeholder="Education" className="w-full p-2 border rounded-md" />
            <input name="certifications" value={formData.certifications} onChange={handleChange} placeholder="Certifications" className="w-full p-2 border rounded-md" />
            <input type="file" name="video_intro" accept="video/*" onChange={handleChange} className="w-full p-2 border rounded-md" />
            <input name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="Portfolio URL" className="w-full p-2 border rounded-md" />
          </div>
        )}

        <div className="text-center">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
            Create Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
