const express = require('express');
const router = express.Router();
const UtilityService = require('../services/UtilityService');
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');


/**
 * @swagger
 * tags:
 *   name: Utility
 *   description: Utility and helper APIs
 */

/**
 * @swagger
 * /utils/dropdown-data:
 *   get:
 *     summary: Fetch dropdown data for providers, hospitals, and clients
 *     tags: [Utility]
 *     parameters:
 *       - $ref: '#/components/parameters/XForwardedFor'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns lists of providers, hospitals, and clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 providers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 665e9f1b4373c8845ce96331
 *                       name:
 *                         type: string
 *                         example: Provider A
 *                 hospitals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 665e9f1b4373c8845ce96333
 *                       name:
 *                         type: string
 *                         example: Hospital B
 *                 clients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 665e9f1b4373c8845ce96332
 *                       name:
 *                         type: string
 *                         example: Client C
 *       500:
 *         description: Failed to fetch dropdown data
 */

router.get('/dropdown-data', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const data = await UtilityService.fetchAllEntityNames();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dropdown data' });
  }
});

module.exports = router;
