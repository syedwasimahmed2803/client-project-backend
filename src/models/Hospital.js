const mongoose = require('mongoose');
const { Schema } = mongoose;

const HospitalSchema = new Schema({
  name: { type: String, required: true },
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
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', HospitalSchema);
