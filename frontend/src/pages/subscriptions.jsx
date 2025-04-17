import React from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 for navigation
import './common.css';

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function SubscriptionPage() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Basic",
      price: "Free",
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

  const handleSignup = (plan) => {
    navigate("/Userprofile", { state: { selectedFeatures: plan.features, planName: plan.name } });
  };

  return (
    <div className="pricing-container">
      {plans.map((plan, index) => (
        <div 
          key={index}
          className={`pricing-card ${plan.popular ? 'popular' : ''}`}
        >
          {plan.popular && <div className="best-choice">Best Choice</div>}
          <div className="card-content">
            <h3 className="plan-name">{plan.name}</h3>
            <div className="price-container">
              <div className="price">
                <span className="currency">USD</span>
                <span className="amount">{plan.price}</span>
                {plan.price !== "Free" && <span className="period">/annually</span>}
              </div>
            </div>
            <div className="features-container">
              <p className="includes">Includes:</p>
              <ul className="feature-list">
                {plan.features.map((feature, i) => (
                  <li key={i} className="feature-item">
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="button-container">
            <button className="signup-button" onClick={() => handleSignup(plan)}>
              Sign Up Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubscriptionPage;
