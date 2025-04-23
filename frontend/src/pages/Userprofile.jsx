import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/get_profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile(res.data);
        setFormData(res.data); // Prefill form
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    for (const key in formData) {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    }

    try {
      const res = await axios.put(
        "http://localhost:8000/api/update_profile/",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
    }
  };

  if (!profile) {
    return <div className="text-center mt-10 text-lg text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              ["name", "Name"],
              ["job_title", "Job Title"],
              ["job_specialization", "Specialization"],
              ["email", "Email"],
              ["mobile", "Mobile"],
              ["services", "Services"],
              ["experiences", "Experiences"],
              ["skills", "Skills"],
              ["tools", "Tools"],
              ["education", "Education"],
              ["certifications", "Certifications"],
              ["portfolio", "Portfolio (URL)"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block font-semibold mb-1 text-gray-700">{label}</label>
                <input
                  type="text"
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            ))}

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Profile Picture</label>
              <input
                type="file"
                name="profile_pic"
                accept="image/*"
                onChange={handleChange}
                className="block"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Video Intro</label>
              <input
                type="file"
                name="video_intro"
                accept="video/*"
                onChange={handleChange}
                className="block"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-3 text-gray-700">
            <p><strong>Name:</strong> {profile.name}</p>
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
            {profile.profile_pic && (
              <img
                src={`http://localhost:8000${profile.profile_pic}`}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full mt-3 border"
              />
            )}
            {profile.video_intro && (
              <video
                src={`http://localhost:8000${profile.video_intro}`}
                controls
                className="w-full rounded mt-3"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
