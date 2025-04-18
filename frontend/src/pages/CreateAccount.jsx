import React, { useState } from "react";
import axios from "axios";

const CreateAccount = () => {
  const [subscription, setSubscription] = useState("free");
  const [formData, setFormData] = useState({
    name: "",
    profilePic: null,
    jobTitle: "",
    jobSpecialization: "",
    email: "",
    mobile: "",
    socialLinks: {
      linkedin: "",
      facebook: "",
      twitter: ""
    },
    services: "",
    experiences: "",
    skills: "",
    tools: "",
    education: "",
    certifications: "",
    videoIntro: "",
    portfolio: ""
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("subscription", subscription);
    form.append("name", formData.name);
    form.append("jobTitle", formData.jobTitle);
    form.append("jobSpecialization", formData.jobSpecialization);
    if (formData.profilePic) {
      form.append("profilePic", formData.profilePic);
    }

    if (subscription !== "free") {
      form.append("email", formData.email);
      form.append("mobile", formData.mobile);
      form.append("services", formData.services);
      form.append("experiences", formData.experiences);
      form.append("skills", formData.skills);
      form.append("tools", formData.tools);
      form.append("socialLinks.linkedin", formData.socialLinks.linkedin);
      form.append("socialLinks.facebook", formData.socialLinks.facebook);
      form.append("socialLinks.twitter", formData.socialLinks.twitter);
    }

    if (subscription === "premium") {
      form.append("education", formData.education);
      form.append("certifications", formData.certifications);
      form.append("videoIntro", formData.videoIntro);
      form.append("portfolio", formData.portfolio);
    }

    try {
      const res = await axios.post("http://localhost:8000/api/profiles/", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Success:", res.data);
      alert("Account created successfully!");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to create account.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Your Professional Profile</h1>


      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Free Plan Fields */}
        <div className="p-4 border rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Profile Picture</label>
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Title *</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Specialization *</label>
              <input
                type="text"
                name="jobSpecialization"
                value={formData.jobSpecialization}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>
        </div>

        {/* Standard Plan Fields */}
        <div className={`p-4 border rounded-lg ${subscription === "free" ? "bg-gray-100 opacity-60" : "bg-white"}`}>
          <fieldset disabled={subscription === "free"} className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">Contact & Professional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md" />
              <input type="tel" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input type="url" name="socialLinks.linkedin" placeholder="LinkedIn" value={formData.socialLinks.linkedin} onChange={handleChange} className="w-full p-2 border rounded-md" />
              <input type="url" name="socialLinks.facebook" placeholder="Facebook" value={formData.socialLinks.facebook} onChange={handleChange} className="w-full p-2 border rounded-md" />
              <input type="url" name="socialLinks.twitter" placeholder="Twitter" value={formData.socialLinks.twitter} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <textarea name="services" placeholder="Services Offered" value={formData.services} onChange={handleChange} className="w-full p-2 border rounded-md" />
            <textarea name="experiences" placeholder="Experience" value={formData.experiences} onChange={handleChange} className="w-full p-2 border rounded-md" />
            <textarea name="skills" placeholder="Skills" value={formData.skills} onChange={handleChange} className="w-full p-2 border rounded-md" />
            <textarea name="tools" placeholder="Tools" value={formData.tools} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </fieldset>
        </div>

        {/* Premium Plan Fields */}
        <div className={`p-4 border rounded-lg ${subscription === "premium" ? "bg-white" : "bg-gray-100 opacity-60"}`}>
          <fieldset disabled={subscription !== "premium"} className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">Premium Add-ons</h2>
            <input type="text" name="education" placeholder="Education" value={formData.education} onChange={handleChange} className="w-full p-2 border rounded-md" />
            <input type="text" name="certifications" placeholder="Certifications" value={formData.certifications} onChange={handleChange} className="w-full p-2 border rounded-md" />
            <input type="text" name="videoIntro" placeholder="Video Intro (URL)" value={formData.videoIntro} onChange={handleChange} className="w-full p-2 border rounded-md" />
            <input type="text" name="portfolio" placeholder="Portfolio URL" value={formData.portfolio} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </fieldset>
        </div>

        {/* Submit */}
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
