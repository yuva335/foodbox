const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
  },
  foodItem: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  urgency: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  additionalNotes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
