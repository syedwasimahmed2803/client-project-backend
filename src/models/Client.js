// src/models/Client.js
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  contacts: {
    primary: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      designation: { type: String },
      phone: { type: String }
    },
    secondary: {
      name: { type: String },
      email: { type: String },
      designation: { type: String },
      phone: { type: String }
    }
  },
  region: { type: String },
  lastCaseCreatedDate: { type: Date },
  serviceType: {
    type: [Object],
    required: true
  },
  coverage: {
    type: [String],
    required: true
  },
  country: { type: String },
  address: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
