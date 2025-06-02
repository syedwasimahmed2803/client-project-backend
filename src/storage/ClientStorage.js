// src/storage/ClientStorage.js
const ClientModel = require('../models/Client');

class ClientStorage {
  static async getAllClients() {
    return ClientModel.find().lean();
  }

  static async getClientById(id) {
    return ClientModel.findById(id).lean();
  }

  static async findClientByName(name) {
    return ClientModel.findOne({ name }).lean();
  }

  static async createClient(data) {
    const client = new ClientModel(data);
    return client.save();
  }

  static async updateClient(id, updateData) {
    return ClientModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).lean();
  }

  static async deleteClient(id) {
    return ClientModel.findByIdAndDelete(id).lean();
  }
}

module.exports = ClientStorage;