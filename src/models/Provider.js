// src/models/Provider.js
const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
  name: { type: String, required: true,  unique: true},
  location: { type: String },
  region: { type: String },
  contacts: {
    primary: {
      name: { type: String },
      email: { type: String },
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
  caseFee: { type: Number },
  status: { type: String, enum: ['inactive', 'active'], default: 'active' }
}, { timestamps: true });

const Provider = mongoose.model('Provider', ProviderSchema);

module.exports = Provider;
