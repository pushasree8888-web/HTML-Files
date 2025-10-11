const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true },
    hostUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    guestUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String },
    startAt: { type: Date },
    endAt: { type: Date },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
