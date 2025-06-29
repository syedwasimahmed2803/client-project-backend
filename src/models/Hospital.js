// src/models/Hospital.js
const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String },
  region: { type: String },
  country: { type: String },
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
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  relation: { type: String, enum: ['cash', 'cashless'], default: 'cash' }
}, { timestamps: true });

const Hospital = mongoose.model('Hospital', HospitalSchema);

module.exports = Hospital;
