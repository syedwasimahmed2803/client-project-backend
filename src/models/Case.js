const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const CaseSchema = new Schema({
  patientName: { type: String, required: true },
  insuranceReference: { type: String, required: true, unique: true },
  caseRef: { type: String, required: true, unique: true },
  serviceType: { type: String },
  caseFee: { type: Number, required: true },
  coverage: {
    type: [String],
    required: true
  },
  address: { type: String },
  internalAmount: { type: Number },  
  currency: { type: String },
  insurance: { type: String },
  insuranceType: { type: String, enum: ['clients', 'providers'], required: true },
  insuranceId: { type: Types.ObjectId, required: true, refPath: 'insuranceType' },
  hospital: { type: String },
  hospitalId: { type: Types.ObjectId},
  remarkUser: { type: String },
  remarkUserRole: { type: String, enum: ['admin', 'employee'] },
  supervisor: { type: Boolean },
  createdById: { type: Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: String },
  approvedBy: { type: String },
  rejectedBy: { type: String },
  claimAmount: { type: Number, required: true },
  hospitalCaseFee: { type: Number},
  assistanceDate: { type: Date },
  remarks: { type: String },
  invoiceStatus: { type: String, enum: ['completed', 'pending'], default: 'pending' },
  mrStatus: { type: String, enum: ['completed', 'pending'], default: 'pending' },
  region: { type: String },
  country: { type: String },
  status: { type: String, enum: ['open', 'in-review', 'closed'], default: 'open' },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  closedAt: { type: Date, default: null },
  hospitalBankDetails: { type: [Object] },
  insurerBankDetails: { type: [Object] },
});

const Case = mongoose.model('Case', CaseSchema);

module.exports = Case;