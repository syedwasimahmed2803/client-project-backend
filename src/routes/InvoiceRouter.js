
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
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Start date for filtering invoices
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: End date for filtering invoices
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
 *                     enum: [pending, paid]
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
    let { startDate, endDate } = req.query;
    const invoice = await InvoiceService.getInvoices(startDate, endDate);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Invoices' });
  }
});

/**
 * @swagger
 * /invoices/{invoiceId}/status:
 *   put:
 *     summary: Update the status of an invoice
 *     tags: [Invoice]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the invoice to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [unpaid, paid]
 *                 description: New status of the invoice
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Invoice status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 invoice:
 *                   type: object
 *       400:
 *         description: Invalid input or bad request
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Server error
 */
// PUT /invoices/:invoiceId/status
router.put('/:id/status', authenticate, authorizeRoles('admin'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user;

  if (!['paid', 'unpaid'].includes(status)) {
    return res.status(400).send({ error: 'Invalid status value' });
  }

  try {
    const updatedInvoice = await InvoiceService.updateInvoiceStatus(id, status, user);
    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json({ message: 'Invoice status updated', invoice: updatedInvoice });
  } catch (error) {
    const message = parseMongoError(error);
    res.status(400).json({ message });
  }
});

module.exports = router;