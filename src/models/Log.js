// src/models/Log.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogSchema = new Schema({
  message: { type: String, required: true },
  ip: { type: String },
  data: { type: Object }, // optional payload (e.g., headers, user, etc.)
}, { timestamps: true });

module.exports = mongoose.model('Log', LogSchema);
