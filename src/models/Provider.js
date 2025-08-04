// src/models/Provider.js
const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
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
  serviceType: {
    type: [Object],
    required: true
  },
  coverage: {
    type: [ String ],
    required: true
  },
  region: { type: String },
  lastCaseCreatedDate: { type: Date },
  country: { type: String },
  address: { type: String },
  bankDetails: { type: [Object] },
  status: { type: String, enum: ['inactive', 'active'], default: 'active' }
}, { timestamps: true });

const Provider = mongoose.model('Provider', ProviderSchema);

module.exports = Provider;
