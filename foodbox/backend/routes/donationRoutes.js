const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const authorize = require('../middlewares/authMiddleware');
const User = require('../models/User');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post('/', authorize(['individual', 'grocery', 'restaurant']), upload.single('image'), async (req, res) => {
    try {
        const { foodName, quantity, expiryTime, pickupAddress, notes } = req.body;

        const newDonation = new Donation({
            userName: req.user.name,
            foodName,
            quantity,
            expiryTime,
            pickupAddress,
            notes,
            imageUrl: req.file ? req.file.filename : '',
        });

        await newDonation.save();
        res.status(201).json({ message: 'Donation submitted', donation: newDonation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { volunteerId } = req.query;
        let query = {};

        if (volunteerId && volunteerId !== 'null' && mongoose.Types.ObjectId.isValid(volunteerId)) {
            query = {
                declinedBy: { $ne: new mongoose.Types.ObjectId(volunteerId) },
                acceptedBy: null
            };
            console.log("Filtering for volunteer:", volunteerId);
        }

        const donations = await Donation.find(query).sort({ createdAt: -1 });
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/decline', authorize(['volunteer']), async (req, res) => {
    const donationId = req.params.id;
    const volunteerId = req.user.id;

    try {
        const updatedDonation = await Donation.findByIdAndUpdate(
            donationId,
            { $addToSet: { declinedBy: volunteerId } },
            { new: true }
        );
        res.status(200).json({ message: "Donation declined", updatedDonation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/accept', authorize(['volunteer']), async (req, res) => {
    const donationId = req.params.id;
    const volunteerId = req.user.id;

    try {
        const donation = await Donation.findOne({
            _id: donationId,
            acceptedBy: null
        });

        if (!donation) {
            return res.status(400).json({ message: "Donation already accepted by someone else" });
        }

        donation.acceptedBy = volunteerId;
        await donation.save();

        res.status(200).json({ message: "Donation accepted", donation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/map/:id', authorize(['volunteer']), async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('acceptedBy', 'name address contact') 
      .lean();

    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    const organization = await User.findOne({ role: 'organization' })
      .select('name address contact')
      .lean();

    res.json({
      donation,
      volunteer: donation.acceptedBy, 
      organization
    });
  } catch (err) {
    console.error('Map route error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

const PastDonation = require('../models/PastDonation');

router.delete('/:id', authorize(['volunteer']), async (req, res) => {
  const donationId = req.params.id;

  try {
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    const past = new PastDonation({
      ...donation.toObject(),
      deliveredAt: new Date()
    });
    await past.save();

    await Donation.findByIdAndDelete(donationId);

    res.status(200).json({ message: "Donation delivered and moved to history" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
