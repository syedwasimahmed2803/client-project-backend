// src/services/FinanceService.js
const FinanceStorage = require('../storage/FinanceStorage');
const CaseStorage = require('../storage/CaseStorage');
const InvoiceStorage = require('../storage/InvoiceStorage');

class FinanceService {
  static async getFinances(startDate, endDate) {
    return FinanceStorage.getAllFinances(startDate, endDate);
  }

  static async addFinance(data) {
    if (!data.name) {
      throw new Error('Name is required');
    }

    const existingFinance = await FinanceStorage.findFinanceByName(data.name);
    if (existingFinance) {
      throw new Error('Finance with this name already exists');
    }

    return FinanceStorage.createFinance(data);
  }

  static async updateFinance(id, data) {
    return FinanceStorage.updateFinance(id, data);
  }

  static async deleteFinance(id) {
    return FinanceStorage.deleteFinance(id);
  }

  static async updateFinanceStatus(financeId, status, remark, user) {
    const financeDoc = await FinanceStorage.getFinanceById(financeId);
    if (!financeDoc) throw { status: 404, message: 'Finance entry not found' };

    const caseDoc = await CaseStorage.getCaseById(financeDoc.caseId);
    if (!caseDoc) throw { status: 404, message: 'Associated case not found' };

    if (status === 'reject') {
      caseDoc.status = 'open';
      caseDoc.remarks = remark ?? caseDoc.remarks;
      caseDoc.remarkUser = remark ?? user.name;
      caseDoc.rejectedBy = user.name;
      await CaseStorage.updateCase(caseDoc);
      await FinanceStorage.deleteFinance(financeId);
      return;
    }

    if (status === 'approve') {
      await InvoiceStorage.createInvoice({
        case: financeDoc.caseId,
        clientName: financeDoc.client,
        patientName: financeDoc.patientName,
        claimAmount: financeDoc.claimAmount,
        caseFee: financeDoc.caseFee,
        issueDate: financeDoc.issueDate,
        dueDate: financeDoc.dueDate,
        status: 'pending'
      });

      financeDoc.status = 'approve';
      await FinanceStorage.updateFinance(financeId, financeDoc);

      caseDoc.status = 'closed'
      caseDoc.approvedBy = user.name;
      caseDoc.closedAt = Date.now();
      await CaseStorage.updateCase(caseDoc.id, caseDoc)

      return financeDoc;
    }
  }
}

module.exports = FinanceService;
