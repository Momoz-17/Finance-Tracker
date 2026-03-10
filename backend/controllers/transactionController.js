const Transaction = require('../models/Transaction');

// @desc    Get all transactions (with filters, sort, pagination)
// @route   GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const { type, startDate, endDate, minAmount, maxAmount, sortBy, order, page = 1, limit = 10 } = req.query;

    // 1. Build Query Object (Ensures user only sees their own data)
    let query = { user: req.user };

    // Filtering by Type
    if (type && type !== 'all') query.type = type;
    
    // Filtering by Date Range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Filtering by Amount Range
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    // 2. Setup Sorting
    const sortField = sortBy || 'date';
    const sortOrder = order === 'asc' ? 1 : -1;

    // 3. Execute with Pagination
    const transactions = await Transaction.find(query)
      .sort({ [sortField]: sortOrder })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination UI
    const count = await Transaction.countDocuments(query);

    res.status(200).json({
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
exports.addTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;

    const transaction = await Transaction.create({
      description,
      amount,
      type,
      category,
      date: date || Date.now(),
      user: req.user // Attached from auth middleware
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    // Check if transaction belongs to user
    if (transaction.user.toString() !== req.user.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();
    res.status(200).json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};