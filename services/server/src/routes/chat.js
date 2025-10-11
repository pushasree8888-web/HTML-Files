const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const { sendNotification } = require('../utils/notifications');

const router = express.Router();

router.get('/:roomId', async (req, res) => {
  const messages = await ChatMessage.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
  res.json(messages);
});

router.post('/:roomId', async (req, res) => {
  const io = req.app.get('io');
  const message = await ChatMessage.create({ roomId: req.params.roomId, ...req.body });
  io.to(`room:${req.params.roomId}`).emit('chat:receive', message);
  // push notification to recipient if FCM token exists
  try {
    const to = await User.findById(message.toUser);
    if (to?.fcmToken) {
      await sendNotification(to.fcmToken, 'New message', message.content || 'You have a new message', { roomId: req.params.roomId });
    }
  } catch (e) {
    // ignore
  }
  res.status(201).json(message);
});

module.exports = router;
