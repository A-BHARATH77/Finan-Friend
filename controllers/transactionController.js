const Transaction = require('../models/Transaction');

exports.getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  res.json(transactions);
};

exports.addTransaction = async (req, res) => {
  try {
    const {   amount, expenseType, description, date } = req.body;
    const transaction = new Transaction({amount, expenseType, description, date });
    await transaction.save();
    res.redirect('/?message=Transaction%20added%20successfully');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.status(200).json({ message: "Transaction updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.editTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Transaction.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.redirect('/transactions?message=Transaction%20Deleted%20successfully');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
