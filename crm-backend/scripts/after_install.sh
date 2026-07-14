#!/bin/bash
# AfterInstall hook for CodeDeploy

echo "Running AfterInstall hook..."

cd /home/ubuntu/crm-backend

# Install dependencies
echo "Installing dependencies..."
npm ci --production

# Run database migrations if needed
echo "Running database migrations..."
npm run migrate

echo "AfterInstall hook completed!"
