// src/models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  amountUSD: { type: Number, required: true }, // 1 -> in dollars
  internalAmount: { type: Number },            // 1 -> internal converted amount (optional)
  type: { type: String, enum: ['income', 'expense'], required: true }, // 2 -> income/expense
  category: { type: String, required: true },  // 3 -> category
  remarks: { type: String },                   // 4 -> remarks
  dateCreated: { type: Date, default: Date.now }, // 5 -> date created
  createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 6 -> created by
  createdBy: { type: String, required: true }, // 6 -> created by name
  createdByRole: { type: String, enum: ['admin', 'employee']}, // 6 -> created by role
  companyName: { type: String },
  currency: { type: String },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'others'],
    required: true
  }, // 7 -> payment method

  paymentFrom: { type: String }, // 8 -> if income
  paymentTo: { type: String },   // 8 -> if expense
}, {
  timestamps: true
});

// Add conditional validation: only one of paymentFrom or paymentTo must exist based on type
TransactionSchema.pre('validate', function (next) {
  if (this.type === 'income') {
    this.paymentTo = undefined;
    if (!this.paymentFrom) {
      this.invalidate('paymentFrom', 'paymentFrom is required for income transactions');
    }
  } else if (this.type === 'expense') {
    this.paymentFrom = undefined;
    if (!this.paymentTo) {
      this.invalidate('paymentTo', 'paymentTo is required for expense transactions');
    }
  }
  next();
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
