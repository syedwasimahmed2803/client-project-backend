const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserStorage = require('../storage/UserStorage');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const AuthService = {
  login: async (email, password, req) => {
    const user = await UserStorage.findByEmail(email);
    // const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id, role: user.role
      // ,loginIP: clientIP
       }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user };
  },

  registerEmployee: async (adminUser, employeeData) => {
    if (adminUser.role !== 'admin') {
      throw new Error('Unauthorized User');
    }
    const hashedPassword = await bcrypt.hash(employeeData.password, 10);
    const employee = await UserStorage.createUser({ ...employeeData, password: hashedPassword });
    return employee;
  }
};

module.exports = AuthService;