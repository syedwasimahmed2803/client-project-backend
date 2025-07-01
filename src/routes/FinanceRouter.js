
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');
const parseMongoError = require('../utils/Error');
const FinanceService = require('../services/FinanceService');


/**
 * @swagger
 * tags:
 *   name: Finance
 *   description: Finance management
 */

/**
 * @swagger
 * /finances:
 *   get:
 *     summary: Get all finances (optionally filtered by issue date)
 *     tags: [Finance]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
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
 *         description: List of all finances
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   caseId:
 *                     type: string
 *                   clientId:
 *                     type: string
 *                   patientName:
 *                     type: string
 *                   client:
 *                     type: string
 *                   hospitalAmount:
 *                     type: string
 *                   clientFee:
 *                     type: string
 *                   issueDate:
 *                     type: string
 *                     format: date-time
 *                   dueDate:
 *                     type: string
 *                     format: date-time
 *                   serviceType:
 *                     type: string
 *                   remarks:
 *                     type: string
 *                   region:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [approve, reject]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Failed to fetch finances
 */
router.get('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
      let { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      startDate = sixMonthsAgo.toISOString();
      endDate = now.toISOString();
    }
    const finance = await FinanceService.getFinances(startDate, endDate);
    res.json(finance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch finances' });
  }
});

/**
 * @swagger
 * /finances/{financeId}/status:
 *   put:
 *     summary: Update the status of a finance entry (approve or reject)
 *     tags:
 *       - Finance
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - in: path
 *         name: financeId
 *         required: true
 *         description: MongoDB ObjectId of the finance entry
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - remark
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approve, reject]
 *                 description: Status to update the finance entry with
 *               remark:
 *                 type: string
 *                 description: Remark for the status update (overwrites current remark if rejected)
 *     responses:
 *       200:
 *         description: Finance status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Finance or case not found
 *       500:
 *         description: Server error
 */

router.put('/:id/status', authenticate, authorizeRoles('admin'), async (req, res) => {
    const { status, remark } = req.body;
    const { id } = req.params;
    const user = req.user;

    if (!['approve', 'reject'].includes(status)) {
        return res.status(400).send({ error: 'Invalid status value' });
    }

    try {
        const finance = await FinanceService.updateFinanceStatus(id, status, remark, user);
        res.status(200).json(finance);
    } catch (error) {
        const message = parseMongoError(error);
        res.status(400).json({ message });
    }
});

module.exports = router;