const express = require('express');
const AuthService = require('../services/authService');
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');
const parseMongoError = require('../utils/Error');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password, req);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new employee (admin only)
 *     tags: [Auth]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: employee@example.com
 *               password:
 *                 type: string
 *                 example: securePassword123
 *               name:
 *                 type: string
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: Employee registered successfully
 *       400:
 *         description: Validation error or unauthorized
 */
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
