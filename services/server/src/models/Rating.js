const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rating', ratingSchema);
