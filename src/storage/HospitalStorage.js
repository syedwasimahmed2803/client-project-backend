// src/storage/HospitalStorage.js
const HospitalModel = require('../models/Hospital');
const CaseStorage = require('./CaseStorage')

class HospitalStorage {
  static async getAllHospitals() {
    const hospitals = await HospitalModel.find().lean();
    const hospitalIds = hospitals.map(hospital => hospital._id);

    const activeCaseMap = await CaseStorage.getActiveCasesCountForEntities('hospitals', hospitalIds);

    return hospitals.map(hospital => ({
      ...hospital,
      activeCases: activeCaseMap[hospital._id] || 0,
    }));
  }

  static async getHospitalById(id) {
    return HospitalModel.findById(id).lean();
  }

  static async findHospitalByName(name) {
    return HospitalModel.findOne({ name }).lean();
  }

  static async createHospital(data) {
    const hospital = new HospitalModel(data);
    return hospital.save();
  }

  static async updateHospital(id, data) {
    return HospitalModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  }

  static async deleteHospital(id) {
      const activeCasesCount = await CaseStorage.getActiveCasesCountForEntities('hospitals', [id]);
    if (activeCasesCount > 0) {
      throw new Error('Cannot delete hospital: active cases are associated with this client.');
    }
    const deletedHospital = await HospitalModel.findByIdAndDelete(id).lean();
    if (!deletedHospital) {
      throw new Error('Hospital not found or already deleted.');
    }
    return deletedHospital;
  }
}

module.exports = HospitalStorage;
