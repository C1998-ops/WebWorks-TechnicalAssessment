# LeadCRMManagement

## Environment Setup

This project uses environment variables for configuration. Follow these steps to set up your environment:

### Backend (crm-backend)

1. Copy the example environment file:
   ```bash
   cp crm-backend/.env.example crm-backend/.env
   ```

2. Edit `crm-backend/.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   DB_PATH=./data/crm.db
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

**Important**: Change `JWT_SECRET` to a strong random string in production.

### Frontend (crm-dashboard)

1. Copy the example environment file:
   ```bash
   cp crm-dashboard/.env.example crm-dashboard/.env
   ```

2. Edit `crm-dashboard/.env` with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   ```