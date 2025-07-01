// src/storage/FinanceStorage.js
const FinanceModel = require('../models/Finance');
class FinanceStorage {
  static async createFinance(data) {
    const finance = new FinanceModel(data);
    return finance.save();
  }

  static async getAllFinances(startDate, endDate) {
    const match = {};
    if (startDate && endDate) {
      match.issueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    return FinanceModel.find(match).lean();
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