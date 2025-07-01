const CaseStorage = require('../storage/CaseStorage');
const HospitalStorage = require('../storage/HospitalStorage');
const FinanceStorage = require('../storage/FinanceStorage');
const UtilityService = require('./UtilityService')

class CaseService {
  static async getCases(status, user) {
    return CaseStorage.getAllCases(status, user);
  }

  static async getMonthlyEntityCounts(entityType, status, startDate, endDate) {
    return CaseStorage.getMonthlyCountsGrouped(status, entityType, startDate, endDate);
  }

  static async addCase(data, user) {
    if (!data.patientName || !data.insuranceType || !data.hospital) {
      throw new Error('Missing required fields');
    }
    return CaseStorage.validateAndCreateCase({...data, createdById: user.id, createdBy: user.name});
  }

  static async updateCase(id, data) {
    return CaseStorage.updateCase(id, data);
  }

  static async deleteCase(id) {
    return CaseStorage.deleteCase(id);
  }

  static async closeCase(caseId, remark, user) {
    try {
      const caseDoc = await CaseStorage.getCaseById(caseId);
      if (!caseDoc) throw { status: 404, message: 'Case not found' };
      if (caseDoc.status === 'closed' || caseDoc.status === 'in-review') throw { status: 404, message: 'Case is already Closed or in-review' };

      const hospitalDoc = await HospitalStorage.getHospitalById(caseDoc.hospitalId);
      if (!hospitalDoc) throw { status: 404, message: 'Hospital not found' };

      const insurerDoc = await UtilityService.getInsurerByType(caseDoc.insuranceId, caseDoc.insuranceType);
      if (!insurerDoc) throw { status: 404, message: 'Client not found' };

      // Update case
      caseDoc.status = 'in-review';
      caseDoc.remarks = remark ?? caseDoc.remarks;
      caseDoc.remarkUser = remark?? user.name;
      await CaseStorage.updateCase(caseId, caseDoc);

      // Create finance entry
      const financeData = {
        caseId: caseDoc._id,
        client: caseDoc.insurance,
        clientId: caseDoc.insuranceId,
        patientName: caseDoc.patientName,
        hospitalAmount: hospitalDoc.caseFee,
        clientFee: insurerDoc.caseFee,
        issueDate: new Date(),
        dueDate: null,
        remarks: remark,
        region: caseDoc.region,
        status: null
      };

      await FinanceStorage.createFinance(financeData);

      return caseDoc;
    } catch (error) {
      return error;
    }
  }
}

module.exports = CaseService;
