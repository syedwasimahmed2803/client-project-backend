// src/storage/ProviderStorage.js
const ProviderModel = require('../models/Provider');

class ProviderStorage {
  static async getAllProviders() {
    return ProviderModel.find().lean();
  }

  static async getProviderById(id) {
    return ProviderModel.findById(id).lean();
  }

    static async findProviderByName(name) {
    return ProviderModel.findOne({ name }).lean();
  }

  static async createProvider(data) {
    const provider = new ProviderModel(data);
    return provider.save();
  }

  static async updateProvider(id, data) {
    return ProviderModel.findByIdAndUpdate(id, data, { new: true,  runValidators: true }
    ).lean();
  }

  static async deleteProvider(id) {
    return ProviderModel.findByIdAndDelete(id).lean();
  }
}

module.exports = ProviderStorage;
