const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const CaseSchema = new Schema({
  refNumber: { type: String, unique: true, required: true },
  patientName: { type: String, required: true },
  companyName: { type: String },
  insuranceReference: { type: String },
  insuranceName: { type: String },
  insuranceId: {type: Types.ObjectId, required: true },
  insuranceType: { type: String, enum: ['provider', 'client'], required: true },
  hospital: { type: String, ref: 'Hospital', required: true },
  hospitalId: { type: Types.ObjectId, ref: 'Hospital', required: true },
  assistanceDate: { type: Date },
  serviceType: { type: String },
  invoiceStatus: { type: String, enum: ['completed', 'pending'], default: 'pending' },
  mrStatus: { type: String, enum: ['completed', 'pending'], default: 'pending' },
  remarks: { type: String },
  hospitalAmount: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Case', CaseSchema);
