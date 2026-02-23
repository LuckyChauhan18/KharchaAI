# AWS Domain & SSL Guide: KharchaAi 🔒🌍

Since you chose **Option 3**, we will set up a custom domain with **HTTPS** on your AWS server. This is the "Pro" way to do it!

## 🏁 Step 1: Get a Domain
You need to buy or use an existing domain (e.g., from Namecheap, GoDaddy, or a free one like Freenom). Let's assume your domain is `yourdomain.com`.

## 📍 Step 2: Configure DNS
Log in to your domain provider's dashboard and add an **A Record**:
- **Type**: `A`
- **Host**: `@` (or leave blank)
- **Value**: `3.80.225.155` (Your AWS IP)
- **TTL**: `Automatic` or `3600`

> [!NOTE]
> It can take 5 to 30 minutes for DNS to "propagate" (update across the internet).

## 🛠️ Step 3: Run the SSL Script
I have created a script called `ssl_init.sh` for you. Once your DNS is ready, run it on your AWS server:

```bash
cd ~/kharcha-ai
# Make it executable
chmod +x ssl_init.sh
# Run it with your domain
./ssl_init.sh yourdomain.com your@email.com
```

## 🔄 Step 4: Auto-Renewal
The script automatically sets up a renewal task. Your site will stay "Secure" forever! 🕺

---
Built with ❤️ by Antigravity AI. 🛋️🚀🔍✨
