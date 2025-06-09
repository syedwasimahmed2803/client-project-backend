const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const CaseSchema = new Schema({
  refNumber: { type: String, unique: true, required: true },
  patientName: { type: String, required: true },
  companyName: { type: String },
  insuranceReference: { type: String },
  insurance: { type: String },
  insuranceType: { type: String, enum: ['Provider', 'Client'], required: true },
  insuranceId: { type: Types.ObjectId, required: true, refPath: 'insuranceType' },
  hospital: { type: String, required: true },
  hospitalId: { type: Types.ObjectId, ref: 'Hospital', required: true },
  assistanceDate: { type: Date },
  serviceType: { type: String },
  remarks: { type: String },
  invoiceStatus: { type: String, enum: ['completed', 'pending'], default: 'pending' },
  mrStatus: { type: String, enum: ['completed', 'pending'], default: 'pending' },
  remarks: { type: String },
  region: { type: String },
  status: { type: String, enum: ['open', 'in review', 'closed'], default: 'open' },
}, { timestamps: true });

const Case = mongoose.model('Case', CaseSchema);

module.exports = Case;