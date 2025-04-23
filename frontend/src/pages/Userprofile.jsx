import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, Star, User } from "lucide-react";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      window.location.href = "/login"; // Redirect to login if no token found
      return;
    }

    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/get_profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data); // Set profile data
        setLoading(false); // Stop loading
      } catch (err) {
        setLoading(false); // Stop loading
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
        } else {
          setError("An error occurred while fetching the profile.");
        }
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login"; // Redirect to login
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-600">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-lg text-gray-600">
        {error}
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    );
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

export default UserProfile;
