import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyShare = () => {
  const { token } = useParams();
  const [profile, setProfile] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '', reviewer_name: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/verify-share/${token}/`);
        setProfile(response.data.profile);
      } catch (err) {
        setError(err.response?.data?.error || 'Invalid or expired link');
      }
    };

    fetchProfile();
  }, [token]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/api/submit-review/${token}/`, review);
      setMessage('Review submitted successfully!');
      setReview({ rating: 5, comment: '', reviewer_name: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    }
  };

  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{profile.name}'s Profile</h2>
      <div className="mb-8">
        {profile.profile_pic && (
          <img 
            src={profile.profile_pic} 
            alt="Profile" 
            className="w-32 h-32 rounded-full mb-4"
          />
        )}
        <p className="mb-2"><strong>Job Title:</strong> {profile.job_title}</p>
        <p className="mb-2"><strong>Specialization:</strong> {profile.job_specialization}</p>
      </div>

      <form onSubmit={handleSubmitReview} className="mt-8">
        <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
        <div className="mb-4">
          <label className="block mb-2">Your Name:</label>
          <input
            type="text"
            value={review.reviewer_name}
            onChange={(e) => setReview({...review, reviewer_name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Rating:</label>
          <select
            value={review.rating}
            onChange={(e) => setReview({...review, rating: parseInt(e.target.value)})}
            className="w-full p-2 border rounded"
          >
            {[5,4,3,2,1].map(num => (
              <option key={num} value={num}>{num} Stars</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Comment:</label>
          <textarea
            value={review.comment}
            onChange={(e) => setReview({...review, comment: e.target.value})}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Review
        </button>
      </form>
      {message && <div className="mt-4 text-green-600">{message}</div>}
    </div>
  );
};

export default VerifyShare;
