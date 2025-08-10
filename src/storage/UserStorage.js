const UserModel = require('../models/UserModel');

const UserStorage = {
  findByEmail: async (email) => UserModel.findOne({ email }),
  createUser: async (userData) => UserModel.create(userData),
  findById: async (id) => UserModel.findById(id),
  updatePasswordById: async (userId, hashedPassword) => UserModel.findByIdAndUpdate(userId, { password: hashedPassword }),
  deleteAccount: async (userId) => {
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

};

module.exports = UserStorage;