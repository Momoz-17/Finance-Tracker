const express = require('express');
const router = express.Router();
const { 
    getTransactions, 
    addTransaction, 
    deleteTransaction,
    downloadMonthlyPDF 
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// Base protected collection routes
router.route('/')
    .get(protect, getTransactions)
    .post(protect, addTransaction);

// Specific static route - MUST be placed before the dynamic /:id route
router.route('/archive/download')
    .get(protect, downloadMonthlyPDF);

// Dynamic parameter route
router.route('/:id')
    .delete(protect, deleteTransaction);

module.exports = router;