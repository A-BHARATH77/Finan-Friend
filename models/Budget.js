const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    match: /^\d{4}-(0[1-9]|1[0-2])$/ // Matches YYYY-MM format
  },
  expenseType: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model('Budget', budgetSchema);
