// frontend/src/components/SubscriptionPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const SubscriptionPage = () => {
  const [userData, setUserData] = useState(null);
  const [subscriptionLevel, setSubscriptionLevel] = useState("free");

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
      .then((response) => {
        setSubscriptionLevel(level);
      })
      .catch((error) => console.error("Error updating subscription:", error));
  };

  return (
    <div>
      <h2>Your Profile</h2>
      <div>
        <p>Name: {userData?.name}</p>
        <p>Role: {userData?.role}</p>
        <img src={userData?.profile_pic} alt="Profile" />
        <p>Rating: {userData?.rating}</p>
        <p>Reviews: {userData?.reviews}</p>
      </div>

      {subscriptionLevel === "free" && (
        <button onClick={() => handlePayment("basic")}>Upgrade to Basic - $10</button>
      )}

      {subscriptionLevel === "basic" && (
        <div>
          <p>About: {userData?.about}</p>
          <p>Contact Info: {userData?.contact_info}</p>
          <button onClick={() => handlePayment("premium")}>Upgrade to Premium - $20</button>
        </div>
      )}

      {subscriptionLevel === "premium" && (
        <div>
          <p>Experiences: {userData?.experiences}</p>
          <p>Education: {userData?.education}</p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
