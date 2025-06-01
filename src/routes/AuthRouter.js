const express = require('express');
const AuthService = require('../services/authService');
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');
const parseMongoError = require('../utils/Error')

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password, req);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/register', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const employee = await AuthService.registerEmployee(req.user, req.body);
    res.status(201).json(employee);
  } catch (error) {
    const message = parseMongoError(error);
    res.status(400).json({ message });
  }
});

module.exports = router;