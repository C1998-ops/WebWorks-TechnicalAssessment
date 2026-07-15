#!/bin/bash

# EC2 Deployment Script for CRM Backend
# This script deploys the backend to an EC2 instance

set -e

# Configuration
EC2_USER="${EC2_USER:-ubuntu}"
EC2_HOST="${EC2_HOST}"
EC2_KEY_PATH="${EC2_KEY_PATH:-~/.ssh/ec2_key.pem}"
APP_DIR="/home/${EC2_USER}/crm-backend"
PM2_APP_NAME="crm-backend"

echo "Starting deployment to EC2..."

# Check if required variables are set
if [ -z "$EC2_HOST" ]; then
    echo "Error: EC2_HOST environment variable is not set"
    exit 1
fi

# Create app directory on EC2
echo "Creating application directory on EC2..."
ssh -i "$EC2_KEY_PATH" -o StrictHostKeyChecking=no "${EC2_USER}@${EC2_HOST}" "mkdir -p ${APP_DIR}"

# Copy files to EC2
echo "Copying files to EC2..."
scp -i "$EC2_KEY_PATH" -o StrictHostKeyChecking=no -r ./* "${EC2_USER}@${EC2_HOST}:${APP_DIR}/"

# Install dependencies and restart application on EC2
echo "Installing dependencies and restarting application..."
ssh -i "$EC2_KEY_PATH" -o StrictHostKeyChecking=no "${EC2_USER}@${EC2_HOST}" << EOF
    cd ${APP_DIR}
    
    # Install dependencies
    npm ci --production
    
    # Run database migrations if needed
    # npm run migrate
    
    # Install PM2 globally if not installed
    if ! command -v pm2 &> /dev/null; then
        npm install -g pm2
    fi
    
    # Start/restart application with PM2
    pm2 restart ${PM2_APP_NAME} || pm2 start src/index.js --name ${PM2_APP_NAME}
    
    # Configure PM2 to start on system boot
    pm2 startup systemd -u ${EC2_USER} --hp /home/${EC2_USER}
    pm2 save
    
    echo "Deployment completed successfully!"
EOF

echo "Deployment to EC2 completed!"
