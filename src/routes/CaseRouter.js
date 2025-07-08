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
 *     summary: Get all cases (optionally filter by status)
 *     tags: [Cases]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, in-review, closed]
 *         required: false
 *         description: Filter cases by status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Start date for filtering finances by issueDate
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: End date for filtering finances by issueDate
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
 *                     enum: [providers, clients]
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
 *                     enum: [open, closed]
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
     let { startDate, endDate } = req.query;
    const user = req.user;
    const cases = await CaseService.getCases(req.query.status, startDate, endDate, user);
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
 *         description: hospitals/clients/providers
 *     responses:
 *       200:
 *         description: Monthly case counts grouped by entity (e.g., hospitals, clients, providers)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   type: number
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
 *               insuranceReference:
 *                 type: string
 *               insurance:
 *                 type: string
 *               insuranceType:
 *                 type: string
 *                 enum: [providers, clients]
 *               insuranceId:
 *                 type: string
 *               hospital:
 *                 type: string
 *               hospitalId:
 *                 type: string
 *               assistanceDate:
 *                 type: string
 *                 format: date-time
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
 *                 enum: [open, closed]
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
*                 claimAmount:
 *                   type: number
 *                 insurance:
 *                   type: string
 *                 insuranceType:
 *                   type: string
 *                   enum: [providers, clients]
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
 *                   enum: [open, closed]
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
    const user = req.user;
    const newCase = await CaseService.addCase(req.body, user);
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
 *                 enum: [providers, clients]
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
 *                 enum: [open, closed]
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
 *                   enum: [providers, clients]
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
 *                   enum: [open, closed]
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
  const user = req.user;

  try {
    const closedCase = await CaseService.closeCase(id, remark, user);
    res.status(200).json(closedCase);
  } catch (error) {
    const message = parseMongoError(error);
    res.status(400).json({ message });
  }
});

/**
 * @swagger
 * /cases/closed-case-count:
 *   get:
 *     summary: Get count of closed cases grouped by creator
 *     tags:
 *       - Cases
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Filter cases closed after this date (defaults to 6 months ago if not provided)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Filter cases closed before this date (defaults to now if not provided)
 *     responses:
 *       200:
 *         description: Successfully fetched closed case counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   createdById:
 *                     type: string
 *                     description: ID of the user who created the case
 *                   createdBy:
 *                     type: string
 *                     description: Name of the user who created the case
 *                   count:
 *                     type: integer
 *                     description: Number of closed cases by the user in the specified time range
 *       500:
 *         description: Failed to fetch closed case counts
 */
router.get('/closed-case-count', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const counts = await CaseService.getClosedCaseCountsByUser(startDate, endDate);
    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch closed case counts' });
  }
});



module.exports = router;
