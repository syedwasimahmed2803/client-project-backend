// src/routes/ClientRouter.js
const express = require('express');
const router = express.Router();
const ClientService = require('../services/ClientService');
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');

// GET /clients - Only authenticated users can view clients
// Both admin and employee can view clients
router.get('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const clients = await ClientService.getClients();
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// POST /clients - Only admin can create new clients
router.post('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const newClient = await ClientService.addClient(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// GET /clients/:id - Get specific client (admin and employee)
router.get('/:id', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const client = await ClientService.getClientById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// PUT /clients/:id - Update client (only admin)
router.put('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const updatedClient = await ClientService.updateClient(req.params.id, req.body);
    if (!updatedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(updatedClient);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /clients/:id - Delete client (only admin)
router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const deletedClient = await ClientService.deleteClient(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;