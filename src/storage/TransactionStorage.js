// src/storage/TransactionStorage.js
const TransactionModel = require('../models/Transaction');
class TransactionStorage {
  static async createTransaction(data) {
    const transaction = new TransactionModel(data);
    return transaction.save();
  }

  static async getAllTransactions(startDate, endDate, type) {
    const filter = {};
    // Default date range: last 6 months
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end);
    if (!startDate) {
      start.setMonth(start.getMonth() - 6);
    }
    if (type) {
      filter.type = type;
    }
    filter.createdAt = { $gte: start, $lte: end };
    return TransactionModel.find(filter).lean();
  }

  static async createTransaction(data) {
    const transaction = new TransactionModel(data);
    return transaction.save();
  }
}

module.exports = TransactionStorage;