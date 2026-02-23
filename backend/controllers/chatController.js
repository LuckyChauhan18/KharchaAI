const { extractExpenseWithAI } = require('../services/aiService');
const { callMcpTool } = require('../services/mcpService');

const handleChat = async (req, res) => {
  const { message } = req.body;
  const user_id = req.user.id;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const aiResult = await extractExpenseWithAI(message);
    const { intent, data: aiData } = aiResult;
    const mcpArgs = { ...aiData, user_id, raw_query: message, access_token: req.token };

    let reply = "";
    let result = null;

    switch (intent) {
      case 'ADD':
        if (!mcpArgs.amount || mcpArgs.amount <= 0) {
          reply = "Theek hai, par kitne rupaye? (Amount specify karein, jaise: '50 rs pizza ke liye')";
          break;
        }
        result = await callMcpTool('add_expense', mcpArgs);
        reply = `Done 👍\nMaine ₹${mcpArgs.amount} ${mcpArgs.category || 'expense'} add kar diya.`;
        break;
      case 'DELETE':
        result = await callMcpTool('delete_expense', mcpArgs);
        reply = `Khatam! 🗑️\n${result.message || 'Related records deleted'}.`;
        break;
      case 'UPDATE':
        result = await callMcpTool('update_expense', mcpArgs);
        reply = `Theek hai! ✍️\n${result.message || 'Record update ho gaya'}.`;
        break;
      case 'QUERY_TOTAL':
        result = await callMcpTool('get_summary', mcpArgs);
        reply = `Aapka ${mcpArgs.period || 'total'} kharch ₹${result.total} hai.`;
        break;
      case 'LIST_RECENT':
        result = await callMcpTool('get_expenses', mcpArgs);
        reply = `Ye rahe aapke haal ke kharche:`;
        break;
      default:
        reply = "Samajh nahi aaya, please thoda saaf likhein.";
    }

    res.json({ reply, data: result, intent });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleChat };
