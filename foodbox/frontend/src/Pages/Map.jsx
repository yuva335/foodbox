import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const Map = () => {
  const { donationId } = useParams();
  const [donation, setDonation] = useState(null);
  const [volunteer, setVolunteer] = useState(null);
  const [org, setOrg] = useState(null);
  const [positions, setPositions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/donate/map/${donationId}`
        );
        const { donation, volunteer, organization } = res.data;
        setDonation(donation);
        setVolunteer(volunteer);
        setOrg(organization);

        setPositions({
          volunteer: volunteer?.location,
          donor: donation?.location,
          organization: organization?.location,
        });
      } catch (err) {
        console.error("Error fetching map data:", err);
      }
    };
    fetchData();
  }, [donationId]);

  const openGoogleMaps = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  const center = positions.volunteer || [13.0827, 80.2707]; // Default to Chennai

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-2/3 h-[500px]">
        <MapContainer center={center} zoom={13} style={{ height: "100%" }}>
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

          {positions.organization && (
            <Marker position={positions.organization}>
              <Popup>
                <strong>Drop-off:</strong> {org?.name} <br /> {org?.address}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="w-full md:w-1/3 space-y-4">
        <div className="p-4 rounded-xl shadow bg-white">
          <h2 className="font-bold text-xl mb-2">Volunteer Details</h2>
          <p><strong>Name:</strong> {volunteer?.userName}</p>
          {/* <p><strong>Phone:</strong> {volunteer?.phone}</p> */}
          {/* <p><strong>Vehicle:</strong> {volunteer?.vehicle}</p> */}
          <button
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
            onClick={() => openGoogleMaps(...positions.donor)}
          >
            Navigate to Pickup
          </button>
        </div>

        <div className="p-4 rounded-xl shadow bg-white">
          <h2 className="font-bold text-xl mb-2">Pickup Info</h2>
          <p><strong>Food:</strong> {donation?.foodName}</p>
          <p><strong>Quantity:</strong> {donation?.quantity}</p>
          <p><strong>Expires in:</strong> {donation?.expiryTime} hrs</p>
          <p><strong>Pickup Address:</strong> {donation?.pickupAddress}</p>
          {donation?.notes && <p><strong>Notes:</strong> {donation?.notes}</p>}
          {donation?.imageUrl && (
            <img
              src={`http://localhost:5000/uploads/${donation.imageUrl}`}
              alt="Food"
              className="mt-2 rounded w-full h-auto"
            />
          )}
        </div>

        <div className="p-4 rounded-xl shadow bg-white">
          <h2 className="font-bold text-xl mb-2">Drop-off Info</h2>
          <p><strong>Organization:</strong> {org?.name}</p>
          <p><strong>Address:</strong> {org?.address}</p>
          <p><strong>Contact:</strong> {org?.contact}</p>
          {/* <p><strong>Time Window:</strong> {org?.timeWindow}</p> */}
          <button
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => openGoogleMaps(...positions.organization)}
          >
            Navigate to Drop-off
          </button>
        </div>
      </div>
    </div>
  );
};

export default Map;
