const CaseStorage = require('../storage/CaseStorage');
const HospitalStorage = require('../storage/HospitalStorage');
const ClientStorage = require('../storage/ClientStorage');
const ProviderStorage = require('../storage/ProviderStorage');
const FinanceStorage = require('../storage/FinanceStorage');
const UtilityService = require('./UtilityService')

class CaseService {
  static async getCases(status, startDate, endDate, user) {
    return CaseStorage.getAllCases(status, startDate, endDate, user);
  }

  static async getClosedCaseCountsByUser(startDate, endDate) {
    return CaseStorage.getClosedCaseCountsByUser(startDate, endDate);
  }

  static async getMonthlyEntityCounts(entityType, status, startDate, endDate) {
    return CaseStorage.getMonthlyCountsGrouped(status, entityType, startDate, endDate);
  }

  static async addCase(data, user) {
    const { patientName, insuranceType, insuranceId, hospital, remarks } = data;

    // Validate required fields
    const missingFields = [];
    if (!patientName) missingFields.push('patientName');
    if (!insuranceType) missingFields.push('insuranceType');
    if (!hospital) missingFields.push('hospital');
    if (!insuranceId) missingFields.push('insuranceId');

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    let insurerDoc;

    if (insuranceType === 'clients') {
      insurerDoc = await ClientStorage.getClientById(insuranceId)
    } else if (data.insuranceType === 'providers') {
      insurerDoc = await ProviderStorage.getHospitalById(insuranceId)
    } else if (data.insuranceType === 'hospitals') {
      insurerDoc = await HospitalStorage.getHospitalById(insuranceId)
    }

    const caseData = {
      ...data,
      createdById: user.id,
      createdBy: user.name,
      region: insurerDoc.region,
      country: insurerDoc.country,
      ...(remarks && { remarkUser: user.name }),
      ...(remarks && { remarkUserRole: user.role }),
    };

    return CaseStorage.validateAndCreateCase(caseData);
  }

  static async updateCase(id, data) {
    return CaseStorage.updateCase(id, data);
  }

  static async deleteCase(id) {
    return CaseStorage.deleteCase(id);
  }

  static async closeCase(caseId, remark, user) {
    try {
      let caseDoc = await CaseStorage.getCaseById(caseId);
      if (!caseDoc) throw { status: 404, message: 'Case not found' };
      if (caseDoc.status === 'closed' || caseDoc.status === 'in-review') throw { status: 404, message: 'Case is already Closed or in-review' };

      const hospitalDoc = await HospitalStorage.getHospitalById(caseDoc.hospitalId);
      if (!hospitalDoc) throw { status: 404, message: 'Hospital not found' };

      const insurerDoc = await UtilityService.getInsurerByType(caseDoc.insuranceId, caseDoc.insuranceType);
      if (!insurerDoc) throw { status: 404, message: 'Insurance entity not found' };

       // Update case
      caseDoc.status = 'in-review';
      if (remark) {
        caseDoc.remarks = remark;
        caseDoc.remarkUser = user.name;
        caseDoc.remarkUserRole = user.role;
      }
      await CaseStorage.updateCase(caseId, caseDoc);

      caseDoc = await CaseStorage.getCaseById(caseId);

      // Create finance entry
      const financeData = {
        insuranceReference: caseDoc.insuranceReference,
        insurance: caseDoc.insurance,
        insuranceType: caseDoc.insuranceType,
        patientName: caseDoc.patientName,
        claimAmount: caseDoc.claimAmount,
        caseFee: insurerDoc.caseFee,
        issueDate: Date(),
        dueDate: null,
        remarks: caseDoc.remarks,
        remarkUser: caseDoc.remarkUser,
        remarkUserRole: caseDoc.remarkUserRole,
        caseId: caseDoc._id,
        region: caseDoc.region,
        country: caseDoc.country,
        createdBy: user.name,
        createdById: user.id,
        status: 'pending',
        createdAt: caseDoc.createdAt,
        financeCreatedAt: Date(),
        updatedAt: caseDoc.updatedAt
      };

      await FinanceStorage.createFinance(financeData);

      return caseDoc;
    } catch (error) {
      return error;
    }
  }
}

module.exports = CaseService;
