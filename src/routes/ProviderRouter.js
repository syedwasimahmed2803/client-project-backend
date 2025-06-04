const express = require('express');
const router = express.Router();
const ProviderService = require('../services/ProviderService');
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');
const parseMongoError = require('../utils/Error');

/**
 * @swagger
 * tags:
 *   name: Provider
 *   description: Provider management APIs
 */

/**
 * @swagger
 * /providers:
 *   get:
 *     summary: Get all providers
 *     tags: [Provider]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of providers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *       500:
 *         description: Failed to fetch providers
 */
router.get('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const providers = await ProviderService.getProviders();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

/**
 * @swagger
 * /provider:
 *   post:
 *     summary: Create a new provider
 *     tags: [Provider]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "HealthCare Partner"
 *               location:
 *                 type: string
 *                 example: "Bangalore"
 *               region:
 *                 type: string
 *                 example: "South"
 *               contacts:
 *                 type: object
 *                 properties:
 *                   primary:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       designation:
 *                         type: string
 *                         example: "Manager"
 *                       phone:
 *                         type: string
 *                         example: "9876543210"
 *                   secondary:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Jane Doe"
 *                       email:
 *                         type: string
 *                         example: "jane@example.com"
 *                       designation:
 *                         type: string
 *                         example: "Assistant Manager"
 *                       phone:
 *                         type: string
 *                         example: "9876543211"
 *               caseFee:
 *                 type: number
 *                 example: 1200
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: active
 *     responses:
 *       201:
 *         description: Provider created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 location:
 *                   type: string
 *                 region:
 *                   type: string
 *                 contacts:
 *                   type: object
 *                 caseFee:
 *                   type: number
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation or duplicate error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.post('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const provider = await ProviderService.addProvider(req.body);
    res.status(201).json(provider);
  } catch (error) {
    const message = parseMongoError(error);
    res.status(400).json({ message });
  }
});

/**
 * @swagger
 * /providers/{id}:
 *   put:
 *     summary: Update an existing provider
 *     tags: [Provider]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Provider ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "HealthCare Partner"
 *               location:
 *                 type: string
 *                 example: "Bangalore"
 *               region:
 *                 type: string
 *                 example: "South"
 *               contacts:
 *                 type: object
 *                 properties:
 *                   primary:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       designation:
 *                         type: string
 *                         example: "Manager"
 *                       phone:
 *                         type: string
 *                         example: "9876543210"
 *                   secondary:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Jane Doe"
 *                       email:
 *                         type: string
 *                         example: "jane@example.com"
 *                       designation:
 *                         type: string
 *                         example: "Assistant Manager"
 *                       phone:
 *                         type: string
 *                         example: "9876543211"
 *               caseFee:
 *                 type: number
 *                 example: 1200
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: active
 *     responses:
 *       200:
 *         description: Provider updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Provider not found
 */
router.put('/:id', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const updatedProvider = await ProviderService.updateProvider(req.params.id, req.body);
    if (!updatedProvider) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json(updatedProvider);
  } catch (error) {
    const message = parseMongoError(error);
    res.status(400).json({ message });
  }
});

/**
 * @swagger
 * /providers/{id}:
 *   delete:
 *     summary: Delete a provider by ID (admin only)
 *     tags: [Provider]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Provider ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Provider deleted successfully
 *       404:
 *         description: Provider not found
 *       500:
 *         description: Failed to delete Provider
 */
router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const deletedProvider = await ProviderService.deleteProvider(req.params.id);
    if (!deletedProvider) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Provider' });
  }
});

module.exports = router;