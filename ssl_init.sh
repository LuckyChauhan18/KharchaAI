#!/bin/bash

# KharchaAi SSL Initializer 🔒
# Usage: ./ssl_init.sh yourdomain.com your@email.com

DOMAIN=$1
EMAIL=$2

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "Usage: ./ssl_init.sh <domain> <email>"
    exit 1
fi

echo "🚀 Starting SSL setup for $DOMAIN..."

# 0. Cleanup any old folder/files
rm -rf nginx.conf

# 1. Update Nginx Config for Challenge
cat <<EOF > nginx.conf
server {
    listen 80;
    server_name $DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}
EOF

# 2. Start/Restart Nginx with the challenge config
echo "⏳ Restarting Nginx to handle the challenge..."
docker-compose up -d frontend

# 3. Create Certbot directories
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# 4. Request Certificate
echo "🔐 Requesting certificate from Let's Encrypt..."
docker-compose run --rm --entrypoint "" certbot certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email $EMAIL --agree-tos --no-eff-email \
    -d $DOMAIN

# 4. Success? Update Nginx to Full HTTPS
if [ -d "./certbot/conf/live/$DOMAIN" ]; then
    echo "✅ Certificate obtained! Switching to HTTPS..."
    
    cat <<EOF > nginx.conf
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:5001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    docker-compose up -d --build
    echo "🕺 KharchaAi is now SECURE at https://$DOMAIN"
else
    echo "❌ Failed to get certificate. Check DNS or try again."
fi
