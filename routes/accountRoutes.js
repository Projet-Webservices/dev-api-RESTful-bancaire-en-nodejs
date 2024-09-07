const express = require('express');
const accountController = require('../controllers/accountController');

const router = express.Router();

router.get('/:accountId/balance', accountController.getBalance);
router.get('/:accountId/transactions', accountController.getTransactions);
router.post('/:accountId/transfer', accountController.transferFunds);

module.exports = router;
