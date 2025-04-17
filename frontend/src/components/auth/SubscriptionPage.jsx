import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SubscriptionPage = () => {
  const [userData, setUserData] = useState(null);
  const [subscriptionLevel, setSubscriptionLevel] = useState("free");
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user-details/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
        setSubscriptionLevel(response.data.subscription_level);
      })
      .catch((error) => console.error("Error fetching user details:", error));
  }, [token]);

  const handlePayment = (level) => {
    axios
      .put(
        "http://localhost:8000/api/update-subscription/",
        { level },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setSubscriptionLevel(level);
        alert(`Subscription updated to ${level}`);
      })
      .catch((error) => console.error("Error updating subscription:", error));
  };

  const handleSubmit = () => {
    navigate("/myprofile", { state: { userData, subscriptionLevel } });
  };

  const accessData = [
    {
      field: "Name, Role, Rating, Reviews, Image",
      plan: "Free",
    },
    {
      field: "About, Contact Info, Skills, Experience, Tools",
      plan: "Basic+",
    },
    {
      field: "Education, Certifications, Video Intro, Resume",
      plan: "Premium Only",
    },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Profile</h2>

      {/* Access Table */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-center">Profile Access by Plan</h3>
        <div className="overflow-x-auto shadow border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Field</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Shown On Plan</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accessData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{item.field}</td>
                  <td className="px-6 py-4 text-sm font-medium text-indigo-600">{item.plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile */}
      {userData ? (
        <div className="space-y-4 bg-white p-6 rounded shadow">
          <div className="flex items-center gap-4">
            <img src={userData.profile_pic} alt="Profile" className="w-20 h-20 rounded-full border" />
            <div>
              <p className="text-xl font-semibold">{userData.name}</p>
              <p className="text-gray-600">{userData.role}</p>
              <p>Rating: ⭐ {userData.rating}</p>
              <p>Reviews: {userData.reviews}</p>
            </div>
          </div>

          {subscriptionLevel === "free" && (
            <div>
              <p className="text-gray-500 italic">You're on Free Plan</p>
              <button
                onClick={() => handlePayment("basic")}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Upgrade to Basic - $10
              </button>
            </div>
          )}

          {(subscriptionLevel === "basic" || subscriptionLevel === "standard" || subscriptionLevel === "premium") && (
            <>
              <h3 className="text-lg font-semibold">About</h3>
              <p>{userData.about}</p>

              <h3 className="text-lg font-semibold">Contact Info</h3>
              <p>{userData.contact_info}</p>

              <h3 className="text-lg font-semibold">Skills</h3>
              <p>{userData.skills}</p>

              <h3 className="text-lg font-semibold">Experience</h3>
              <p>{userData.experiences}</p>

              <h3 className="text-lg font-semibold">Tools</h3>
              <p>{userData.tools}</p>

              {subscriptionLevel === "basic" && (
                <button
                  onClick={() => handlePayment("premium")}
                  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Upgrade to Premium - $20
                </button>
              )}
            </>
          )}

          {subscriptionLevel === "premium" && (
            <>
              <h3 className="text-lg font-semibold">Education</h3>
              <p>{userData.education}</p>

              <h3 className="text-lg font-semibold">Certifications</h3>
              <p>{userData.certifications}</p>

              <h3 className="text-lg font-semibold">Video Introduction</h3>
              {userData.video_intro ? (
                <video controls width="100%">
                  <source src={userData.video_intro} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>No video uploaded.</p>
              )}

              <h3 className="text-lg font-semibold">Portfolio</h3>
              <p>{userData.portfolio}</p>

              <h3 className="text-lg font-semibold">Resume</h3>
              {userData.resume ? (
                <a
                  href={userData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Download Resume
                </a>
              ) : (
                <p>No resume uploaded.</p>
              )}
            </>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Submit & Go to My Profile
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading profile...</p>
      )}
    </div>
  );
};

export default SubscriptionPage;
