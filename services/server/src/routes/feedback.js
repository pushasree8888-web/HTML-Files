const express = require('express');
const Rating = require('../models/Rating');
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
  const { fromUser, toUser, score, comment } = req.body;
  if (!fromUser || !toUser || !score) return res.status(400).json({ error: 'Missing fields' });
  const rating = await Rating.create({ fromUser, toUser, score, comment });
  // Update user aggregates
  const agg = await Rating.aggregate([
    { $match: { toUser: rating.toUser } },
    { $group: { _id: '$toUser', avg: { $avg: '$score' }, count: { $sum: 1 } } }
  ]);
  const { avg = 0, count = 0 } = agg[0] || {};
  await User.findByIdAndUpdate(toUser, { ratingsAverage: avg, ratingsCount: count });
  res.status(201).json(rating);
});

module.exports = router;
