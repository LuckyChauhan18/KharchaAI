const express = require('express');
const router = express.Router();
const { getExpenses, getSummary } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getExpenses);
router.get('/summary', authMiddleware, getSummary);

module.exports = router;
