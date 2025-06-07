// src/services/InvoiceService.js
const InvoiceStorage = require('../storage/InvoiceStorage');
const CaseStorage = require('../storage/CaseStorage');
const InvoiceStorage = require('../storage/InvoiceStorage');

class InvoiceService {
  static async getInvoices() {
    return InvoiceStorage.getAllInvoices();
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

  static async updateInvoice(id, data) {
    return InvoiceStorage.updateInvoice(id, data);
  }

//   static async deleteInvoice(id) {
//     return InvoiceStorage.deleteInvoice(id);
//   }
}

module.exports = InvoiceService;
