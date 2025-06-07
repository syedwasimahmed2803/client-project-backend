// src/storage/FinanceStorage.js
const FinanceModel = require('../models/Finance');
class FinanceStorage {
  static async createFinance(data) {
    const finance = new FinanceModel(data);
    return finance.save();
  }

  static async getAllFinances() {
    return FinanceModel.find().lean();
  }

  static async getFinanceById(id) {
    return FinanceModel.findById(id).lean();
  }

  static async deleteFinance(id) {
    return FinanceModel.findByIdAndDelete(id).lean();
  }

  static async updateFinance(id, data) {
    return FinanceModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  }
}

module.exports = FinanceStorage;