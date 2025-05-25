// src/routes/ClientRouter.js
const express = require('express');
const router = express.Router();
const ClientService = require('../services/ClientService');

router.get('/', async (req, res) => {
  try {
    const clients = await ClientService.getClients();
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newClient = await ClientService.addClient(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
