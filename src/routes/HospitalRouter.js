const express = require('express');
const router = express.Router();
const HospitalService = require('../services/HospitalService');
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');
const parseMongoError = require('../utils/Error');

/**
 * @swagger
 * tags:
 *   name: Hospitals
 *   description: API endpoints for managing hospitals
 */

/**
 * @swagger
 * /hospitals:
 *   get:
 *     summary: Get all hospitals
 *     tags: [Hospitals]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of hospitals
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
 *       500:
 *         description: Failed to fetch hospitals
 */

// GET all hospitals
router.get('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const hospitals = await HospitalService.getHospitals();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

/**
 * @swagger
 * /hospitals:
 *   post:
 *     summary: Create a new hospital
 *     tags: [Hospitals]
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
 *               relation:
 *                 type: string
 *                 enum: [cash, cashless]
 *                 example: cash
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: active
 *     responses:
 *       201:
 *         description: Hospital created successfully
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

/**
 * @swagger
 * /hospitals/{id}:
 *   put:
 *     summary: Update hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the client to update
 *         schema:
 *           type: string
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
 *               relation:
 *                 type: string
 *                 enum: [cash, cashless]
 *                 example: cash
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

/**
 * @swagger
 * /hospitals/{id}:
 *   delete:
 *     summary: Delete a hospital by ID (admin only)
 *     tags: [Hospitals]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Hospital ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hospital deleted successfully
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Failed to delete Hospital
 */

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
