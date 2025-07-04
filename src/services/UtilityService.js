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
      providers: providers.map(p => ({ id: p._id, name: p.name })),
      hospitals: hospitals.map(h => ({ id: h._id, name: h.name })),
      clients: clients.map(c => ({ id: c._id, name: c.name }))
    };
  }

  static async getInsurerByType(id, type) {
    if(type === "providers"){
      return await ProviderStorage.getProviderById(id)
    }
    if(type === "clients"){
      return await ClientStorage.getClientById(id)
    }
    if(type === "hospitals"){
      return await HospitalStorage.getHospitalById(id)
    }
  }

}

module.exports = UtilityService;
