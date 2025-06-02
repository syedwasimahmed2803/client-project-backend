// src/models/Client.js
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contacts: {
    primary: {
      name:        { type: String, required: true, unique: true },
      email:       { type: String, required: true },
      designation: { type: String },
      phone:       { type: String }
    },
    secondary: {
      name:        { type: String },
      email:       { type: String },
      designation: { type: String },
      phone:       { type: String }
    }
  },
  region:  { type: String },
  caseFee: { type: Number },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
