#!/bin/bash
# BeforeInstall hook for CodeDeploy

echo "Running BeforeInstall hook..."

# Stop the application if it's running
if pm2 list | grep -q "crm-backend"; then
    echo "Stopping existing application..."
    pm2 stop crm-backend
fi

# Backup current installation if it exists
if [ -d "/home/ubuntu/crm-backend" ]; then
    echo "Backing up current installation..."
    cp -r /home/ubuntu/crm-backend /home/ubuntu/crm-backend-backup-$(date +%Y%m%d-%H%M%S)
fi

echo "BeforeInstall hook completed!"
