const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const FinanceSchema = new Schema({
  caseId: { type: Types.ObjectId, ref: 'Case', required: true, unique: true },
  clientId: { type: Types.ObjectId, ref: 'Client', required: true, unique: true },
  client: { type: String, ref: 'Client', required: true },
  patientName: { type: String },
  hospitalAmount: { type: Number },
  clientFee: { type: Number },
  issueDate: { type: Date },
  dueDate: { type: Date },
  remarks: { type: String },
  region: { type: String },
  status: { type: String, enum: ['approve', 'reject'], default: null },
}, { timestamps: true });

const Finance = mongoose.model('Finance', FinanceSchema);

module.exports = Finance;
