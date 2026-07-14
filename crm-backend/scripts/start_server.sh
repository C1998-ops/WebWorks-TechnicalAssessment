#!/bin/bash
# ApplicationStart hook for CodeDeploy

echo "Starting application..."

cd /home/ubuntu/crm-backend

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Start application with PM2
echo "Starting application with PM2..."
pm2 start src/index.js --name crm-backend

# Configure PM2 to start on system boot
pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save

echo "Application started successfully!"
