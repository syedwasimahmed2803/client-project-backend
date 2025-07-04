const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const FinanceSchema = new Schema({
  case: { type: String, required: true, unique: true },
  insurance: { type: String },
  patientName: { type: String },
  claimAmount: { type: Number, required: true },
  caseFee: { type: Number, required: true },
  issueDate: { type: Date },
  dueDate: { type: Date },
  remarks: { type: String },
  region: { type: String },
  country: { type: String },
  status: { type: String, enum: ['approve', 'reject'], default: null },
  createdById: { type: Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: String },
}, { timestamps: true });

const Finance = mongoose.model('Finance', FinanceSchema);

module.exports = Finance;
