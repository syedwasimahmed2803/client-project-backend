const express = require('express');
const router = express.Router();
const HospitalService = require('../services/HospitalService');
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');
const parseMongoError = require('../utils/Error')

// GET all hospitals
router.get('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const hospitals = await HospitalService.getHospitals();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

// CREATE a hospital
router.post('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const hospital = await HospitalService.addHospital(req.body);
    res.status(201).json(hospital);
  } catch (error) {
    const message = parseMongoError(error);
    res.status(400).json({ message });
  }
});

// UPDATE a hospital
router.put('/:id', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const updatedHospital = await HospitalService.updateHospital(req.params.id, req.body);
    if (!updatedHospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    res.json(updatedHospital);
  } catch (error) {
    const message = parseMongoError(error);
    res.status(400).json({ message });
  }
});

// DELETE a hospital
router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const deletedHospital = await HospitalService.deleteHospital(req.params.id);
    if (!deletedHospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    res.json({ message: 'Hospital deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete hospital' });
  }
});

module.exports = router;
