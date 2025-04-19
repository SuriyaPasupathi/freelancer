import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaStar, FaRegStar,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaPlay
} from 'react-icons/fa';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId'); // assuming you store userId

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('userId');
      const accessToken = localStorage.getItem('accessToken')

      console.log("dsadsaffdsa",userId);
      console.log(accessToken)


      try {
        const response = await axios.get(`http://localhost:8000/api/profile/${userId}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
         
        });
        const userId = localStorage.getItem('userId');
        console.log('User ID:', userId);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProfile();
  }, [userId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < Math.round(rating) ? <FaStar key={i} className="text-yellow-400" /> : <FaRegStar key={i} className="text-gray-300" />
      );
    }
    return stars;
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gray-100 p-5 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-80 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative">
            <img src={`http://localhost:8000${profile.profile_pic}`} alt={profile.name} className="w-full h-auto" />
            <div className="absolute -bottom-4 left-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <FaStar className="text-white text-xl" />
            </div>
          </div>

          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold mt-2">{profile.name}</h2>
            <p className="text-gray-600">{profile.job_title}</p>
            <p className="text-gray-500 text-sm mb-4">{profile.job_specialization}</p>

            <div className="space-y-3 my-4">
              <div className="flex items-center">
                <FaEnvelope className="text-gray-500 mr-3" />
                <span className="text-sm">{profile.email}</span>
              </div>

              <div className="flex items-center">
                <FaPhone className="text-gray-500 mr-3" />
                <span className="text-sm">{profile.phone}</span>
              </div>

              <div className="flex items-center">
                <FaMapMarkerAlt className="text-gray-500 mr-3" />
                <span className="text-sm">{profile.location}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"><FaFacebook /></a>
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"><FaTwitter /></a>
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"><FaInstagram /></a>
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"><FaLinkedin /></a>
            </div>
          </div>

          <div className="p-5 border-b border-gray-100">
            <h3 className="text-base font-semibold mb-3">Video Introduction <span className="font-normal text-xs text-gray-500">(Optional)</span></h3>
            <div className="bg-black w-full h-40 rounded-lg relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center cursor-pointer">
                  <FaPlay className="text-white ml-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 border-b border-gray-100">
            <h3 className="text-base font-semibold mb-3">Education</h3>
            <p className="text-sm text-gray-600">{profile.education}</p>
          </div>

          <div className="p-5">
            <h3 className="text-base font-semibold mb-3">Experience</h3>
            <p className="text-sm text-gray-600">{profile.experience}</p>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-lg text-gray-600">{profile.job_title}</p>
          <p className="text-gray-500">{profile.job_specialization}</p>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">About</h3>
            <p className="text-gray-700">{profile.about}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Skills</h3>
            <ul className="list-disc list-inside text-gray-800">
              {profile.skills?.split(',').map((skill, idx) => <li key={idx}>{skill.trim()}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
