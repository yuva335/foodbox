import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CSS/Inventory.css";

const Inventory = () => {
    const [donations, setDonations] = useState([]);
    const [requests, setRequests] = useState([]);

    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(""); 
    

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        console.log("Fetched Role from localStorage:", role);

        if (role) {
            setUserRole(role);
        }

        if (token) {
  if (role === "volunteer") {
    const volunteerId = localStorage.getItem("userId");
    axios.get(`http://localhost:5000/api/donate?volunteerId=${volunteerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      setDonations(response.data);
    })
    .catch((error) => {
      console.error("Error fetching donations:", error);
    });
  } else {
    axios.get("http://localhost:5000/api/donate", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      setDonations(response.data);
    })
    .catch((error) => {
      console.error("Error fetching donations:", error);
    });
  }
}

if (role === "individual" || role === "restaurant" || role === "grocery") {
  axios.get("http://localhost:5000/api/request", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then((response) => {
    setRequests(response.data);
  })
  .catch((error) => {
    console.error("Error fetching requests:", error);
  });
}

    }, []);

    const handleAccept = (donationId) => {
      const token = localStorage.getItem("token");
        axios.post(`http://localhost:5000/api/donate/${donationId}/accept`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log("Accepted donation:", response.data);
      navigate(`/map/${donationId}`);
    })
    .catch(error => {
      console.error("Error accepting donation:", error);
      alert(error.response?.data?.message || "Failed to accept donation.");
    });
    };

  const handleDecline = (donationId) => {
  const token = localStorage.getItem("token");

  axios.post(
    `http://localhost:5000/api/donate/${donationId}/decline`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  .then(() => {
    setDonations(prev => prev.filter(d => d._id !== donationId));
    console.log("Declined donation:", donationId);
  })
  .catch(error => {
    console.error("Error declining donation:", error);
  });
};


    return (
        <div className="inventory-container">
            <h1 className="inventory-title">Inventory</h1>
            {(userRole === "individual" || userRole === "restaurant" || userRole === "grocery") && (
                <div className="button-group">
                    <button className="btn-donate" onClick={() => navigate('/donate')}>Donate Food</button>
                </div>
            )}

            {userRole === "organization" && (
                <div className="button-group">
                    <button className="btn-request" onClick={() => navigate('/requestdonation')}>Request Donation</button>
                </div>
            )}

            {(userRole === "individual" || userRole === "restaurant" || userRole === "grocery") ? (
  <div className="dual-list">
    <div className="donation-list">
      <h2>Donations</h2>
      {donations.length > 0 ? (
        donations.map(donation => (
          <div key={donation._id} className="donation-card">
            <h3>{donation.foodName}</h3>
            <p><strong>Quantity:</strong> {donation.quantity}</p>
            <p><strong>Expiry Time:</strong> {donation.expiryTime} hours</p>
            <p><strong>Pickup Address:</strong> {donation.pickupAddress}</p>
            <p><strong>Notes:</strong> {donation.notes}</p>
          </div>
        ))
      ) : (
        <p className="no-donations">No donations available.</p>
      )}
    </div>

    <div className="request-list">
      <h2>Requests</h2>
      {requests.length > 0 ? (
        requests.map(request => (
          <div key={request._id} className="donation-card">
            <h3>{request.organizationName}</h3>
            <p><strong>Food Item:</strong> {request.foodItem}</p>
            <p><strong>Quantity:</strong> {request.quantity}</p>
            <p><strong>Urgency:</strong> {request.urgency} hours</p>
            <p><strong>Address:</strong> {request.address}</p>
            <p><strong>Notes:</strong> {request.additionalNotes}</p>
            <button className="btn-accept">Donate</button>
          </div>
        ))
      ) : (
        <p className="no-donations">No requests found.</p>
      )}
    </div>
  </div>
) : (
  <div className="donation-list">
    {donations.length > 0 ? (
      donations.map(donation => (
        <div key={donation._id} className="donation-card">
          <h3>{donation.foodName}</h3>
          <p><strong>Quantity:</strong> {donation.quantity}</p>
          <p><strong>Expiry Time:</strong> {donation.expiryTime} hours</p>
          <p><strong>Pickup Address:</strong> {donation.pickupAddress}</p>
          <p><strong>Notes:</strong> {donation.notes}</p>

          {userRole === "volunteer" && (
            <div className="button-group">
              <button className="btn-accept" onClick={() => handleAccept(donation._id)}>Accept</button>
              <button className="btn-decline" onClick={() => handleDecline(donation._id)}>Decline</button>
            </div>
          )}
        </div>
      ))
    ) : (
      <p className="no-donations">No donations available at the moment.</p>
    )}
  </div>
)}

        </div>
    );
};

export default Inventory;
