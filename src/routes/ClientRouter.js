const express = require('express');
const router = express.Router();
const ClientService = require('../services/ClientService');
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');
const parseMongoError = require('../utils/Error');

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management
 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *     responses:
 *       200:
 *         description: List of all clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "665fe0b3f6b9a9b89463de31"
 *                   name:
 *                     type: string
 *                     example: "Acme Corp"
 *                   email:
 *                     type: string
 *                     example: "contact@acme.com"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *       500:
 *         description: Failed to fetch clients
 */
router.get('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const clients = await ClientService.getClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Client"
 *               email:
 *                 type: string
 *                 example: "newclient@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1987654321"
 *     responses:
 *       201:
 *         description: Client created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "665fe0b3f6b9a9b89463de45"
 *                 name:
 *                   type: string
 *                   example: "New Client"
 *                 email:
 *                   type: string
 *                   example: "newclient@example.com"
 *                 phone:
 *                   type: string
 *                   example: "+1987654321"
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const newClient = await ClientService.addClient(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    const message = parseMongoError(error);
    res.status(400).json({ message });
  }
});

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Update a client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the client to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Name"
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1122334455"
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Client not found
 */
router.put('/:id', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const updatedClient = await ClientService.updateClient(req.params.id, req.body);
    if (!updatedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(updatedClient);
  } catch (error) {
    const message = parseMongoError(error);
    res.status(400).json({ message });
  }
});

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Delete a client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the client to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       404:
 *         description: Client not found
 */
router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await ClientService.deleteClient(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;
