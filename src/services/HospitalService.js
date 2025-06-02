// src/services/HospitalService.js
const HospitalStorage = require('../storage/HospitalStorage');

class HospitalService {
  static async getHospitals() {
    return HospitalStorage.getAllHospitals();
  }

  static async addHospital(data) {
    if (!data.name) {
      throw new Error('Name is required');
    }

    const existingHospital = await HospitalStorage.findHospitalByName(data.name);
    if (existingHospital) {
      throw new Error('Hospital with this name already exists');
    }

    return HospitalStorage.createHospital(data);
  }

  static async updateHospital(id, data) {
    return HospitalStorage.updateHospital(id, data);
  }

  static async deleteHospital(id) {
    return HospitalStorage.deleteHospital(id);
  }
}

module.exports = HospitalService;
