const UserModel = require('../models/UserModel');

const UserStorage = {
  findByEmail: async (email) => UserModel.findOne({ email }),
  createUser: async (userData) => UserModel.create(userData),
  findById: async (id) => UserModel.findById(id),
  updatePasswordById: async (userId, hashedPassword) => UserModel.findByIdAndUpdate(userId, { password: hashedPassword })

};

module.exports = UserStorage;