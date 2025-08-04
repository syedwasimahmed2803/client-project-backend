const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const InvoiceSchema = new Schema({
  caseId: { type: Types.ObjectId, required: true },
  financeId: { type: Types.ObjectId, required: true },
  insuranceReference: { type: String, required: true, unique: true },
  insurance: { type: String },
  insuranceType: { type: String, enum: ['clients', 'providers'] },
  patientName: { type: String },
  claimAmount: { type: Number, required: true },
  caseFee: { type: Number, required: true },
  remarks: { type: String },
  remarkUser: { type: String },
  remarkUserRole: { type: String, enum: ['admin', 'employee'] },
  supervisor: { type: Boolean },
  issueDate: { type: Date },
  assistanceDate: { type: Date },
  region: { type: String },
  country: { type: String },
  dueDate: { type: Date },
  paidDate: { type: Date },
  caseRef: { type: String, required: true, unique: true },
  invoiceNo: { type: String},
  hospitalBankDetails: { type: [Object] },
  insurerBankDetails: { type: [Object] },
  serviceType: { type: String },
  caseFee: { type: Number, required: true },
  coverage: {
    type: [String],
    required: true
  },
  address: { type: String },
  hospital: { type: String, required: true },
  hospitalId: { type: Types.ObjectId, required: true },
  invoiceCreatedAt: { type: Date },
  status: { type: String, enum: ['paid', 'pending', 'unpaid'], default: 'pending' },
  createdById: { type: Types.ObjectId, ref: 'User', required: true },
  updatedByUser: { type: String },
  createdBy: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);
module.exports = Invoice;
