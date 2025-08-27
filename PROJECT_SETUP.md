# VITAL Multi-Tenant SaaS Project Setup Guide

## Project Overview

This is a multi-tenant SaaS application that has been restructured from a shared architecture to a fully isolated per-tenant architecture. Each tenant now has:
- Their own frontend application
- Their own backend server  
- Their own isolated database
- Their own port allocation

## Project Structure

```
VITAL-COPY/
├── backend/                    # Main admin backend (PORT: 3010)
├── frontend/                   # Main admin frontend (PORT: 3000)
├── scripts/
│   └── generateTenantSite.js  # Tenant site generator
└── sites/                     # Tenant-specific sites
    ├── mysass/
    │   ├── backend/           # MySaaS tenant backend (PORT: 3054)
    │   └── frontend/          # MySaaS tenant frontend
    └── robi/
        ├── backend/           # Robi tenant backend (PORT: 3108)
        └── frontend/          # Robi tenant frontend
```

## How to Run the Project

### 1. Start MongoDB
Ensure MongoDB is running on your system:
```bash
# Start MongoDB service
mongod
```

### 2. Start Main Admin Backend
```bash
cd "C:\Users\badal\Desktop\VITAL - Copy\backend"
PORT=3010 npm start
```
- **Port**: 3010
- **Purpose**: Admin dashboard and tenant registration
- **Database**: Main database for user authentication and tenant management

### 3. Start Tenant Backend Servers

#### MySaaS Tenant Backend
```bash
cd "C:\Users\badal\Desktop\VITAL - Copy\sites\mysass\backend"
npm start
```
- **Port**: 3054
- **Database**: tenant_mysass
- **Tenant**: MySaaS (mysass)

#### Robi Tenant Backend  
```bash
cd "C:\Users\badal\Desktop\VITAL - Copy\sites\robi\backend"
npm start
```
- **Port**: 3108
- **Database**: tenant_robi
- **Tenant**: Robi Store (robi)

### 4. Start Frontend Applications (when ready)

#### Main Admin Frontend
```bash
cd "C:\Users\badal\Desktop\VITAL - Copy\frontend"
npm start
```
- **Port**: 3000
- **Purpose**: Admin dashboard

#### Tenant Frontend Applications (when dependencies are installed)
```bash
# MySaaS Frontend
cd "C:\Users\badal\Desktop\VITAL - Copy\sites\mysass\frontend"
npm start

# Robi Frontend  
cd "C:\Users\badal\Desktop\VITAL - Copy\sites\robi\frontend"
npm start
```

## API Routing

### Main Backend APIs (Port 3010)
- `POST /api/auth/register` - Register new users/tenants
- `POST /api/auth/login` - User login with tenant redirection
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Tenant-Specific APIs

#### MySaaS Backend (Port 3054)
- `GET /health` - Health check
- `GET /api/settings` - Get tenant settings
- `PUT /api/settings` - Update tenant settings
- `GET /api/settings/public` - Get public website data
- `GET /api/pages` - Get all pages
- `GET /api/pages/:pageType` - Get specific page
- `POST /api/pages/:pageType` - Create/update page
- `PUT /api/pages/:pageType` - Update page
- `DELETE /api/pages/:pageType` - Delete page

#### Robi Backend (Port 3108)
Same API structure as MySaaS but with robi tenant data.

## Existing Tenant Credentials

### MySaaS Tenant
- **Email**: admin@mysass.com
- **Password**: mysass123
- **Backend URL**: http://localhost:3054
- **Database**: tenant_mysass

### Robi Tenant
- **Email**: robikhan12@gmail.com  
- **Password**: robikhan12
- **Backend URL**: http://localhost:3108
- **Database**: tenant_robi

## Authentication Flow

1. **Admin Users**: Login through main backend and access admin dashboard
2. **Tenant Users**: Login through main backend → automatically redirected to their tenant-specific site
3. **New Tenant Registration**: Automatically generates new tenant site with isolated backend/frontend/database

## Port Allocation System

Tenant ports are calculated using a hash-based algorithm:
```javascript
function getPortOffset(subdomain) {
  let hash = 0;
  for (let i = 0; i < subdomain.length; i++) {
    const char = subdomain.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 100;
}
// Final port = 3040 + offset
```

## Database Configuration

- **Main Database**: `vital_saas` - Stores user authentication and tenant records
- **Tenant Databases**: `tenant_{subdomain}` - Each tenant has isolated database
- **Connection**: MongoDB on localhost:27017

## Health Check Endpoints

- Main Backend: `http://localhost:3010/health`
- MySaaS Backend: `http://localhost:3054/health`  
- Robi Backend: `http://localhost:3108/health`

## Environment Variables

Each tenant backend has its own `.env` file with:
- `PORT` - Unique port for the tenant
- `DATABASE_NAME` - Tenant-specific database name
- `TENANT_SUBDOMAIN` - Tenant subdomain identifier
- `JWT_SECRET` - Tenant-specific JWT secret
- `SESSION_SECRET` - Session secret
- `GOOGLE_CLIENT_ID` - Google OAuth credentials
- `GOOGLE_CLIENT_SECRET` - Google OAuth credentials

## Creating New Tenants

New tenants are automatically created when users register with `role: 'tenant'`:

```javascript
// Registration creates:
// 1. Tenant record in main database
// 2. User account linked to tenant
// 3. Auto-generates tenant site (backend + frontend)
// 4. Creates tenant-specific database
// 5. Returns redirect URL to tenant site
```

## Architecture Benefits

1. **Complete Isolation**: Each tenant has separate code, database, and resources
2. **Scalability**: Individual tenant sites can be scaled independently  
3. **Customization**: Each tenant can have completely different frontend/backend logic
4. **Security**: No data leakage between tenants - complete separation
5. **Maintenance**: Issues with one tenant don't affect others

## Next Steps

1. Complete frontend dependencies installation for tenant sites
2. Test full authentication flow with frontend
3. Implement tenant-specific customizations
4. Add tenant management features to admin dashboard
5. Set up production deployment strategy