#!/bin/bash
# KharchaAi AWS Setup Script 🛠️🚀

echo "Starting KharchaAi Server Setup..."

# 1. Update and Install Docker
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose

# 2. Add current user to docker group
sudo usermod -aG docker $USER

# 3. Clone the Repository if missing
if [ ! -d "$HOME/kharcha-ai" ]; then
    echo "Cloning repository..."
    git clone https://github.com/LuckyChauhan18/KharchaAI.git "$HOME/kharcha-ai"
else
    echo "Repository already exists."
fi

# 4. Create .env placeholders
cd "$HOME/kharcha-ai"
touch backend/.env
touch frontend/.env

echo "✅ Setup Complete!"
echo "⚠️  ACTION REQUIRED: Edit the .env files in ~/kharcha-ai/backend and ~/kharcha-ai/frontend"
echo "Then run: docker-compose up -d --build"
echo "Note: You might need to log out and log back in for docker permissions to work."
