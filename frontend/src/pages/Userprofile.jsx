import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaStar, FaRegStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPlay } from 'react-icons/fa';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const ProfilePage = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < rating ? <FaStar key={i} className="text-yellow-400" /> : <FaRegStar key={i} className="text-gray-300" />
      );
    }
    return stars;
  };

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="bg-gray-100 p-5 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <div className="w-full md:w-80 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative">
            <img src="https://i.pravatar.cc/300" alt="John D." className="w-full h-auto" />
            <div className="absolute -bottom-4 left-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <FaStar className="text-white text-xl" />
            </div>
          </div>
          
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold mt-2">John D.</h2>
            <p className="text-gray-600">UX / UI Designer</p>
            <p className="text-gray-500 text-sm mb-4">Front End Developer / No Code Builder</p>
            
            <div className="space-y-3 my-4">
              <div className="flex items-center">
                <FaEnvelope className="text-gray-500 mr-3" />
                <span className="text-sm">john_d@gmail.com</span>
              </div>
              
              <div className="flex items-center">
                <FaPhone className="text-gray-500 mr-3" />
                <span className="text-sm">+83 255 9748</span>
              </div>
              
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-gray-500 mr-3" />
                <span className="text-sm">New York, New York</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <FaLinkedin />
              </a>
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
            <div className="mb-3">
              <h4 className="font-semibold text-sm">Harvard University</h4>
              <p className="text-sm text-gray-600">CS50 (Computer Science)</p>
              <p className="text-sm text-gray-600">2024-2024</p>
            </div>
          </div>
          
          <div className="p-5">
            <h3 className="text-base font-semibold mb-3">Licenses / Certifications</h3>
            <div>
              <h4 className="font-semibold text-sm">Google UX / UI Certificate</h4>
              <p className="text-sm text-gray-600">2024-2024</p>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold">John D.</h1>
              <p className="text-lg text-gray-600">UX / UI Designer</p>
              <p className="text-gray-500">Front End Developer / No Code Builder</p>
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
              
              <div className="w-40">
                <div className="flex items-center mb-1.5">
                  <span className="w-10 text-xs text-gray-500">5-star</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div className="flex items-center mb-1.5">
                  <span className="w-10 text-xs text-gray-500">4-star</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div className="flex items-center mb-1.5">
                  <span className="w-10 text-xs text-gray-500">3-star</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
                <div className="flex items-center mb-1.5">
                  <span className="w-10 text-xs text-gray-500">2-star</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div className="flex items-center mb-1.5">
                  <span className="w-10 text-xs text-gray-500">1-star</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center border-y border-gray-200 py-4 mb-5">
            <h3 className="font-bold">Client Reviews</h3>
            <div className="flex gap-4">
              <button onClick={prevReview} className="text-blue-600 hover:text-blue-800">
                <IoChevronBack className="text-lg" />
              </button>
              <button onClick={nextReview} className="text-blue-600 hover:text-blue-800">
                <IoChevronForward className="text-lg" />
              </button>
            </div>
          </div>

          {/* Review */}
          <div className="border-t border-gray-200 pt-5">
            <div className="text-center mb-4">
              <p className="font-semibold">{reviews[currentReviewIndex].author}</p>
              <p className="text-gray-500">{reviews[currentReviewIndex].position}</p>
              <div className="flex justify-center my-2">{renderStars(reviews[currentReviewIndex].rating)}</div>
            </div>
            <p className="text-gray-700">{reviews[currentReviewIndex].text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
