const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const InvoiceSchema = new Schema({
  case: { type: Types.ObjectId, ref: 'Case', required: true },
  clientName: { type: String },
  patientName: { type: String },
  claimAmount: { type: Number , required: true },
  caseFee: { type: Number , required: true },
  issueDate: { type: Date },
  dueDate: { type: Date },
  status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' }
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', InvoiceSchema);
module.exports = Invoice;
