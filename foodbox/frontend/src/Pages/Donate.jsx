import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Donate.css';

const Donate = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiry, setExpiry] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foodName || !quantity || !expiry || !address) {
      alert('Please fill all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('userName', user.name);
    formData.append('foodName', foodName);
    formData.append('quantity', quantity);
    formData.append('expiryTime', expiry);
    formData.append('pickupAddress', address);
    formData.append('notes', notes);
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await fetch('http://localhost:5000/api/donate', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Donation submitted successfully!");
        navigate('/inventory');
      } else {
        alert(data.message || "Failed to submit donation.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
    navigate('/inventory');
  };

  return (
    <div className="page-content">
      <div className="donate">
        <div className="donate-container">
          <h1>Donate Form</h1>
          <form onSubmit={handleSubmit}>
            <div className="donate-fields">
              <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)}placeholder="Food Name" required/>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity (Estimated per person)" require/>
              <input type="number" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="Expiry Time (in hours)" required/>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" required/>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional Notes (Optional)"/>
              <div className="file-upload-wrapper">
                <label className="file-upload-label"> 
                  {image ? image.name : "Choose file"}
                  <input type="file" accept=".jpg, .jpeg, .png" className="file-upload-input" onChange={(e) => setImage(e.target.files[0])}/></label>
                  <p className="file-upload-note">Upload food images in <strong>.jpg</strong>, <strong>.jpeg</strong>, or <strong>.png</strong> formats only.</p>
              </div>
            </div>
            <button type="submit">Donate Now</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donate;
