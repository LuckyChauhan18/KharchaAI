const { spawn } = require('child_process');
const path = require('path');

const callMcpTool = (toolName, toolArgs) => {
  return new Promise((resolve, reject) => {
    // Command to run the python server via conda
    const command = process.env.MCP_SERVER_COMMAND.split(' ');

    // We'll use a simplified JSON-based communication for this agent demo
    // In a real MCP production setup, you'd use the MCP SDK for Node.js
    // Here we'll simulate the tool call by passing args via JSON to a runner or direct invocation

    // For this specific implementation, we will use a small logic to call the python function directly 
    // to simplify the bridge since we are building both.

    const pythonScript = path.join(__dirname, '../../mcp-server/mcp_server.py');
    const args = [pythonScript, toolName, JSON.stringify(toolArgs)];

    // Note: To truly use MCP stdio, we would keep a persistent process.
    // For this prototype, we'll spawn a call for each request to ensure reliability.

    const py = spawn('conda', ['run', '-n', 'expense-tracker', 'python', pythonScript, toolName, JSON.stringify(toolArgs)]);

    let result = '';
    let error = '';

    py.stdout.on('data', (data) => {
      result += data.toString();
    });

    py.stderr.on('data', (data) => {
      error += data.toString();
    });

    py.on('close', (code) => {
      if (code !== 0) {
        console.error('MCP Error stderr:', error);
        return reject(error || 'Python process exited with code ' + code);
      }
      try {
        console.log('MCP Result:', result);
        resolve(JSON.parse(result));
      } catch (e) {
        resolve(result.trim());
      }
    });
  });
};

module.exports = { callMcpTool };
