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
      caseDoc.rejectedBy = user.name;
      await CaseStorage.updateCase(caseDoc._id, caseDoc);
      await FinanceStorage.deleteFinance(financeId);
      return;
    }

    if (status === 'approve') {
      const invoiceDoc = await InvoiceStorage.createInvoice({
        insuranceReference: financeDoc.insuranceReference,
        insurance: financeDoc.insurance,
        insuranceType: financeDoc.insuranceType,
        patientName: financeDoc.patientName,
        claimAmount: financeDoc.claimAmount,
        caseFee: financeDoc.caseFee,
        issueDate: financeDoc.issueDate,
        dueDate: financeDoc.dueDate,
        status: 'pending',
        createdBy: user.name,
        createdById: user.id,
        remarks: financeDoc.remarks,
        remarkUser: financeDoc.remarkUser,
        remarkUserRole: financeDoc.remarkUserRole,
        caseId: financeDoc.caseId,
        region: financeDoc.region,
        country: financeDoc.country,
        financeId: financeDoc._id
      });


      if (invoiceDoc._id) {
        await FinanceStorage.deleteFinance(financeId, financeDoc);
      }

      caseDoc.status = 'closed'
      caseDoc.approvedBy = user.name;
      caseDoc.closedAt = new Date();
      await CaseStorage.updateCase(caseDoc._id, caseDoc)
      return financeDoc;
    }
  }
}

module.exports = FinanceService;
