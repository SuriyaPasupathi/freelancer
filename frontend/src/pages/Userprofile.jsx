import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, Pencil, X, LogOut, User, Briefcase, Star, MessageSquare } from "lucide-react";
import { useNavigate } from 'react-router-dom';

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
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [videoIntro, setVideoIntro] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3; // Set to show 3 reviews per page

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    // Fetch profile data
    axios
      .get("http://localhost:8000/api/get_profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile(res.data);
        setFormData(res.data);
        
        // Once profile is loaded, fetch reviews for this profile
        return axios.get(`http://localhost:8000/api/get_reviews/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((reviewsRes) => {
        setReviews(reviewsRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
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
    const refreshToken = localStorage.getItem("refresh_token");
    const accessToken = localStorage.getItem("access_token");

    try {
      await axios.post(
        "http://localhost:8000/api/logout/",
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  const handleShareProfile = () => {
    navigate('/share-profile');
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i}
          className={`w-4 h-4 ${i <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header with name and logout */}
      <div className="flex justify-between items-center max-w-5xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Profile Dashboard</h1>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center text-gray-700 space-x-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{profile.name}</span>
          </div>
          <div className="flex space-x-3">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
              >
                <Pencil className="w-4 h-4 mr-2" /> Edit Profile
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto">
        {isEditing ? (
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input label="Name" name="name" value={formData.name || ""} onChange={handleChange} />
                <Input label="Job Title" name="job_title" value={formData.job_title || ""} onChange={handleChange} />
                <Input label="Job Specialization" name="job_specialization" value={formData.job_specialization || ""} onChange={handleChange} />
                <Input label="Email" name="email" value={formData.email || ""} onChange={handleChange} />
                <Input label="Mobile" name="mobile" value={formData.mobile || ""} onChange={handleChange} />
                <TextArea label="Services" name="services" value={formData.services || ""} onChange={handleChange} />
              </div>
              <div>
                <TextArea label="Experiences" name="experiences" value={formData.experiences || ""} onChange={handleChange} />
                <TextArea label="Skills" name="skills" value={formData.skills || ""} onChange={handleChange} />
                <TextArea label="Tools" name="tools" value={formData.tools || ""} onChange={handleChange} />
                <TextArea label="Education" name="education" value={formData.education || ""} onChange={handleChange} />
                <TextArea label="Certifications" name="certifications" value={formData.certifications || ""} onChange={handleChange} />
                <TextArea label="Portfolio" name="portfolio" value={formData.portfolio || ""} onChange={handleChange} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <FileInput label="Profile Picture" name="profile_pic" onChange={handleFileChange} />
              <FileInput label="Video Introduction" name="video_intro" onChange={handleFileChange} />
            </div>

            <div className="flex gap-4 mt-6">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

              {/* Additional Information */}
              {(profile.email || profile.services) && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Additional Information</h3>
                  <p><strong>Email:</strong> {profile.email || "Not provided"}</p>
                  <p><strong>Mobile:</strong> {profile.mobile || "Not provided"}</p>
                  <p><strong>Services:</strong> {profile.services || "Not provided"}</p>
                  <p><strong>Experiences:</strong> {profile.experiences || "Not provided"}</p>
                  <p><strong>Skills:</strong> {profile.skills || "Not provided"}</p>
                  <p><strong>Tools:</strong> {profile.tools || "Not provided"}</p>
                </div>
              )}

              {/* Education & Credentials */}
              {(profile.education || profile.certifications || profile.portfolio) && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Education & Credentials</h3>
                  <p><strong>Education:</strong> {profile.education || "Not provided"}</p>
                  <p><strong>Certifications:</strong> {profile.certifications || "Not provided"}</p>
                  <p><strong>Portfolio:</strong> {profile.portfolio || "Not provided"}</p>
                  
                  {profile.video_intro && (
                    <div className="mt-3">
                      <strong>Video Intro:</strong>
                      <video 
                        src={`http://localhost:8000${profile.video_intro}`} 
                        controls 
                        className="w-full mt-2 rounded" 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            <h3 className="text-2xl font-bold text-gray-800">Reviews</h3>
          </div>
          
          <button
            onClick={handleShareProfile}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
          >
            <Star className="w-5 h-5" />
            Share Profile for Reviews
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-500">No reviews yet. Share your profile to receive reviews.</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {reviews
                .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                .map((review, index) => (
                  <div key={index} className="border rounded-lg p-6 bg-gray-50">
                    <h4 className="text-xl font-bold mb-3">Review from {review.reviewer_name}</h4>
                    
                    <div className="mb-3">
                      <p className="text-gray-700 font-medium mb-1">Reviewer:</p>
                      <p className="text-gray-800 border p-2 rounded bg-white">{review.reviewer_name}</p>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-gray-700 font-medium mb-1">Rating:</p>
                      <div className="flex items-center border p-2 rounded bg-white">
                        {renderStars(review.rating)}
                        <span className="ml-2">{review.rating} Stars</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-700 font-medium mb-1">Comment:</p>
                      <div className="border p-2 rounded bg-white min-h-24">
                        {review.comment}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-3">
                      Submitted on {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
              ))}
            </div>

            {/* Pagination - Only show if there are more than 3 reviews */}
            {reviews.length > itemsPerPage && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {currentPage < 3 ? (
                    // Show first 3 pages when on pages 1-3
                    [...Array(Math.min(3, Math.ceil(reviews.length / itemsPerPage)))].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx)}
                        className={`w-8 h-8 rounded-full ${
                          currentPage === idx 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))
                  ) : (
                    // Show previous 2 pages and current page when on page 4 or above
                    [-2, -1, 0].map((offset) => (
                      <button
                        key={offset}
                        onClick={() => setCurrentPage(currentPage + offset)}
                        className={`w-8 h-8 rounded-full ${
                          offset === 0
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {currentPage + offset + 1}
                      </button>
                    ))
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => 
                    Math.min(Math.ceil(reviews.length / itemsPerPage) - 1, prev + 1)
                  )}
                  disabled={currentPage >= Math.ceil(reviews.length / itemsPerPage) - 1}
                  className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
