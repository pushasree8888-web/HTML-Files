const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bio: { type: String },
    skillsOffered: { type: [String], default: [] },
    skillsToLearn: { type: [String], default: [] },
    photoUrl: { type: String },
    ratingsAverage: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    fcmToken: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
