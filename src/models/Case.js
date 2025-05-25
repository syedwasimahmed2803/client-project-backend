const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const CaseSchema = new Schema({
  refNumber: { type: String, unique: true, required: true },
  patientName: { type: String, required: true },
  companyName: { type: String },
  insuranceReference: { type: String },
  hospital: { type: Types.ObjectId, ref: 'Hospital', required: true },
  assistanceDate: { type: Date },
  serviceType: { type: String },
  invoiceStatus: { type: String, enum: ['received', 'pending'], default: 'pending' },
  myStatus: { type: String, enum: ['received', 'pending'], default: 'pending' },
  remarks: { type: String },
  hospitalAmount: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Case', CaseSchema);
