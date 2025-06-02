// src/storage/HospitalStorage.js
const HospitalModel = require('../models/Hospital');

class HospitalStorage {
  static async getAllHospitals() {
    return HospitalModel.find().lean();
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
    return HospitalModel.findByIdAndDelete(id).lean();
  }
}

module.exports = HospitalStorage;
