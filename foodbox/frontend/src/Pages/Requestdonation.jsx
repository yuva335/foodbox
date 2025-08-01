import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Donate.css';
import axios from '../utils/axiosInstance';

const Requestdonation = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [foodItem, setFoodItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foodItem || !quantity || !urgency || !address) {
      alert('Please fill all required fields.');
      return;
    }

    const requestData = {
      organizationName: user.name,
      foodItem,
      quantity,
      urgency: urgency,
      address: address,
      additionalNotes: notes
    };

try {
  const res = await axios.post('http://localhost:5000/api/request', requestData);


      const data = res.data;
      if (res.ok) {
        alert("Request submitted successfully!");
        navigate('/inventory');
      } else {
        alert(data.message || "Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="page-content">
      <div className="donate">
        <div className="donate-container">
          <h1>Request Donation</h1>
          <form onSubmit={handleSubmit}>
            <div className="donate-fields">
              <input type="text" value={foodItem} onChange={(e) => setFoodItem(e.target.value)} placeholder="Requested Food Item" required />
              <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity Needed" required />
              <input type="number" value={urgency} onChange={(e) => setUrgency(e.target.value)} placeholder="Urgency (in hours)" required />
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery Address" required />
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional Notes (Optional)" />
            </div>
            <button type="submit">Submit Request</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Requestdonation;



