const express = require('express');
const User = require('../models/User');
const axios = require('axios');

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    const users = await User.find({}, {
      _id: 1,
      skillsOffered: 1,
      skillsToLearn: 1,
      ratingsAverage: 1
    });
    const snapshot = Object.fromEntries(users.map(u => [u._id.toString(), {
      skillsOffered: u.skillsOffered || [],
      skillsToLearn: u.skillsToLearn || [],
      ratingsAverage: u.ratingsAverage || 0
    }]));
    // Delegate to AI service with user snapshot for reproducible scoring
    const { data } = await axios.post(process.env.AI_SERVICE_URL + '/recommend', { userId, usersSnapshot: snapshot });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

router.get('/suggestions/:userId', async (req, res) => {
  try {
    const { data } = await axios.post(process.env.AI_SERVICE_URL + '/recommend', { userId: req.params.userId });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

module.exports = router;
