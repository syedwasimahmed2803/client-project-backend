// src/storage/TransactionStorage.js
const TransactionModel = require('../models/Transaction');
class TransactionStorage {

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

  static async createTransaction(user, data) {
        const transactionData = {
      ...data,
      createdBy: user.name,
      createdById: user.id,
      createdByRole: user.role,
    }
    const transaction = new TransactionModel(transactionData);
    return transaction.save();
  }

  static async deleteTransaction(id) {
    const deleteTransaction = await TransactionModel.findByIdAndDelete(id).lean();
    if (!deleteTransaction) {
      throw new Error('Provider not found or already deleted.');
    }
    return deleteTransaction;
  }
}

module.exports = TransactionStorage;