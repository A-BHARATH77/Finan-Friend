const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  expenseType: { type: String, enum: ['food', 'entertainment', 'medical', 'loan', 'other'], required: true },
  description: String,
  date: { type: Date, required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);
