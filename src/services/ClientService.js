// src/services/ClientService.js
const ClientStorage = require('../storage/ClientStorage');
const UtilityService = require('./UtilityService')

class ClientService {
  static async getClients() {
    return ClientStorage.getAllClients();
  }

  static async addClient(clientData) {
    // Add validation here if needed
    if (!clientData.name) {
      throw new Error('Name is required');
    }

    // Check if client with name already exists
    const existingClient = await ClientStorage.findClientByName(clientData.name);
    if (existingClient) {
      throw new Error('Client with this name already exists');
    }

    await UtilityService.validateServiceType(clientData.serviceType)

    return ClientStorage.createClient(clientData);
  }

  static async updateClient(id, updateData) {
    // Add validation here if needed
    await UtilityService.validateServiceType(clientData.serviceType)

    return ClientStorage.updateClient(id, updateData);
  }

  static async deleteClient(id) {
    return ClientStorage.deleteClient(id);
  }
}

module.exports = ClientService;