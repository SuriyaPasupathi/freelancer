import React, { useEffect, useState } from "react";
import axios from "axios";

const Userprofile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
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

  if (!profile) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 text-center">
        {/* Profile Picture */}
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-green-500 mb-4">
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

        <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
        <p className="text-md text-gray-600 mt-2">
          <span className="font-semibold">Job Title:</span>{" "}
          {profile.job_title || "Not specified"}
        </p>
        <p className="text-md text-gray-600 mt-1">
          <span className="font-semibold">Specialization:</span>{" "}
          {profile.job_specialization || "Not specified"}
        </p>
      </div>
    </div>
  );
};

export default Userprofile;
