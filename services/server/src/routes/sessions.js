const express = require('express');
const Session = require('../models/Session');
const User = require('../models/User');
const { sendNotification } = require('../utils/notifications');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const session = await Session.create(req.body);
    // Notify both parties
    const users = await User.find({ _id: { $in: [session.hostUser, session.guestUser] } });
    for (const u of users) {
      if (u.fcmToken) {
        await sendNotification(u.fcmToken, 'Session Scheduled', session.topic || 'You have a session scheduled', { roomId: session.roomId });
      }
    }
    res.status(201).json(session);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/', async (req, res) => {
  const sessions = await Session.find().sort({ createdAt: -1 });
  res.json(sessions);
});

router.put('/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(session);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
