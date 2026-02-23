const axios = require('axios');

const extractExpenseWithAI = async (text) => {
  try {
    const response = await axios.post('https://api.sarvam.ai/v1/chat/completions', {
      model: 'sarvam-m',
      messages: [
        {
          role: 'system',
          content: `You are an AI Expense Assistant. Detect the user's intent and extract data.
          
Intents:
- ADD: user records a NEW expense. MUST have an amount. Ex: "Spent 50 on tea"
- DELETE: user removes an expense. Ex: "Delete that coffee entry"
- UPDATE: user changes an entry. Ex: "Tea was 60 not 50"
- QUERY_TOTAL: user asks FOR a summary or sum. Key words: "total", "hisab", "kitna kharch". Ex: "Total for today", "How much spent on food?"
- LIST_RECENT: user asks to see history. Ex: "Show my expenses"

Rules:
1. If the user asks for a "total", "summary", or "hisab", use QUERY_TOTAL.
2. If no amount is mentioned and it's not a QUERY/DELETE, ask for clarification (default to a safe response).

Return ONLY JSON:
{
  "intent": "ADD" | "DELETE" | "UPDATE" | "QUERY_TOTAL" | "LIST_RECENT",
  "data": {
    "amount": number,
    "category": string,
    "description": string,
    "period": "today" | "month" | "year" | "total",
    "limit": number
  },
  "sql_hint": "debugging info"
}`
        },
        { role: 'user', content: text }
      ],
    }, {
      headers: {
        'api-subscription-key': process.env.SARVAM_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    const result = JSON.parse(content.match(/\{.*\}/s)[0]);
    console.log('AI Query Generation:', result.sql_hint); // Showing how it makes the query
    return result;
  } catch (error) {
    console.error('AI Extraction Error:', error.response?.data || error.message);
    const amountMatch = text.match(/\d+/);
    return {
      intent: amountMatch ? 'ADD' : 'LIST_RECENT',
      data: {
        amount: amountMatch ? parseInt(amountMatch[0]) : 0,
        category: 'misc',
        description: text
      }
    };
  }
};

module.exports = { extractExpenseWithAI };
