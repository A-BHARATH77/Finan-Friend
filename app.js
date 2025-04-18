const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Transaction = require('./models/Transaction');
const transactionRoutes = require('./routes/transactionRoutes');
const Budget = require('./models/Budget'); // Import the model
const methodOverride = require('method-override');

const app = express();
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://bharath:Bharath123@ac-a2usymo-shard-00-00.nxjqtrx.mongodb.net:27017,ac-a2usymo-shard-00-01.nxjqtrx.mongodb.net:27017,ac-a2usymo-shard-00-02.nxjqtrx.mongodb.net:27017/finanfriend?replicaSet=atlas-k4atr5-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=finwhin');

app.get('/', async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const categoryBreakdown = {};
  transactions.forEach(t => {
    categoryBreakdown[t.expenseType] = (categoryBreakdown[t.expenseType] || 0) + t.amount;
  });
  const recentTransactions = transactions.slice(0, 5);
  const message = req.query.message || null;
  res.render('index', { total, categoryBreakdown, recentTransactions, message });
});

app.get('/transactions', async (req, res) => {
    try {
      const transactions = await Transaction.find().sort({ date: -1 });
      res.render('transactions', { transactions });
    } catch (error) {
      res.status(500).send('Error loading transactions');
    }
  });
  app.get('/chart/category', async (req, res) => {
    try {
      const transactions = await Transaction.find();
  
      const monthlyCategoryData = {};
  
      transactions.forEach(t => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
  
        if (!monthlyCategoryData[month]) {
          monthlyCategoryData[month] = {};
        }
  
        const category = t.expenseType;
        monthlyCategoryData[month][category] = (monthlyCategoryData[month][category] || 0) + t.amount;
      });
  
      res.render('categoryChart', { monthlyCategoryData });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching monthly category data for pie charts' });
    }
  });
  
  app.get('/chart/monthly', async (req, res) => {
    try {
      const transactions = await Transaction.find();
      const budgets = await Budget.find();
  
      let monthlyData = {};
      let categoryMonthlyExpenses = {};
  
      transactions.forEach(t => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
  
        monthlyData[month] = (monthlyData[month] || 0) + t.amount;
  
        const key = `${month}-${t.expenseType}`;
        categoryMonthlyExpenses[key] = (categoryMonthlyExpenses[key] || 0) + t.amount;
      });
  
      let monthlyBudgets = {};
      let categoryMonthlyBudgets = {};
  
      budgets.forEach(b => {
        const monthName = new Date(`${b.month}-01`).toLocaleString('default', { month: 'short', year: 'numeric' });
  
        monthlyBudgets[monthName] = (monthlyBudgets[monthName] || 0) + b.amount;
  
        const key = `${monthName}-${b.expenseType}`;
        categoryMonthlyBudgets[key] = (categoryMonthlyBudgets[key] || 0) + b.amount;
      });
  
      let extraSpending = {};
      for (let key in categoryMonthlyExpenses) {
        const actual = categoryMonthlyExpenses[key];
        const budget = categoryMonthlyBudgets[key] || 0;
        if (actual > budget) {
          extraSpending[key] = actual - budget;
        }
      }
        res.render('monthlyChart', {
          monthlyData,
          monthlyBudgets,
          extraSpending,
          categoryMonthlyExpenses,
          categoryMonthlyBudgets
        });
        
  
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading monthly chart");
    }
  });
  

  app.get('/set-budget', (req, res) => {
    res.render('set-budget');
  });


  app.post('/set-budget', async (req, res) => {
    const selectedMonth = req.body.month; 
    const budgetData = req.body.budget;
  
    await Budget.deleteMany({ month: selectedMonth });
  

    const newBudgets = Object.entries(budgetData).map(([type, amount]) => ({
      month: selectedMonth,
      expenseType: type,
      amount: Number(amount)
    }));
  
    await Budget.insertMany(newBudgets);
    res.redirect('/?message=Monthly%20Budget%20Set%20Successfully');
  });
  
  
app.use('/api', transactionRoutes);

app.listen(3000, () => {
  console.log('Server on http://localhost:3000');
});
