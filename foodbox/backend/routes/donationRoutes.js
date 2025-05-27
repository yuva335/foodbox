const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Donation = require('../models/Donation');
const authorize = require('../middlewares/authMiddleware');

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
            imageUrl: req.file ? req.file.filename : ''
        });

        await newDonation.save();
        res.status(201).json({ message: 'Donation submitted', donation: newDonation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ createdAt: -1 });
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

router.get('/', async (req, res) => {
    try {
        const { volunteerId } = req.query;
        let query = {};

        if (volunteerId) {
            query = { declinedBy: { $ne: new mongoose.Types.ObjectId(volunteerId) } };
            console.log("Filtering out donations declined by:", volunteerId);
        }

        const donations = await Donation.find(query).sort({ createdAt: -1 });
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/accept', authorize(['volunteer']), async (req, res) => {
  const donationId = req.params.id;
  const volunteerId = req.user.id;

  try {
    // Only accept if not already accepted by another volunteer
    const donation = await Donation.findOne({
      _id: donationId,
      acceptedBy: { $exists: false } // or acceptedBy: null depending on schema
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

// Modify GET donations route to exclude accepted donations by others
router.get('/', async (req, res) => {
  try {
    const { volunteerId } = req.query;
    let query = {};

    if (volunteerId) {
      query = {
        declinedBy: { $ne: volunteerId },
        acceptedBy: { $exists: false } // only show donations not yet accepted
      };
    }

    const donations = await Donation.find(query).sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
