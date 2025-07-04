// src/storage/ProviderStorage.js
const ProviderModel = require('../models/Provider');
const CaseStorage = require('./CaseStorage')

class ProviderStorage {
  static async getAllProviders() {
      const providers = await ProviderModel.find().lean();
    const providerIds = providers.map(provider => provider._id);

    const activeCaseMap = await CaseStorage.getActiveCasesCountForEntities('providers', providerIds);

    return providers.map(providers => ({
      ...providers,
      activeCases: activeCaseMap[providers._id] || 0,
    }));
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
