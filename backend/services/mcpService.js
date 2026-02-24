const { spawn } = require('child_process');
const path = require('path');

const callMcpTool = (toolName, toolArgs) => {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    // Parse command and base args from environment
    const commandParts = (process.env.MCP_SERVER_COMMAND || 'python3 mcp-server/mcp_server.py').split(' ');
    const cmd = commandParts[0];
    const baseArgs = commandParts.slice(1);

    // Append tool-specific arguments
    const args = [...baseArgs, toolName, JSON.stringify(toolArgs)];

    const py = spawn(cmd, args);

    let result = '';
    let error = '';

    py.stdout.on('data', (data) => {
      result += data.toString();
    });

    py.stderr.on('data', (data) => {
      error += data.toString();
    });

    py.on('close', (code) => {
      const duration = Date.now() - startTime;
      console.log(`MCP [${toolName}] finished in ${duration}ms`);

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
