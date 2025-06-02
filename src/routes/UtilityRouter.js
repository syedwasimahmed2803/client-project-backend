const express = require('express');
const router = express.Router();
const UtilityService = require('../services/UtilityService');
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');

router.get('/dropdown-data', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const data = await UtilityService.fetchAllEntityNames();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dropdown data' });
  }
});

module.exports = router;
