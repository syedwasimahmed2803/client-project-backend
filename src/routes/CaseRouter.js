const express = require('express');
const router = express.Router();
const CaseService = require('../services/CaseService');
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');
const parseMongoError = require('../utils/Error');

/**
 * @swagger
 * tags:
 *   name: Cases
 *   description: Case management endpoints
 */

/**
 * @swagger
 * /cases:
 *   get:
 *     summary: Get all cases
 *     tags: [Cases]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all cases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   refNumber:
 *                     type: string
 *                   patientName:
 *                     type: string
 *                   companyName:
 *                     type: string
 *                   insuranceReference:
 *                     type: string
 *                   insurance:
 *                     type: string
 *                   insuranceType:
 *                     type: string
 *                     enum: [Provider, Client]
 *                   insuranceId:
 *                     type: string
 *                   hospital:
 *                     type: string
 *                   hospitalId:
 *                     type: string
 *                   assistanceDate:
 *                     type: string
 *                     format: date-time
 *                   serviceType:
 *                     type: string
 *                   remarks:
 *                     type: string
 *                   invoiceStatus:
 *                     type: string
 *                     enum: [completed, pending]
 *                   mrStatus:
 *                     type: string
 *                     enum: [completed, pending]
 *                   region:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [open, close]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Failed to fetch cases
 */
router.get('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const cases = await CaseService.getCases();
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

/**
 * @swagger
 * /cases/monthly-entity-counts:
 *   get:
 *     summary: Get case counts per month for an entity for a custom date range and status
 *     tags: [Cases]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: open, in-review, closed
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start of the date range
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End of the date range
 *       - in: query
 *         name: entityType
 *         required: false
 *         schema:
 *           type: string
 *         description: Hospital/Client/Provider
 *     responses:
 *       200:
 *         description: Monthly case counts within the date range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: number
 */
router.get('/monthly-entity-counts', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    let { entityType, status, startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      startDate = sixMonthsAgo.toISOString();
      endDate = now.toISOString();
    }

    const counts = await CaseService.getMonthlyEntityCounts(
      entityType,
      status,
      new Date(startDate),
      new Date(endDate)
    );

    res.json(counts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get case statistics' });
  }
});



/**
 * @swagger
 * /cases:
 *   post:
 *     summary: Create a new case
 *     tags: [Cases]
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
 *               - refNumber
 *               - patientName
 *               - insuranceType
 *               - insuranceId
 *               - hospital
 *               - hospitalId
 *             properties:
 *               refNumber:
 *                 type: string
 *               patientName:
 *                 type: string
 *               companyName:
 *                 type: string
 *               insuranceReference:
 *                 type: string
 *               insurance:
 *                 type: string
 *               insuranceType:
 *                 type: string
 *                 enum: [Provider, Client]
 *               insuranceId:
 *                 type: string
 *               hospital:
 *                 type: string
 *               hospitalId:
 *                 type: string
 *               assistanceDate:
 *                 type: string
 *                 format: date-time
 *               serviceType:
 *                 type: string
 *               remarks:
 *                 type: string
 *               invoiceStatus:
 *                 type: string
 *                 enum: [completed, pending]
 *               mrStatus:
 *                 type: string
 *                 enum: [completed, pending]
 *               region:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [open, close]
 *     responses:
 *       201:
 *         description: Case created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 refNumber:
 *                   type: string
 *                 patientName:
 *                   type: string
 *                 companyName:
 *                   type: string
 *                 insuranceReference:
 *                   type: string
 *                 insurance:
 *                   type: string
 *                 insuranceType:
 *                   type: string
 *                   enum: [Provider, Client]
 *                 insuranceId:
 *                   type: string
 *                 hospital:
 *                   type: string
 *                 hospitalId:
 *                   type: string
 *                 assistanceDate:
 *                   type: string
 *                   format: date-time
 *                 serviceType:
 *                   type: string
 *                 remarks:
 *                   type: string
 *                 invoiceStatus:
 *                   type: string
 *                   enum: [completed, pending]
 *                 mrStatus:
 *                   type: string
 *                   enum: [completed, pending]
 *                 region:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [open, close]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input or duplicate case
 */
router.post('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const newCase = await CaseService.addCase(req.body);
    res.status(201).json(newCase);
  } catch (error) {
    const message = parseMongoError(error);
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /cases/{id}:
 *   put:
 *     summary: Update an existing case
 *     tags: [Cases]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Case ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refNumber:
 *                 type: string
 *               patientName:
 *                 type: string
 *               companyName:
 *                 type: string
 *               insuranceReference:
 *                 type: string
 *               insurance:
 *                 type: string
 *               insuranceType:
 *                 type: string
 *                 enum: [Provider, Client]
 *               insuranceId:
 *                 type: string
 *               hospital:
 *                 type: string
 *               hospitalId:
 *                 type: string
 *               assistanceDate:
 *                 type: string
 *                 format: date-time
 *               serviceType:
 *                 type: string
 *               remarks:
 *                 type: string
 *               invoiceStatus:
 *                 type: string
 *                 enum: [completed, pending]
 *               mrStatus:
 *                 type: string
 *                 enum: [completed, pending]
 *               region:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [open, close]
 *     responses:
 *       200:
 *         description: Case updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 refNumber:
 *                   type: string
 *                 patientName:
 *                   type: string
 *                 companyName:
 *                   type: string
 *                 insuranceReference:
 *                   type: string
 *                 insurance:
 *                   type: string
 *                 insuranceType:
 *                   type: string
 *                   enum: [Provider, Client]
 *                 insuranceId:
 *                   type: string
 *                 hospital:
 *                   type: string
 *                 hospitalId:
 *                   type: string
 *                 assistanceDate:
 *                   type: string
 *                   format: date-time
 *                 serviceType:
 *                   type: string
 *                 remarks:
 *                   type: string
 *                 invoiceStatus:
 *                   type: string
 *                   enum: [completed, pending]
 *                 mrStatus:
 *                   type: string
 *                   enum: [completed, pending]
 *                 region:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [open, close]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Case not found
 *       400:
 *         description: Invalid input
 */
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

/**
 * @swagger
 * /cases/{id}:
 *   delete:
 *     summary: Delete a case by ID (admin only)
 *     tags: [Cases]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Case ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Case deleted successfully
 *       404:
 *         description: Case not found
 */
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

/**
 * @swagger
 * /cases/{caseId}/in-review:
 *   put:
 *     summary: Move a case to in-review and create a corresponding finance entry
 *     tags:
 *       - Cases
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - in: path
 *         name: caseId
 *         required: true
 *         description: MongoDB ObjectId of the case to be closed
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - remark
 *             properties:
 *               remark:
 *                 type: string
 *                 description: Remark to be added when closing the case
 *     responses:
 *       200:
 *         description: Case successfully closed and finance entry created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Case not found
 *       500:
 *         description: Server error
 */

// PUT /cases/:caseId/close
router.put('/:id/in-review', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  const { id } = req.params;
  const { remark } = req.body;

  try {
    const closedCase = await CaseService.closeCase(id, remark);
    res.status(200).json(closedCase);
  } catch (error) {
    const message = parseMongoError(error);
    res.status(400).json({ message });
  }
});


module.exports = router;
