require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const usersRouter = require('./routes/users');
const skillsRouter = require('./routes/skills');
const matchRouter = require('./routes/match');
const chatRouter = require('./routes/chat');
const feedbackRouter = require('./routes/feedback');
const sessionsRouter = require('./routes/sessions');
const adminRouter = require('./routes/admin');
const uploadsRouter = require('./routes/uploads');

const { initFirebase } = require('./utils/notifications');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Socket.IO basic chat
io.on('connection', (socket) => {
  const { userId } = socket.handshake.query;
  if (userId) {
    socket.join(`user:${userId}`);
  }
  socket.on('chat:join', (roomId) => socket.join(`room:${roomId}`));
  socket.on('chat:send', (payload) => {
    const { roomId } = payload;
    io.to(`room:${roomId}`).emit('chat:receive', payload);
  });
});

app.set('io', io);
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/users', usersRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/match', matchRouter);
app.use('/api/chat', chatRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 3001;

async function start() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/skillmate';
  await mongoose.connect(mongoUri, { dbName: process.env.MONGO_DB || 'skillmate' });
  initFirebase();
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
