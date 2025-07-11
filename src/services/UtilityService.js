// src/services/UtilityService.js
const ProviderStorage = require('../storage/ProviderStorage');
const HospitalStorage = require('../storage/HospitalStorage');
const ClientStorage = require('../storage/ClientStorage');

class UtilityService {
  static async fetchAllEntityNames() {
    const [providers, hospitals, clients] = await Promise.all([
      ProviderStorage.getAllProviders(),
      HospitalStorage.getAllHospitals(),
      ClientStorage.getAllClients()
    ]);

    return {
      providers: providers.map(p => ({ id: p._id, name: p.name, serviceType: p.serviceType })),
      hospitals: hospitals.map(h => ({ id: h._id, name: h.name })),
      clients: clients.map(c => ({ id: c._id, name: c.name, serviceType: c.serviceType }))
    };
  }

  static async getInsurerByType(id, type) {
    if (type === "providers") {
      return await ProviderStorage.getProviderById(id)
    }
    if (type === "clients") {
      return await ClientStorage.getClientById(id)
    }
  }

  static validateServiceType(serviceType) {
    if (!Array.isArray(serviceType)) {
      throw new Error('serviceType must be an array');
    }

    const keys = serviceType.map((item) => Object.keys(item)[0]);
    const uniqueKeys = new Set(keys);

    if (keys.length !== uniqueKeys.size) {
      throw new Error('Duplicate keys found in serviceType');
    }
  }
}

module.exports = UtilityService;
