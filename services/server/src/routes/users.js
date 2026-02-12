const express = require('express');
const User = require('../models/User');
const axios = require('axios');

const router = express.Router();

// Create
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Read one
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ error: 'Not found' });

    // Trigger matchmaking in AI service when skills change
    try {
      await axios.post(process.env.AI_SERVICE_URL + '/recompute', { userId: user._id.toString() });
    } catch (e) {
      // Non-blocking
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
