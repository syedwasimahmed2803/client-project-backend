const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const FinanceSchema = new Schema({
  case: { type: Types.ObjectId, ref: 'Case', required: true, unique: true },
  client: { type: Types.ObjectId, ref: 'Client', required: true },
  patientName: { type: String },
  hospitalAmount: { type: Number },
  clientFee: { type: Number },
  issueDate: { type: Date },
  dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Finance', FinanceSchema);
