const CaseStorage = require('../storage/CaseStorage');

class CaseService {
  static async getCases() {
    return CaseStorage.getAllCases();
  }

  static async addCase(data) {
    if (!data.refNumber || !data.patientName || !data.insuranceType || !data.hospital) {
      throw new Error('Missing required fields');
    }
    return CaseStorage.validateAndCreateCase(data);
  }

  static async updateCase(id, data) {
    return CaseStorage.updateCase(id, data);
  }

  static async deleteCase(id) {
    return CaseStorage.deleteCase(id);
  }
}

module.exports = CaseService;
