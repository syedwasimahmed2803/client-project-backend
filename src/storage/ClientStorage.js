// src/storage/ClientStorage.js
const ClientModel = require('../models/Client');

class ClientStorage {
  static async getAllClients() {
    return ClientModel.find().lean();
  }

  static async createClient(data) {
    const client = new ClientModel(data);
    return client.save();
  }
}

module.exports = ClientStorage;
