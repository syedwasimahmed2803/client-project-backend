// src/storage/InvoiceStorage.js
const InvoiceModel = require('../models/Invoice');
class InvoiceStorage {
  static async createInvoice(data) {
    const invoice = new InvoiceModel(data);
    return invoice.save();
  }

  static async getAllInvoices() {
    return InvoiceModel.find().lean();
  }

  static async updateInvoice(id, data) {
    return InvoiceModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  }
}

module.exports = InvoiceStorage;