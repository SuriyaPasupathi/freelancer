import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, Star, User } from "lucide-react";

const Userprofile = () => {
  const [profile, setProfile] = useState(null);

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

  if (!profile) {
    return <div className="text-center mt-10 text-lg text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* 👤 Name above logout */}
      <div className="flex justify-end max-w-5xl mx-auto mb-6">
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center text-gray-700 space-x-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{profile.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side */}
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
          <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
          <p className="text-gray-600">{profile.job_title || "No title provided"}</p>
        </div>

        {/* Right Side */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Professional Details</h3>

            <div className="flex items-center gap-3 mb-2 text-gray-700">
              <Briefcase className="w-5 h-5 text-green-600" />
              <span className="font-medium">Job Title:</span>
              <span>{profile.job_title || "Not specified"}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Specialization:</span>
              <span>{profile.job_specialization || "Not specified"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userprofile;
