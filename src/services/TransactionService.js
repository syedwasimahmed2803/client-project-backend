// src/services/TransactionService.js
const TransactionStorage = require('../storage/TransactionStorage');

class TransactionService {
  static async getTransactions(startDate, endDate, type) {
    return TransactionStorage.getAllTransactions(startDate, endDate, type);
  }

  static async createTransaction(data) {
    return TransactionStorage.createTransaction(data);
  }

   static async deleteTransaction(id) {
    return TransactionStorage.deleteTransaction(id);
  }
}

module.exports = TransactionService;