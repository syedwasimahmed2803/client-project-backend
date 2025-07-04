// src/storage/ClientStorage.js
const ClientModel = require('../models/Client');
const CaseStorage = require('./CaseStorage')
class ClientStorage {
  static async getAllClients() {
    const clients = await ClientModel.find().lean();
    const clientIds = clients.map(client => client._id);

    const activeCaseMap = await CaseStorage.getActiveCasesCountForEntities('clients', clientIds);

    return clients.map(client => ({
      ...client,
      activeCases: activeCaseMap[client._id] || 0,
    }));
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