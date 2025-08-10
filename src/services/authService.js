// src/services/AuthService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserStorage = require('../storage/UserStorage');
const crypto = require('crypto');
const transporter = require('../utils/Mailer');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const AuthService = {
  login: async (email, password, req) => {
    const user = await UserStorage.findByEmail(email);
    // const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({
      id: user._id, role: user.role
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
  },

  forgotPassword: async (email) => {
    const user = await UserStorage.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const tempPassword = crypto.randomBytes(4).toString('hex'); // 8-char temp password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    await UserStorage.updatePasswordById(user._id, hashedPassword);

    const mailOptions = {
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Temporary Password - Reset Request',
      html: `
        <p>Hello ${user.name},</p>
        <p>Your temporary password is:</p>
        <h3>${tempPassword}</h3>
        <p>Please log in and change it immediately.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  },

  changePassword: async (email, currentPassword, newPassword) => {
    const user = await UserStorage.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      throw new Error('Current password is incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await UserStorage.updatePasswordById(user._id, hashed);
  },

    deleteAccount: async (adminUser, id) => {
       if (adminUser.role !== 'admin') {
      throw new Error('Unauthorized User');
    }
    const user = await UserStorage.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    const deletedUser = await UserStorage.deleteAccount(id);
  }

};

module.exports = AuthService;