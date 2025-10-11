const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    category: { type: String },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
