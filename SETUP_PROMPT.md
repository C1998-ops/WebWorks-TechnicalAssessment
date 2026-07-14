# CRM Dashboard Setup

## Project Overview
Create a new CRM dashboard repository by copying essential components from existing Sandwych projects.

**Current Requirements:**
- Dashboard interface
- Login/Registration functionality
- Layout components
- Creator Management


#### components/ - Reusable UI components
**KEEP ONLY:**
- Basic UI components: Button, Modal, Input, Table, Form components
- Layout components: Header, Sidebar, Footer, PageWrapper
- Common components: Loader, Toast, SearchBar

#### hooks/ - Custom React hooks
**KEEP ONLY:**
- Basic hooks: useFetch, useLoading, useToast
- Auth hooks: useUserInfo, useAuth
- General utility hooks

#### lib/ - Library utilities
**KEEP ONLY:**
- Basic API utilities
- Form utilities (if needed for CRM)


#### pages/auth/ - Authentication pages
**KEEP ONLY:**
- Login.tsx
- Register.tsx
- ForgotPassword.tsx (if needed)

#### database/migrations/ → backend/db/migrations/
**KEEP ONLY:**
- User-related migrations (users, roles, permissions)
- Basic CRM migrations (leads, customers, contacts)

#### app/Http/Middleware/ → backend/middleware/
**KEEP ONLY:**
- Basic auth middleware (Authenticate.php)
- Basic middleware (TrimStrings, TrustProxies, etc.)


#### app/Http/Controllers/Auth/ → backend/auth/controllers/
**KEEP ONLY:**
- Basic auth controllers (LoginController, RegisterController, ForgotPasswordController)

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
   - Dashboard overview page
   - Lead management pages
   - Customer management pages
   - Basic routing setup

## Key Components to Focus On
- Authentication system (login/register/forgot password)
- Basic reusable UI components from Sandwych
- Custom hooks for API calls and state management
- Database schema for CRM entities (leads, customers, etc.)
- Layout components (header, sidebar, footer)

## Notes
- Keep the implementation basic and focused on lead CRM dashboard functionality
- Leverage reusable components to speed up development
- Ensure proper separation of frontend and backend concerns
- Focus on generic CRM functionality that can be adapted 
