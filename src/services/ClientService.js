// src/services/ClientService.js
const ClientStorage = require('../storage/ClientStorage');

class ClientService {
  static async getClients() {
    return ClientStorage.getAllClients();
  }

  static async getClientById(id) {
    return ClientStorage.getClientById(id);
  }

  static async addClient(clientData) {
    // Add validation here if needed
    if (!clientData.name || !clientData.email) {
      throw new Error('Name and email are required');
    }
    
    // Check if client with email already exists
    const existingClient = await ClientStorage.findClientByEmail(clientData.email);
    if (existingClient) {
      throw new Error('Client with this email already exists');
    }
    
    return ClientStorage.createClient(clientData);
  }

  static async updateClient(id, updateData) {
    // Add validation here if needed
    if (updateData.email) {
      // Check if another client has this email
      const existingClient = await ClientStorage.findClientByEmail(updateData.email);
      if (existingClient && existingClient._id.toString() !== id) {
        throw new Error('Another client with this email already exists');
      }
    }
    
    return ClientStorage.updateClient(id, updateData);
  }

  static async deleteClient(id) {
    return ClientStorage.deleteClient(id);
  }
}

module.exports = ClientService;