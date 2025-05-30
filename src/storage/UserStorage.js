const UserModel = require('../models/UserModel');

const UserStorage = {
  findByEmail: async (email) => UserModel.findOne({ email }),
  createUser: async (userData) => UserModel.create(userData),
  findById: async (id) => UserModel.findById(id),
};

module.exports = UserStorage;