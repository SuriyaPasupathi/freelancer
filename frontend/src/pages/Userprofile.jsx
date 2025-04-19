import React, { useEffect, useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaStar, FaRegStar } from 'react-icons/fa';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    axios.get('http://localhost:8000/api/get-profile/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setProfile(res.data[0]); // Assuming it's a list
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < rating ? <FaStar key={i} className="text-yellow-400" /> : <FaRegStar key={i} className="text-gray-300" />
      );
    }
    return stars;
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="bg-gray-100 p-5 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <div className="w-full md:w-80 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative">
            <img src="https://i.pravatar.cc/300" alt={profile.name} className="w-full h-auto" />
            <div className="absolute -bottom-4 left-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <FaStar className="text-white text-xl" />
            </div>
          </div>
          
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold mt-2">{profile.name}</h2>
            <p className="text-gray-600">{profile.job_title}</p>
            <p className="text-gray-500 text-sm mb-4">{profile.job_description}</p>
            
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
              <a href={profile.facebook} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <FaFacebook />
              </a>
              <a href={profile.twitter} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <FaTwitter />
              </a>
              <a href={profile.instagram} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <FaInstagram />
              </a>
              <a href={profile.linkedin} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <FaLinkedin />
              </a>
            </div>
          </div>
          
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-base font-semibold mb-3">Education</h3>
            <div className="mb-3">
              <h4 className="font-semibold text-sm">{profile.education_institution}</h4>
              <p className="text-sm text-gray-600">{profile.education_degree}</p>
              <p className="text-sm text-gray-600">{profile.education_year}</p>
            </div>
          </div>
          
          <div className="p-5">
            <h3 className="text-base font-semibold mb-3">Licenses / Certifications</h3>
            <div>
              <h4 className="font-semibold text-sm">{profile.certification_name}</h4>
              <p className="text-sm text-gray-600">{profile.certification_year}</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-lg text-gray-600">{profile.job_title}</p>
              <p className="text-gray-500">{profile.job_description}</p>
            </div>
            
            <div className="flex gap-10">
              <div className="text-center">
                <h2 className="text-4xl font-bold">4.5</h2>
                <p className="text-gray-600 text-sm">Impressive</p>
                <div className="flex justify-center my-1">
                  {renderStars(4.5)}
                </div>
                <p className="text-xs text-gray-500">50 reviews</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-y border-gray-200 py-4 mb-5">
            <h3 className="font-bold">Client Reviews</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
