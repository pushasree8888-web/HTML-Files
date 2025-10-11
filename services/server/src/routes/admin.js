const express = require('express');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Rating = require('../models/Rating');
const Session = require('../models/Session');

const router = express.Router();

router.get('/stats', async (req, res) => {
  const [users, skills, ratings, sessions] = await Promise.all([
    User.countDocuments(),
    Skill.countDocuments(),
    Rating.countDocuments(),
    Session.countDocuments()
  ]);
  const topSkills = await User.aggregate([
    { $unwind: { path: '$skillsOffered', preserveNullAndEmptyArrays: false } },
    { $group: { _id: '$skillsOffered', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  res.json({ users, skills, ratings, sessions, topSkills });
});

module.exports = router;
