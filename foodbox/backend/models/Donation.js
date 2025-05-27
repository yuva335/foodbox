const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    foodName: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    expiryTime: {
        type: String,
        required: true
    },
    pickupAddress: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    declinedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
});

module.exports = mongoose.model('Donation', donationSchema);
