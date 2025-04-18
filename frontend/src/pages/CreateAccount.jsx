import React, { useState } from "react";

const CreateAccount = () => {
  const [subscription, setSubscription] = useState("free"); // free | standard | premium
  const [formData, setFormData] = useState({
    // Basic Info (Free plan)
    name: "",
    profilePic: null,
    jobTitle: "",
    jobSpecialization: "",
    // Standard plan
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
    // Premium plan
    education: "",
    certifications: "",
    videoIntro: "",
    portfolio: ""
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name.includes(".")) {
      // Handle nested fields like socialLinks.linkedin
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // You can send it to backend API here
    alert("Account created successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Your Professional Profile</h1>

      {/* Subscription Plan Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Select Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free Plan */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${subscription === "free" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
            onClick={() => setSubscription("free")}
          >
            <h3 className="font-bold text-lg">Free</h3>
            <p className="text-gray-500 text-sm mb-2">Basic profile</p>
            <ul className="text-sm list-disc pl-5 mb-4">
              <li>Profile Name and Image</li>
              <li>Review Ratings</li>
              <li>Job Title and Specialization</li>
              <li>Client's Previous Reviews</li>
              <li>Copy URL Link</li>
            </ul>
            <button 
              className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600"
              onClick={() => setSubscription("free")}
            >
              Sign Up Now
            </button>
          </div>

          {/* Standard Plan */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${subscription === "standard" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
            onClick={() => setSubscription("standard")}
          >
            <h3 className="font-bold text-lg">Standard</h3>
            <p className="text-gray-500 text-sm mb-2">Enhanced profile</p>
            <ul className="text-sm list-disc pl-5 mb-4">
              <li>All Free features</li>
              <li>Email, Mobile and Social Media</li>
              <li>Services, Experiences</li>
              <li>Skills and Tools</li>
            </ul>
            <button 
              className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600"
              onClick={() => setSubscription("standard")}
            >
              Sign Up Now
            </button>
          </div>

          {/* Premium Plan */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${subscription === "premium" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
            onClick={() => setSubscription("premium")}
          >
            <h3 className="font-bold text-lg">Premium</h3>
            <p className="text-gray-500 text-sm mb-2">Complete profile</p>
            <ul className="text-sm list-disc pl-5 mb-4">
              <li>All Standard features</li>
              <li>Education and Certifications</li>
              <li>Video Introduction</li>
              <li>Portfolio / Previous Works</li>
            </ul>
            <button 
              className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600"
              onClick={() => setSubscription("premium")}
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* FREE PLAN FIELDS */}
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
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              * Review ratings and client reviews will be added automatically after clients rate your work
            </p>
          </div>
        </div>

        {/* STANDARD PLAN FIELDS */}
        <div className={`p-4 border rounded-lg ${subscription === "free" ? "bg-gray-100 opacity-70" : "bg-white"}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Contact & Professional Details</h2>
            {subscription === "free" && (
              <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Standard Plan Feature
              </span>
            )}
          </div>
          
          <fieldset disabled={subscription === "free"} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Mobile</label>
                <input 
                  type="tel" 
                  name="mobile" 
                  value={formData.mobile}
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Social Media Links</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input 
                  type="url" 
                  name="socialLinks.linkedin" 
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange} 
                  placeholder="LinkedIn" 
                  className="w-full p-2 border rounded-md" 
                />
                <input 
                  type="url" 
                  name="socialLinks.facebook" 
                  value={formData.socialLinks.facebook}
                  onChange={handleChange} 
                  placeholder="Facebook" 
                  className="w-full p-2 border rounded-md" 
                />
                <input 
                  type="url" 
                  name="socialLinks.twitter" 
                  value={formData.socialLinks.twitter}
                  onChange={handleChange} 
                  placeholder="Twitter" 
                  className="w-full p-2 border rounded-md" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Services Offered</label>
              <textarea 
                name="services" 
                value={formData.services}
                onChange={handleChange} 
                className="w-full p-2 border rounded-md h-20" 
                placeholder="Describe the services you offer"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Experience</label>
                <textarea 
                  name="experiences" 
                  value={formData.experiences}
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md h-20" 
                  placeholder="Summarize your relevant experiences"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Skills & Tools</label>
                <textarea 
                  name="skills" 
                  value={formData.skills}
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md h-20" 
                  placeholder="List your key skills and tools you use"
                ></textarea>
              </div>
            </div>
          </fieldset>
        </div>

        {/* PREMIUM PLAN FIELDS */}
        <div className={`p-4 border rounded-lg ${subscription !== "premium" ? "bg-gray-100 opacity-70" : "bg-white"}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Premium Features</h2>
            {subscription !== "premium" && (
              <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                Premium Plan Feature
              </span>
            )}
          </div>
          
          <fieldset disabled={subscription !== "premium"} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Education</label>
                <textarea 
                  name="education" 
                  value={formData.education}
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md h-20" 
                  placeholder="List your educational background"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Certifications</label>
                <textarea 
                  name="certifications" 
                  value={formData.certifications}
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md h-20" 
                  placeholder="List relevant certifications"
                ></textarea>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Video Introduction</label>
              <input 
                type="file" 
                name="videoIntro" 
                accept="video/*" 
                onChange={handleChange} 
                className="w-full p-2 border rounded-md" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Portfolio / Previous Works</label>
              <textarea 
                name="portfolio" 
                value={formData.portfolio}
                onChange={handleChange} 
                className="w-full p-2 border rounded-md h-20" 
                placeholder="Share links or descriptions of your previous work"
              ></textarea>
            </div>
          </fieldset>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;