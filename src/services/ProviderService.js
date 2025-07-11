// src/services/ProviderService.js
const ProviderStorage = require('../storage/ProviderStorage');
const UtilityService = require('./UtilityService');

class ProviderService {
  static async getProviders() {
    return ProviderStorage.getAllProviders();
  }

  static async addProvider(data) {
    if (!data.name) {
      throw new Error('Name is required');
    }

    // Check if provider with name already exists
    const existingProvider = await ProviderStorage.findProviderByName(data.name);
    if (existingProvider) {
      throw new Error('Provider with this name already exists');
    }

    await UtilityService.validateServiceType(clientData.serviceType)

    return ProviderStorage.createProvider(data);
  }
  static async updateProvider(id, data) {
    await UtilityService.validateServiceType(clientData.serviceType)

    return ProviderStorage.updateProvider(id, data);
  }

  static async deleteProvider(id) {
    return ProviderStorage.deleteProvider(id);
  }
}

module.exports = ProviderService;
