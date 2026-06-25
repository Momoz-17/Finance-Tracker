const Transaction = require('../models/Transaction');
const PDFDocument = require('pdfkit');

// @desc    Get all transactions (with filters, sort, pagination)
// @route   GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { type, startDate, endDate, minAmount, maxAmount, sortBy, order, page = 1, limit = 10 } = req.query;

    let query = { user: req.user._id }; 

    if (type && type !== 'all') query.type = type;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    const sortField = sortBy || 'date';
    const sortOrder = order === 'asc' ? 1 : -1;

    const transactions = await Transaction.find(query)
      .sort({ [sortField]: sortOrder })
      .limit(limit * 1)
      .skip((page - 1) * limit);

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
const addTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;

    const transaction = await Transaction.create({
      description,
      amount,
      type,
      category,
      date: date || Date.now(),
      user: req.user._id 
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();
    res.status(200).json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Compile and Download Monthly Ledger Report PDF
// @route   GET /api/transactions/archive/download
const downloadMonthlyPDF = async (req, res) => {
  try {
    const { month, year } = req.query; 
    if (!month || !year) {
      return res.status(400).json({ message: "Month and Year parameters are required." });
    }

    const startOfMonth = new Date(year, parseInt(month) - 1, 1);
    const endOfMonth = new Date(year, parseInt(month), 0, 23, 59, 59, 999);

    // Fetch all records within targeted month for authenticated user
    const transactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ date: 1 });

    const monthName = startOfMonth.toLocaleString('default', { month: 'long' });

    // Build PDF Stream Layout
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Statement_${monthName}_${year}.pdf`);
    doc.pipe(res);

    // Header Meta Template Design
    doc.fillColor('#4f46e5').fontSize(24).text('FINANCE TRACKER', { align: 'left' });
    doc.fillColor('#64748b').fontSize(10).text(`Statement Period: ${monthName} ${year}`, { align: 'left' });
    doc.moveDown(2);

    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach(t => {
      if (t.type === 'income') incomeTotal += t.amount;
      else expenseTotal += t.amount;
    });

    // Summary Metric Balance Cards Layout
    doc.fillColor('#0f172a').fontSize(14).text('Account Summary Card', { underline: true });
    doc.fontSize(11).text(`Total Credited (Income): INR ${incomeTotal.toLocaleString()}`);
    doc.text(`Total Debited (Expenses): INR ${expenseTotal.toLocaleString()}`);
    doc.text(`Net Monthly Savings: INR ${(incomeTotal - expenseTotal).toLocaleString()}`);
    doc.moveDown(2);

    // Ledger Table Columns Line Header
    doc.fillColor('#1e293b').fontSize(12).text('Detailed Transaction History Ledger', { bold: true });
    doc.moveDown();
    
    const tableTop = doc.y;
    doc.fontSize(10).text('Date', 50, tableTop, { bold: true });
    doc.text('Description', 130, tableTop, { bold: true });
    doc.text('Category', 280, tableTop, { bold: true });
    doc.text('Type', 380, tableTop, { bold: true });
    doc.text('Amount (INR)', 480, tableTop, { align: 'right', bold: true });
    
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#e2e8f0').stroke();

    let currentY = tableTop + 25;
    transactions.forEach(t => {
      // Check to trigger automatic new page calculation bounds
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }

      const formattedDate = new Date(t.date).toLocaleDateString();
      doc.fillColor('#475569')
         .text(formattedDate, 50, currentY)
         .text(t.description, 130, currentY, { width: 140, ellipsis: true })
         .text(t.category, 280, currentY)
         .fillColor(t.type === 'income' ? '#10b981' : '#f43f5e')
         .text(t.type.toUpperCase(), 380, currentY)
         .text(`${t.type === 'income' ? '+' : '-'} ${t.amount.toLocaleString()}`, 480, currentY, { align: 'right' });

      currentY += 25;
    });

    doc.end();
  } catch (error) {
    console.error("PDF generation failure:", error);
    res.status(500).json({ message: "Could not generate transaction statement file output pipeline." });
  }
};

// Standardized structure object exports
module.exports = {
  getTransactions,
  addTransaction,
  deleteTransaction,
  downloadMonthlyPDF
};