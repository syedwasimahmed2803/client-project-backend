
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');
const InvoiceService = require('../services/InvoiceService');


/**
 * @swagger
 * tags:
 *   name: Invoice
 *   description: Invoice management
 */

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Get all Invoices
 *     tags: [Invoice]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all invoices
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
 *                   claimAmount:
 *                     type: string
 *                   caseFee:
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
 *         description: Failed to fetch Invoices
 */
router.get('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const invoice = await InvoiceService.getInvoices();
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Invoices' });
  }
});


module.exports = router;