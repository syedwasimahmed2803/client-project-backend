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
    const activeCasesCount = await CaseStorage.getActiveCasesCountForEntities('clients', [id]);
    if (activeCasesCount > 0) {
      throw new Error('Cannot delete client: active cases are associated with this client.');
    }
    const deletedClient = await ClientModel.findByIdAndDelete(id).lean();
    if (!deletedClient) {
      throw new Error('Client not found or already deleted.');
    }
    return deletedClient;
  }
}

module.exports = ClientStorage;