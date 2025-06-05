
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

router.put('/:id/status', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
    const { status, remark } = req.body;
    const { id } = req.params;

    if (!['approve', 'reject'].includes(status)) {
        return res.status(400).send({ error: 'Invalid status value' });
    }

    try {
        const finance = await FinanceService.updateFinanceStatus(id, status, remark);
        res.status(200).json(finance);
    } catch (error) {
        const message = parseMongoError(error);
        res.status(400).json({ message });
    }
});

module.exports = router;