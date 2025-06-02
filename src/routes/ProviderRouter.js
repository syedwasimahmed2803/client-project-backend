// src/routes/ProviderRouter.js
const express = require('express');
const router = express.Router();
const ProviderService = require('../services/ProviderService');
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');
const parseMongoError = require('../utils/Error')

router.get('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const providers = await ProviderService.getProviders();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

router.post('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const provider = await ProviderService.addProvider(req.body);
    res.status(201).json(provider);
  } catch (error) {
     const message = parseMongoError(error);
    res.status(400).json({ message });
  }
});

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