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

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send a temporary password to user's email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: employee1@example.com
 *     responses:
 *       200:
 *         description: Temporary password sent to the user's email
 *       400:
 *         description: User not found or failed to send email
 */
router.post('/forgot-password', async (req, res) => {
  try {
    await AuthService.forgotPassword(req.body.email);
    res.json({ message: 'Temporary password sent to your email' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change the user's password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: employee1@example.com
 *               currentPassword:
 *                 type: string
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 example: newSecurePassword456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid credentials or user not found
 */
router.post('/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    await AuthService.changePassword(email, currentPassword, newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/delete', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { email} = req.body;
    await AuthService.deleteAccount(req.user, email);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
