// src/storage/InvoiceStorage.js
const InvoiceModel = require('../models/Invoice');
class InvoiceStorage {
  static async createInvoice(data) {
    const invoice = new InvoiceModel(data);
    return invoice.save();
  }

  static async getAllInvoices(startDate, endDate) {
    const filter = {};
    // Default date range: last 6 months
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end);
    if (!startDate) {
      start.setMonth(start.getMonth() - 6);
    }

    filter.createdAt = { $gte: start, $lte: end };
    return InvoiceModel.find(filter).lean();
  }

  static async updateInvoiceStatus(id, status, user) {
    const update = {
      status,
      updatedByUser: user.name
    };

    if (status === 'paid') {
      update.paidDate =  new Date();
    } else {
      update.$unset = { paidDate: '' }; // Removes the field
    }

    return InvoiceModel.findByIdAndUpdate(
      id,
      update,
      {
        new: true,
        runValidators: true
      }
    ).lean();
  }

}

module.exports = InvoiceStorage;