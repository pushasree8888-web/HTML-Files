const express = require('express');
const Skill = require('../models/Skill');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  const skills = await Skill.find(filter);
  res.json(skills);
});

module.exports = router;
