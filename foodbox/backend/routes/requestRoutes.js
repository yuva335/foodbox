const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const authorize = require('../middlewares/authMiddleware');

router.post('/', authorize(['organization']), async (req, res) => {
  try {
    const { foodItem, quantity, urgency, address, additionalNotes } = req.body;

    const newRequest = new Request({
      organizationName: req.user.name,
      foodItem,
      quantity,
      urgency,
      address,
      additionalNotes
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request submitted successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
});

module.exports = router;
