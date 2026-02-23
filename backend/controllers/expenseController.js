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

module.exports = { getExpenses, getSummary };
