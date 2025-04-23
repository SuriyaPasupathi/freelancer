import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, Star, User, Save, Pencil } from "lucide-react";

const Userprofile = () => {
  const [profile, setProfile] = useState(null);
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

  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh_token");
    const access = localStorage.getItem("access_token");

    try {
      await axios.post(
        "http://localhost:8000/api/logout/",
        { refresh },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
    } catch (err) {
      console.error("Logout API error:", err.response?.data || err.message);
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profile_pic") {
      setProfilePic(files[0]);
    } else if (name === "video_intro") {
      setVideoIntro(files[0]);
    }
  };

  const handleSave = () => {
    const token = localStorage.getItem("access_token");
    const data = new FormData();

    for (let key in formData) {
      data.append(key, formData[key]);
    }

    if (profilePic) data.append("profile_pic", profilePic);
    if (videoIntro) data.append("video_intro", videoIntro);

    axios
      .put("http://localhost:8000/api/update_profile/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setProfile(res.data);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Error updating profile:", err.response?.data || err.message);
      });
  };

  if (!profile) {
    return <div className="text-center mt-10 text-lg text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between max-w-5xl mx-auto mb-6">
        <div className="flex items-center text-gray-700 space-x-2">
          <User className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-lg">{profile.name}</span>
        </div>
        <div className="space-x-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow inline-flex items-center"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow inline-flex items-center"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center md:items-start md:col-span-1">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-green-500 mb-4 shadow-md">
            <img
              src={
                profile.profile_pic
                  ? `http://localhost:8000${profile.profile_pic}`
                  : "https://i.pravatar.cc/150"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {isEditing && (
            <input
              type="file"
              name="profile_pic"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4 text-sm"
            />
          )}
          <h2 className="text-2xl font-bold text-gray-800">{formData.name}</h2>
          {isEditing ? (
            <input
              type="text"
              name="job_title"
              value={formData.job_title || ""}
              onChange={handleChange}
              className="mt-2 px-2 py-1 border rounded text-sm w-full"
              placeholder="Job Title"
            />
          ) : (
            <p className="text-gray-600">{profile.job_title || "No title provided"}</p>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Professional Details</h3>
            <div className="flex items-center gap-3 mb-2 text-gray-700">
              <Briefcase className="w-5 h-5 text-green-600" />
              <span className="font-medium">Job Title:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title || ""}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded text-sm"
                />
              ) : (
                <span>{profile.job_title || "Not specified"}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Specialization:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="job_specialization"
                  value={formData.job_specialization || ""}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded text-sm"
                />
              ) : (
                <span>{profile.job_specialization || "Not specified"}</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Additional Information</h3>
            {["email", "mobile", "services", "experiences", "skills", "tools"].map((field) => (
              <p key={field}>
                <strong className="capitalize">{field}:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded text-sm w-full mt-1"
                  />
                ) : (
                  profile[field] || "Not provided"
                )}
              </p>
            ))}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Education & Credentials</h3>
            {["education", "certifications", "portfolio"].map((field) => (
              <p key={field}>
                <strong className="capitalize">{field}:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded text-sm w-full mt-1"
                  />
                ) : (
                  profile[field] || "Not provided"
                )}
              </p>
            ))}
            {isEditing && (
              <div className="mt-3">
                <label className="block mb-1 text-sm font-medium">Upload Video Intro</label>
                <input
                  type="file"
                  name="video_intro"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="text-sm"
                />
              </div>
            )}
            {profile.video_intro && (
              <div className="mt-3">
                <strong>Video Intro:</strong>
                <video src={`http://localhost:8000${profile.video_intro}`} controls className="w-full mt-2 rounded" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userprofile;
