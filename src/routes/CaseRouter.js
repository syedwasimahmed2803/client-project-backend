const express = require('express');
const router = express.Router();
const CaseService = require('../services/CaseService');
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');
const parseMongoError = require('../utils/Error')

router.get('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const cases = await CaseService.getCases();
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

router.post('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const newCase = await CaseService.addCase(req.body);
    res.status(201).json(newCase);
  } catch (error) {
    const message = parseMongoError(error);
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const updated = await CaseService.updateCase(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json(updated);
  } catch (error) {
    const message = parseMongoError(error);
    res.status(400).json({ message });
  }
});

router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await CaseService.deleteCase(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete case' });
  }
});

module.exports = router;
