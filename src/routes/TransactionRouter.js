
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/Auth');
const authorizeRoles = require('../middlewares/RBAC');
const TransactionService = require('../services/TransactionService.js');


router.get('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    let { startDate, endDate, type } = req.query;
    const transaction = await TransactionService.getTransactions(startDate, endDate, type);
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Transactions' });
  }
});

router.post('/', authenticate, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const transaction = await TransactionService.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Transaction' });
  }
});

router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const deletedTransaction = await TransactionService.deleteTransaction(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Transaction' });
  }
});

module.exports = router;