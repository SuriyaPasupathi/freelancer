import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function SubscriptionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const plans = [
    {
      name: "Basic",
      price: "Free",
      type: "free",
      popular: false,
      features: [
        "Profile Name and Image",
        "Review Ratings",
        "Job Title and Job Specialization",
        "Client's Previous Reviews",
        "Copy URL Link"
      ]
    },
    {
      name: "Premium",
      price: "20",
      type: "premium",
      popular: true,
      features: [
        "Profile Name and Image",
        "Review Ratings",
        "Job Title and Job Specialization",
        "Client's Previous Reviews",
        "Copy URL Link",
        "Email, Mobile and Social Media Link",
        "Displays Services, Experiences, Skills and Tools",
        "Displays Education and Certifications",
        "Video Introduction",
        "Exhibit Portfolio / Previous Works"
      ]
    },
    {
      name: "Standard",
      price: "10",
      type: "standard",
      popular: false,
      features: [
        "Profile Name and Image",
        "Review Ratings",
        "Job Title and Job Specialization",
        "Client's Previous Reviews",
        "Copy URL Link",
        "Email, Mobile and Social Media Link",
        "Displays Services, Experiences, Skills and Tools"
      ]
    }
  ];

  const handleSubscription = async (plan) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate("/login", { 
          state: { from: '/subscriptions', plan: plan.type } 
        });
        return;
      }

      if (plan.type === 'free') {
        // Handle free subscription
        const response = await axios.post(
          'http://localhost:8000/api/update-subscription/',
          { subscription_type: plan.type },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.has_profile) {
          navigate("/profile");
        } else {
          navigate("/CreateAccount", { 
            state: { subscription_type: plan.type } 
          });
        }
      } else {
        // Handle paid subscription
        const response = await axios.post(
          'http://localhost:8000/api/create-payment-intent/',
          { subscription_type: plan.type },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const stripe = await loadStripe(response.data.publicKey);
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId
        });

        if (error) {
          setError(error.message);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10 px-5">
      {error && (
        <div className="fixed top-5 right-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-screen-lg">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`bg-white shadow-lg rounded-lg overflow-hidden ${
              plan.popular ? 'border-4 border-blue-600' : ''
            }`}
          >
            {plan.popular && (
              <div className="bg-blue-600 text-white text-center py-2 font-semibold text-xl">
                Best Choice
              </div>
            )}
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
              <div className="mt-3 flex items-center text-3xl font-bold text-gray-800">
                <span className="text-xl text-gray-500">USD</span>
                <span>{plan.price}</span>
                {plan.price !== "Free" && (
                  <span className="text-sm text-gray-500 ml-2">/annually</span>
                )}
              </div>
              <div className="mt-6">
                <p className="font-medium text-gray-700">Includes:</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckIcon />
                      <span className="ml-2">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-100 text-center">
              <button
                className={`w-full py-3 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-semibold text-lg rounded-md transition duration-300`}
                onClick={() => handleSubscription(plan)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Sign Up Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionPage;
