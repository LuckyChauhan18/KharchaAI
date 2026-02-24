const { callMcpTool } = require('../services/mcpService');

const getExpenses = async (req, res) => {
  try {
    const result = await callMcpTool('get_expenses', { user_id: req.user.id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const result = await callMcpTool('get_summary', { user_id: req.user.id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    // Fetch a large enough sample of expenses to build analytics
    const expenses = await callMcpTool('get_expenses', {
      user_id: req.user.id,
      limit: 100,
      access_token: req.token
    });

    if (!expenses || !Array.isArray(expenses)) {
      return res.json({ categoryData: {}, monthlyTrend: {}, totalSpent: 0 });
    }

    const categoryData = {};
    const monthlyTrend = {};
    let totalSpent = 0;

    expenses.forEach(exp => {
      const amount = parseFloat(exp.amount) || 0;
      const category = exp.category || 'misc';
      const date = new Date(exp.created_at);
      const monthYear = date.toLocaleString('default', { month: 'short' });

      // Aggregate by Category
      categoryData[category] = (categoryData[category] || 0) + amount;

      // Aggregate by Month
      monthlyTrend[monthYear] = (monthlyTrend[monthYear] || 0) + amount;

      totalSpent += amount;
    });

    res.json({
      categoryData,
      monthlyTrend,
      totalSpent,
      count: expenses.length
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getExpenses, getSummary, getAnalytics };
