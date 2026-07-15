#!/bin/bash
# ApplicationStop hook for CodeDeploy

echo "Stopping application..."

# Stop application with PM2
if pm2 list | grep -q "crm-backend"; then
    echo "Stopping crm-backend..."
    pm2 stop crm-backend
    pm2 delete crm-backend
fi

echo "Application stopped!"
