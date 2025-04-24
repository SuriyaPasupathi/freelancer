import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, Pencil, X, LogOut } from "lucide-react";

const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
);

const TextArea = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
    ></textarea>
  </div>
);

const FileInput = ({ label, name, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type="file" name={name} onChange={onChange} className="w-full" />
  </div>
);

const UserProfile = () => {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [videoIntro, setVideoIntro] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get("http://localhost:8000/api/get_profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile(res.data);
        setFormData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profile_pic") setProfilePic(files[0]);
    if (name === "video_intro") setVideoIntro(files[0]);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("access_token");
    const form = new FormData();

    for (let key in formData) {
      if (key !== "profile_pic" && key !== "video_intro") {
        form.append(key, formData[key]);
      }
    }

    if (profilePic instanceof File) form.append("profile_pic", profilePic);
    if (videoIntro instanceof File) form.append("video_intro", videoIntro);

    try {
      const response = await axios.put("http://localhost:8000/api/update_profile/", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(response.data);
      setFormData(response.data);
      setIsEditing(false);
      setProfilePic(null);
      setVideoIntro(null);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profile);
    setProfilePic(null);
    setVideoIntro(null);
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
  
    if (!accessToken || !refreshToken) {
      console.error("Missing tokens.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/logout/",
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Ensure the access token is sent in the header
          },
        }
      );
  
      // If logout is successful, log a success message
      console.log("Logout successful:", response.data);
  
      // Clear tokens from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
  
      // Redirect to login page with a message
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
  
      // Even if logout API fails, clear local storage and redirect
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
  };
  
  
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          {profile.profile_pic && (
            <img
              src={`http://localhost:8000${profile.profile_pic}`}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <h2 className="text-2xl font-bold text-blue-700">{profile.name || "User Profile"}</h2>
        </div>

        <div className="flex gap-3">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
            >
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </div>

      {isEditing ? (
        <form className="space-y-4">
          <Input label="Name" name="name" value={formData.name || ""} onChange={handleChange} />
          <Input label="Job Title" name="job_title" value={formData.job_title || ""} onChange={handleChange} />
          <Input label="Job Specialization" name="job_specialization" value={formData.job_specialization || ""} onChange={handleChange} />
          <Input label="Email" name="email" value={formData.email || ""} onChange={handleChange} />
          <Input label="Mobile" name="mobile" value={formData.mobile || ""} onChange={handleChange} />
          <TextArea label="Services" name="services" value={formData.services || ""} onChange={handleChange} />
          <TextArea label="Experiences" name="experiences" value={formData.experiences || ""} onChange={handleChange} />
          <TextArea label="Skills" name="skills" value={formData.skills || ""} onChange={handleChange} />
          <TextArea label="Tools" name="tools" value={formData.tools || ""} onChange={handleChange} />
          <TextArea label="Education" name="education" value={formData.education || ""} onChange={handleChange} />
          <TextArea label="Certifications" name="certifications" value={formData.certifications || ""} onChange={handleChange} />
          <TextArea label="Portfolio" name="portfolio" value={formData.portfolio || ""} onChange={handleChange} />
          <FileInput label="Profile Picture" name="profile_pic" onChange={handleFileChange} />
          <FileInput label="Video Introduction" name="video_intro" onChange={handleFileChange} />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
            >
              <Save className="w-4 h-4 mr-2" /> Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2 text-gray-700">
          <p><strong>Job Title:</strong> {profile.job_title}</p>
          <p><strong>Specialization:</strong> {profile.job_specialization}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile:</strong> {profile.mobile}</p>
          <p><strong>Services:</strong> {profile.services}</p>
          <p><strong>Experiences:</strong> {profile.experiences}</p>
          <p><strong>Skills:</strong> {profile.skills}</p>
          <p><strong>Tools:</strong> {profile.tools}</p>
          <p><strong>Education:</strong> {profile.education}</p>
          <p><strong>Certifications:</strong> {profile.certifications}</p>
          <p><strong>Portfolio:</strong> {profile.portfolio}</p>
          {profile.video_intro && (
            <video
              src={`http://localhost:8000${profile.video_intro}`}
              controls
              className="w-full mt-4 rounded"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
