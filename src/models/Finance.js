const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const FinanceSchema = new Schema({
  caseId: { type: Types.ObjectId, required: true },
  insuranceReference: { type: String, required: true, unique: true },
  insurance: { type: String },
  insuranceType: { type: String, enum: ['clients', 'providers'] },
  patientName: { type: String },
  claimAmount: { type: Number, required: true },
  caseFee: { type: Number, required: true },
  issueDate: { type: Date },
  dueDate: { type: Date },
  remarks: { type: String },
  remarkUser: { type: String },
  remarkUserRole: { type: String, enum: ['admin', 'employee'] },
  supervisor: { type: Boolean },
  region: { type: String },
  assistanceDate: { type: Date },
  country: { type: String },
  status: { type: String, enum: ['approve', 'reject', 'pending'], default: null },
  createdById: { type: Types.ObjectId, ref: 'User', required: true },
  caseRef: { type: String, required: true, unique: true },
  serviceType: { type: String },
  caseFee: { type: Number, required: true },
  coverage: {
    type: [String],
    required: true
  },
  address: { type: String },
  hospital: { type: String, required: true },
  hospitalId: { type: Types.ObjectId, required: true },
  financeCreatedAt: { type: Date },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  createdBy: { type: String },
});

const Finance = mongoose.model('Finance', FinanceSchema);

module.exports = Finance;
