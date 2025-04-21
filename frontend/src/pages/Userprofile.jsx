import React, { useEffect, useState } from 'react';
import {
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaStar, FaRegStar
} from 'react-icons/fa';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');

    axios.get('http://localhost:8000/api/get_profile/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setProfile(res.data); // Assuming response is a single profile object
    })
    .catch((err) => {
      console.error('Failed to fetch profile:', err);
    });
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating
        ? <FaStar key={i} className="text-yellow-500" />
        : <FaRegStar key={i} className="text-gray-300" />
      );
    }
    return stars;
  };

  if (!profile) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
        
        {/* Profile Picture */}
        <div className="w-48 h-48 rounded-full overflow-hidden shadow-md">
          <img
            src={profile.profile_picture || 'https://i.pravatar.cc/300'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">{profile.name}</h2>
          <p className="text-gray-600">{profile.role || 'Freelancer'}</p>

          <div className="flex items-center space-x-1">{renderStars(profile.rating || 4)}</div>

          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaEnvelope /> {profile.email}
            </div>
            <div className="flex items-center gap-2">
              <FaPhone /> {profile.phone || 'N/A'}
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt /> {profile.address || 'Not provided'}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 mt-2">
            <a href={profile.facebook || "#"} className="text-blue-600 hover:scale-110"><FaFacebook /></a>
            <a href={profile.twitter || "#"} className="text-blue-400 hover:scale-110"><FaTwitter /></a>
            <a href={profile.instagram || "#"} className="text-pink-500 hover:scale-110"><FaInstagram /></a>
            <a href={profile.linkedin || "#"} className="text-blue-700 hover:scale-110"><FaLinkedin /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
