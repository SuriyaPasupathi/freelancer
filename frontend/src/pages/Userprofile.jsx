import React, { useState, useEffect } from "react";
import axios from "axios";
import { Briefcase, Star, User, Save, Pencil } from "lucide-react";

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

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">User Profile</h2>

      {isEditing ? (
        <form className="space-y-4">
          <Input label="Name" name="name" value={formData.name || ""} onChange={handleChange} />
          <Input label="Job Title" name="job_title" value={formData.job_title || ""} onChange={handleChange} />
          <Input label="Job Specialization" name="job_specialization" value={formData.job_specialization || ""} onChange={handleChange} />
          <TextArea label="Bio" name="bio" value={formData.bio || ""} onChange={handleChange} />
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
            <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              <Save className="inline-block mr-2" />
              Save
            </button>
            <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              <Pencil className="inline-block mr-2" />
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <img src={profile.profile_pic} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4" />
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Job Title:</strong> {profile.job_title}</p>
          <p><strong>Job Specialization:</strong> {profile.job_specialization}</p>
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
            <video controls width="300">
              <source src={profile.video_intro} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Pencil className="inline-block mr-2" />
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
  </div>
);

const TextArea = ({ label, name, value, onChange }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows="3"
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
  </div>
);

const FileInput = ({ label, name, onChange }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input type="file" name={name} onChange={onChange} />
  </div>
);

export default UserProfile;
