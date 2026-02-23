# AWS Deployment Plan: KharchaAi ☁️📦

This plan details how to deploy **KharchaAi** to an AWS EC2 `t2.micro` instance.

## ⚖️ Is `t2.micro` enough?
**Yes.** For a personal expense tracker or small-scale use, a `t2.micro` (1 vCPU, 1GB RAM) is sufficient because:
- **Builds are pre-done**: The frontend is served as static files via Nginx (very light).
- **Node.js**: The backend is efficient.
- **Python Bridge**: While Python uses more RAM, spawning it per-request on a single-user basis fits within 1GB.

> [!TIP]
> If you notice the server slowing down during AI processing, consider adding a **2GB Swap File** on the Linux instance to give it extra "breathing room."

---

## 🛠️ Step 1: EC2 Instance Setup
1.  **AMI**: Choose `Ubuntu 22.04 LTS` (Free Tier eligible).
2.  **Instance Type**: `t2.micro`.
3.  **Security Group**: Add these Inbound Rules:
    - **SSH**: Port 22 (Your IP).
    - **HTTP**: Port 80 (Anywhere 0.0.0.0/0).
    - **Custom TCP**: Port 5001 (Anywhere - required if you don't use the Nginx proxy, though we recommend port 80).

---

## 🏗️ Step 2: Server Provisioning
Once you SSH into your server, run these commands:

```bash
# Update System
sudo apt update && sudo apt upgrade -y

# Install Docker & Docker Compose
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker

# Give your user docker permissions (log out and back in after this)
sudo usermod -aG docker $USER
```

---

## 🚀 Step 3: Deployment Flow

1.  **Clone Repository**:
    ```bash
    git clone https://github.com/your-username/kharcha-ai.git
    cd kharcha-ai
    ```

2.  **Configure Environments**:
    Create `.env` files in `backend/` and `frontend/` (copy from your local machine). 
    > [!IMPORTANT]
    > Ensure `backend/.env` has `MCP_SERVER_COMMAND=python3 /app/mcp-server/mcp_server.py`.

3.  **Launch**:
    ```bash
    # Run in detached mode
    docker-compose up -d --build
    ```

---

## 🧪 Step 4: Verification
1.  Go to your **AWS Public IPv4 Address** in your browser.
2.  Check if the login page appears.
3.  Test a voice command to ensure the Node-Python bridge is healthy.

---

## 🛡️ Best Practices for AWS
- **Automated Restarts**: `docker-compose.yml` is already configured with `restart: always`. If the instance reboots, your app starts automatically.
- **Logs**: Use `docker-compose logs -f --tail=100` to debug if things crash.
- **IP Address**: If you restart the instance, your IP might change. Consider attaching an **Elastic IP** if this is for permanent use.

---
Built with ❤️ by Antigravity AI for Lucky. 🛋️🚀🔍✨
