# Login Credentials - VITAL SaaS Platform

All passwords have been reset to: **tenant1234**

---

## 1. Admin Panel (Main Application)

### Access URLs
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3002
- **Login Page**: http://localhost:3001/signin

### Admin Credentials
```
Email: admin@vital.com
Password: tenant1234
Role: Admin
```

**What you can do:**
- Manage all tenants
- View all users across tenants
- Access analytics and subscriptions
- Manage tenant websites

---

## 2. Tenant Users (Login to Main Admin Panel)

These users can log into the main admin panel (http://localhost:3000/signin):

| Email | Password | Domain | Tenant Name |
|-------|----------|--------|-------------|
| tenant@mysass.com | tenant1234 | mysass | MySaaS |
| tenant@apple.com | tenant1234 | apple | Apple |
| tenant@robi.com | tenant1234 | robi | Robi |
| tenant@webstore.com | tenant1234 | webstore | Webstore |
| tenant@newteststore123.com | tenant1234 | newteststore123 | New Test Store |
| tenant@themetest123.com | tenant1234 | themetest123 | Theme Test |

**After login**, tenants get redirected to their own site dashboards.

---

## 3. Tenant Dashboards (Separate Dashboard for Each Tenant)

Each tenant has their own separate backend/frontend in the `sites/` folder.

### MySaaS Tenant Dashboard

**Access URLs:**
- **Frontend**: http://localhost:3074
- **Backend**: http://localhost:3054
- **Login Page**: http://localhost:3074/login (or /signin)
- **Database**: tenant_mysass

**Dashboard Admin Credentials:**
```
Email: admin@admin.com
Password: tenant1234
Role: super_admin
```

**What you can do:**
- Manage MySaaS tenant site content
- Manage pages, settings, analytics
- Control MySaaS-specific features

---

### Other Tenant Dashboards

Each tenant in the `sites/` folder should have its own dashboard:

| Tenant | Frontend Port | Backend Port | Database |
|--------|---------------|--------------|----------|
| mysass | 3074 | 3054 | tenant_mysass |
| apple | TBD | TBD | tenant_apple |
| robi | TBD | TBD | tenant_robi |
| webstore | TBD | TBD | tenant_webstore |
| newteststore123 | TBD | TBD | tenant_newteststore123 |
| themetest123 | TBD | TBD | tenant_themetest123 |

**Note**: If admin_users collection doesn't exist for other tenants, you may need to create admin users for their dashboards.

---

## Starting the Servers

### Main Admin Panel
```bash
# Backend
cd backend
npm install
npm start    # or: node server.js

# Frontend
cd frontend
npm install
npm start
```

### MySaaS Tenant Dashboard
```bash
# Backend
cd sites/mysass/backend
npm install
npm start    # or: PORT=3054 node server.js

# Frontend
cd sites/mysass/frontend
npm install
npm start    # or: PORT=3074 npm start
```

---

## Troubleshooting

### Can't login to Admin Panel?
1. Make sure backend is running on port 3002
2. Check frontend API config (frontend/src/services/api.js - should point to correct backend)
3. Try: admin@vital.com / tenant1234

### Can't login to Tenant Dashboard (mysass)?
1. Make sure mysass backend is running on port 3054
2. Make sure mysass frontend is running on port 3074
3. Try: admin@admin.com / tenant1234
4. Check sites/mysass/frontend/src/services/api.js - should point to http://localhost:3054

### Need to reset password again?
```bash
cd backend
node scripts/reset-passwords.js
```

### Create new admin user for a tenant dashboard?
Use the admin-users API endpoint or create directly in the tenant database.

---

## Database Information

**MongoDB Connection**: mongodb://localhost:27017

**Main Database**: multi_tenant_saas
- Collections: users, tenants, subscriptions, analytics

**Tenant Databases**:
- tenant_mysass (active)
- tenant_apple
- tenant_robi
- tenant_webstore
- tenant_newteststore123
- tenant_themetest123

---

## API Endpoints

### Admin Panel Auth
- POST http://localhost:3002/api/auth/login
- POST http://localhost:3002/api/auth/admin/login
- POST http://localhost:3002/api/auth/register

### MySaaS Tenant Auth
- POST http://localhost:3054/api/auth/login
- GET http://localhost:3054/health

---

**Last Updated**: 2025-10-16
**Password**: tenant1234 (for all users)
