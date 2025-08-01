const mongoose = require('mongoose');

const pastDonationSchema = new mongoose.Schema({
  userName: String,
  foodName: String,
  quantity: String,
  expiryTime: String,
  pickupAddress: String,
  notes: String,
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deliveredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PastDonation', pastDonationSchema);
