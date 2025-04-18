const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionController');

router.get('/transactions', controller.getAllTransactions);
router.post('/transactions', controller.addTransaction);
router.put('/transactions/:id', controller.editTransaction);
router.delete('/transactions/:id', controller.deleteTransaction);

module.exports = router;
