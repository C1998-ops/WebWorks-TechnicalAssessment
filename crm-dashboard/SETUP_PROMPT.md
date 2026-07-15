# CRM Dashboard Setup - Confident Group

## Project Overview
Create a new CRM dashboard repository for Confident Group by copying essential components from existing Sandwych projects.

## Source Projects
- **Frontend Source**: `d:\sandwych-app\sandwych-web-app` (React + TypeScript + Vite)
- **Backend Source**: `d:\sandwych-app\sandwychweb_laravelBlade` (Laravel)
- **Target**: `E:\Projects\Confident-Group`

## Files to Copy

### From sandwych-web-app (Frontend)
Copy these directories to `E:\Projects\Confident-Group/src/`:
- `components/` - Reusable UI components (buttons, modals, forms, tables, etc.)
- `hooks/` - Custom React hooks (mutations, queries, auth hooks, etc.)
- `lib/` - Library utilities (FormEngine, API utilities)
- `pages/auth/` - Authentication pages (Login, Register, Forgot Password, etc.)

### From sandwychweb_laravelBlade (Backend)
Copy these directories to `E:\Projects\Confident-Group/backend/`:
- `database/migrations/` → `backend/db/migrations/` - Database schema migrations
- `app/Http/Middleware/` → `backend/middleware/` - Laravel middleware (auth, CSRF, etc.)
- `app/Http/Controllers/Auth/` → `backend/auth/controllers/` - Authentication controllers

## Current Status
- ✅ Created crm-dashboard directory (moved to E:\Projects\Confident-Group)
- ⏳ Awaiting manual file copies from user

## Next Steps After Manual Copy
1. Set up basic configuration files:
   - `package.json` - Node.js dependencies
   - `tsconfig.json` - TypeScript configuration
   - `vite.config.js` - Vite build configuration
   - `tailwind.config.js` - Tailwind CSS configuration
   - `.env.example` - Environment variables template

2. Initialize the project:
   - Run `npm install` to install dependencies
   - Configure environment variables
   - Set up database connection for backend

3. Create basic CRM dashboard structure:
   - Lead management pages
   - Dashboard overview
   - Customer management
   - Basic routing setup

## Key Components to Focus On
- Authentication system (login/register/forgot password)
- Reusable UI components from Sandwych
- Custom hooks for API calls and state management
- Database schema for CRM entities (leads, customers, etc.)

## Notes
- Keep the implementation basic and focused on lead CRM dashboard functionality
- Leverage existing Sandwych components to speed up development
- Ensure proper separation of frontend and backend concerns
