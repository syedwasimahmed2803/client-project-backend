// src/services/InvoiceService.js
const InvoiceStorage = require('../storage/InvoiceStorage');

class InvoiceService {
  static async getInvoices(startDate, endDate) {
    return InvoiceStorage.getAllInvoices(startDate, endDate);
  }

//   static async addInvoice(data) {
//     if (!data.name) {
//       throw new Error('Name is required');
//     }

//     const existingInvoice = await InvoiceStorage.findInvoiceByName(data.name);
//     if (existingInvoice) {
//       throw new Error('Invoice with this name already exists');
//     }

//     return InvoiceStorage.createInvoice(data);
//   }

  static async updateInvoiceStatus(id) {
    return InvoiceStorage.updateInvoiceStatus(id);
  }

//   static async deleteInvoice(id) {
//     return InvoiceStorage.deleteInvoice(id);
//   }
}

module.exports = InvoiceService;
