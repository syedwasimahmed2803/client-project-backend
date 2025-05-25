// src/services/ClientService.js
const ClientStorage = require('../storage/ClientStorage');

class ClientService {
  static async getClients() {
    return ClientStorage.getAllClients();
  }

  static async addClient(clientData) {
    // You can add validation here if needed
    return ClientStorage.createClient(clientData);
  }
}

module.exports = ClientService;
