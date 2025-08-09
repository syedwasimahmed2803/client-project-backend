// src/services/TransactionService.js
const TransactionStorage = require('../storage/TransactionStorage');
const TransactionModel = require('../models/Transaction');

class TransactionService {
  static async getTransactions(startDate, endDate, type) {
    return TransactionStorage.getAllTransactions(startDate, endDate, type);
  }

  static async createTransaction(user, data) {
    return TransactionStorage.createTransaction(user, data);
  }

  static async deleteTransaction(id) {
    return TransactionStorage.deleteTransaction(id);
  }
}

module.exports = TransactionService;