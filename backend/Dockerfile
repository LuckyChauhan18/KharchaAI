FROM node:18

# Install Python
RUN apt-get update && apt-get install -y python3 python3-pip

WORKDIR /app

# Install Node dependencies
COPY backend/package*.json ./
RUN npm install

# Install Python dependencies
COPY mcp-server/requirements.txt ./mcp-requirements.txt
RUN pip3 install --no-cache-dir -r mcp-requirements.txt --break-system-packages

# Copy backend and mcp-server files
COPY backend/ .
COPY mcp-server/ ./mcp-server/

# Adjust MCP_SERVER_COMMAND for Docker environment
# We remove the "conda run" part since we'll run it directly with python3
ENV MCP_SERVER_COMMAND="python3 /app/mcp-server/mcp_server.py"

EXPOSE 5001

CMD ["npm", "run", "start"]
