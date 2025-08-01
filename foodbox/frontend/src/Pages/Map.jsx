import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from '../utils/axiosInstance';
import "leaflet/dist/leaflet.css";
import "./CSS/Map.css"; 

const Map = () => {
  const { donationId } = useParams();
  const [donation, setDonation] = useState(null);
  const [volunteer, setVolunteer] = useState(null);
  const [positions, setPositions] = useState({});
  const [delivered, setDelivered] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/donate/map/${donationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      const { donation, volunteer } = res.data;

      setDonation(donation);
      setVolunteer(volunteer);

      setPositions({
        volunteer: volunteer?.location,
        donor: donation?.location,
      });
    } catch (err) {
      console.error("Error fetching map data:", err.response?.data || err.message);
    }
  };

  fetchData();
}, [donationId]);

  const openGoogleMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  const handleDelivery = async () => {
  try {
    await axios.delete(`http://localhost:5000/api/donate/${donationId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    setDelivered(true);
    alert("Marked as delivered and removed from inventory.");
  } catch (err) {
    console.error("Failed to mark as delivered:", err.response?.data || err.message);
    alert("Failed to mark as delivered.");
  }
};


  const center = positions.volunteer || [13.0827, 80.2707];

  return (
    <div className="map-page">
      <div className="map-section">
        <MapContainer center={center} zoom={13} scrollWheelZoom className="leaflet-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {positions.volunteer && (
            <Marker position={positions.volunteer}>
              <Popup>
                <strong>Volunteer:</strong> {volunteer?.userName}
              </Popup>
            </Marker>
          )}

          {positions.donor && (
            <Marker position={positions.donor}>
              <Popup>
                <strong>Pickup:</strong> {donation?.foodName}, {donation?.quantity}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h2>Volunteer Details</h2>
          <p><strong>Name:</strong> {volunteer?.name}</p>
          <button className="btn-green" onClick={() => openGoogleMaps(...positions.donor)}>
            Navigate to Pickup
          </button>
        </div>

        <div className="info-card">
          <h2>Pickup Info</h2>
          <p><strong>Food:</strong> {donation?.foodName}</p>
          <p><strong>Quantity:</strong> {donation?.quantity}</p>
          <p><strong>Expires in:</strong> {donation?.expiryTime} hrs</p>
          <p><strong>Address:</strong> {donation?.pickupAddress}</p>
          {donation?.notes && <p><strong>Notes:</strong> {donation?.notes}</p>}
        </div>

        <div className="info-card">
          {!delivered && (
            <button className="btn-red mt-2" onClick={handleDelivery}>
              Mark as Delivered
            </button>
          )}
          {delivered && <p className="delivered-text"> Delivered</p>}
        </div>
      </div>
    </div>
  );
};

export default Map;
