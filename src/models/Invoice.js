const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const InvoiceSchema = new Schema({
  case: { type: Types.ObjectId, ref: 'Case', required: true },
  clientName: { type: String },
  patientName: { type: String },
  hospitalAmount: { type: Number },
  clientFee: { type: Number },
  issueDate: { type: Date },
  dueDate: { type: Date },
  status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
