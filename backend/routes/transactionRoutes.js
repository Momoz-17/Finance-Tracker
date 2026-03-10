const express = require('express');
const router = express.Router();
const { 
    getTransactions, 
    addTransaction, 
    deleteTransaction 
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// All routes here are protected
router.route('/')
    .get(protect, getTransactions)
    .post(protect, addTransaction);

// Adding the delete route specifically for ID-based requests
router.route('/:id')
    .delete(protect, deleteTransaction);

module.exports = router;