const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class TenantSiteGenerator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.sitesDir = path.join(projectRoot, 'sites');
    this.templateBackendDir = path.join(projectRoot, 'backend');
    this.templateFrontendDir = path.join(projectRoot, 'frontend');
  }

  // Generate unique theme for tenant based on subdomain
  generateTenantTheme(subdomain, tenantName) {
    const themes = [
      {
        name: 'Ocean Blue',
        primary: '#0ea5e9',
        secondary: '#0284c7',
        accent: '#38bdf8',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        textColor: '#ffffff'
      },
      {
        name: 'Forest Green',
        primary: '#10b981',
        secondary: '#059669',
        accent: '#34d399',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        textColor: '#ffffff'
      },
      {
        name: 'Sunset Orange',
        primary: '#f59e0b',
        secondary: '#d97706',
        accent: '#fbbf24',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        textColor: '#ffffff'
      },
      {
        name: 'Royal Purple',
        primary: '#8b5cf6',
        secondary: '#7c3aed',
        accent: '#a78bfa',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        textColor: '#ffffff'
      },
      {
        name: 'Rose Pink',
        primary: '#ec4899',
        secondary: '#db2777',
        accent: '#f472b6',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        textColor: '#ffffff'
      },
      {
        name: 'Emerald Teal',
        primary: '#06b6d4',
        secondary: '#0891b2',
        accent: '#22d3ee',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        textColor: '#ffffff'
      },
      {
        name: 'Crimson Red',
        primary: '#ef4444',
        secondary: '#dc2626',
        accent: '#f87171',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        textColor: '#ffffff'
      },
      {
        name: 'Golden Yellow',
        primary: '#eab308',
        secondary: '#ca8a04',
        accent: '#facc15',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        textColor: '#ffffff'
      }
    ];

    // Generate consistent theme index based on subdomain
    let hash = 0;
    for (let i = 0; i < subdomain.length; i++) {
      const char = subdomain.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const themeIndex = Math.abs(hash) % themes.length;
    const selectedTheme = themes[themeIndex];
    
    console.log(`🎨 Generated theme "${selectedTheme.name}" for ${tenantName}`);
    return selectedTheme;
  }

  async generateSite(tenantData) {
    const { subdomain, name, database_name } = tenantData;
    const siteDir = path.join(this.sitesDir, subdomain);
    const backendDir = path.join(siteDir, 'backend');
    const frontendDir = path.join(siteDir, 'frontend');

    console.log(`Generating site for tenant: ${name} (${subdomain})`);

    try {
      // Generate unique theme for this tenant
      const theme = this.generateTenantTheme(subdomain, name);
      
      // Create site directory structure
      await fs.ensureDir(siteDir);
      await fs.ensureDir(backendDir);
      await fs.ensureDir(frontendDir);

      // Copy and customize backend
      await this.setupBackend(backendDir, tenantData);
      
      // Copy and customize frontend
      await this.setupFrontend(frontendDir, tenantData, theme);

      console.log(`✅ Site generated successfully at: ${siteDir}`);
      return siteDir;
    } catch (error) {
      console.error(`❌ Error generating site for ${subdomain}:`, error);
      throw error;
    }
  }

  async setupBackend(backendDir, tenantData) {
    const { subdomain, database_name } = tenantData;
    
    // Copy backend template
    await fs.copy(this.templateBackendDir, backendDir, {
      filter: (src) => {
        // Exclude node_modules and other unnecessary files
        return !src.includes('node_modules') && 
               !src.includes('.env') &&
               !src.includes('package-lock.json');
      }
    });

    // Create tenant-specific .env file
    const envContent = `
# Tenant: ${tenantData.name} (${subdomain})
NODE_ENV=development
PORT=${3020 + this.getPortOffset(subdomain)}
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=${database_name}
JWT_SECRET=your_jwt_secret_key_here_${subdomain}
SESSION_SECRET=your_session_secret_here_${subdomain}

# Tenant Configuration
TENANT_SUBDOMAIN=${subdomain}
TENANT_DATABASE=${database_name}
`.trim();

    await fs.writeFile(path.join(backendDir, '.env'), envContent);

    // Create tenant-specific server configuration
    const serverConfigContent = `
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || ${3020 + this.getPortOffset(subdomain)};

// Tenant-specific CORS configuration
app.use(cors({
  origin: [
    'http://localhost:${3040 + this.getPortOffset(subdomain)}', // Tenant frontend
    'http://localhost:3004' // Main frontend (for development)
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tenant-specific routes
const authRoutes = require('./routes/auth');
const tenantPageRoutes = require('./routes/tenantPages');
const tenantSettingsRoutes = require('./routes/tenantSettings');

app.use('/api/auth', authRoutes);
app.use('/api/pages', tenantPageRoutes);
app.use('/api/settings', tenantSettingsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    tenant: '${subdomain}',
    database: '${database_name}',
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(\`🚀 Tenant "${subdomain}" backend running on http://localhost:\${PORT}\`);
      console.log(\`📊 Database: ${database_name}\`);
      console.log(\`🔗 Health check: http://localhost:\${PORT}/health\`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
`.trim();

    await fs.writeFile(path.join(backendDir, 'server.js'), serverConfigContent);
    
    // Update package.json with tenant-specific name
    const packageJsonPath = path.join(backendDir, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = `${subdomain}-backend`;
      packageJson.description = `Backend for ${tenantData.name} tenant`;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    console.log(`✅ Backend setup complete for ${subdomain}`);
  }

  async setupFrontend(frontendDir, tenantData, theme) {
    const { subdomain, name } = tenantData;
    
    // Copy frontend template
    await fs.copy(this.templateFrontendDir, frontendDir, {
      filter: (src) => {
        // Exclude node_modules and build directories
        return !src.includes('node_modules') && 
               !src.includes('build') &&
               !src.includes('package-lock.json');
      }
    });

    // Create tenant-specific .env file
    const envContent = `
# Tenant: ${name} (${subdomain})
PORT=${3040 + this.getPortOffset(subdomain)}
REACT_APP_API_URL=http://localhost:${3020 + this.getPortOffset(subdomain)}
REACT_APP_TENANT_NAME=${name}
REACT_APP_TENANT_SUBDOMAIN=${subdomain}
GENERATE_SOURCEMAP=false
`.trim();

    await fs.writeFile(path.join(frontendDir, '.env'), envContent);

    // Update package.json with tenant-specific name
    const packageJsonPath = path.join(frontendDir, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = `${subdomain}-frontend`;
      packageJson.description = `Frontend for ${name}`;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    // Create tenant-specific API configuration
    const apiConfigContent = `
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:${3020 + this.getPortOffset(subdomain)}';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
`.trim();

    await fs.writeFile(path.join(frontendDir, 'src', 'services', 'api.js'), apiConfigContent);

    // Generate custom theme CSS for this tenant
    await this.generateCustomThemeCSS(frontendDir, theme, subdomain);

    console.log(`✅ Frontend setup complete for ${subdomain}`);
  }

  // Generate custom theme CSS file for tenant
  async generateCustomThemeCSS(frontendDir, theme, subdomain) {
    const customCss = `/* Custom Theme for ${subdomain} - ${theme.name} */
:root {
  --primary-color: ${theme.primary};
  --secondary-color: ${theme.secondary};
  --accent-color: ${theme.accent};
  --text-color: ${theme.textColor};
  --bg-gradient: ${theme.background};
}

/* Override tenant background */
.tenant-bg-shapes {
  background: var(--bg-gradient) !important;
}

/* Custom tenant colors */
.tenant-shape {
  background: linear-gradient(45deg, var(--primary-color), transparent) !important;
}

.tenant-logo-placeholder {
  border-color: var(--primary-color) !important;
}

.tenant-nav-link:hover {
  color: var(--primary-color) !important;
}

.tenant-mobile-nav-link:hover {
  color: var(--primary-color) !important;
}

.tenant-hero-content .highlight {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color)) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.tenant-cta-button {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)) !important;
}

.tenant-cta-button:hover {
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color)) !important;
}

.tenant-cta-secondary:hover {
  border-color: var(--primary-color) !important;
}

.tenant-feature-icon {
  background: var(--primary-color) !important;
  opacity: 0.2 !important;
  border: 2px solid var(--primary-color) !important;
}

.tenant-glass-green {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)) !important;
  opacity: 0.1 !important;
  border: 1px solid var(--primary-color) !important;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .tenant-hero-content .highlight {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color)) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
  }
}
`;

    // Write the custom theme CSS file
    const stylesDir = path.join(frontendDir, 'src', 'styles');
    await fs.ensureDir(stylesDir);
    await fs.writeFile(path.join(stylesDir, 'theme.css'), customCss);
    
    // Also update the tenant.css file to import the theme
    const tenantCssPath = path.join(stylesDir, 'tenant.css');
    if (await fs.pathExists(tenantCssPath)) {
      let tenantCss = await fs.readFile(tenantCssPath, 'utf8');
      
      // Add import for theme.css at the top
      const importStatement = '@import "./theme.css";\n\n';
      if (!tenantCss.includes('@import "./theme.css"')) {
        tenantCss = importStatement + tenantCss;
        await fs.writeFile(tenantCssPath, tenantCss);
      }
    }
    
    console.log(`🎨 Generated custom theme CSS for ${subdomain} (${theme.name})`);
  }

  getPortOffset(subdomain) {
    // Generate a consistent port offset based on subdomain
    let hash = 0;
    for (let i = 0; i < subdomain.length; i++) {
      const char = subdomain.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100; // Return 0-99 offset
  }
}

module.exports = TenantSiteGenerator;

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log('Usage: node generateTenantSite.js <subdomain> <name> <database_name>');
    process.exit(1);
  }

  const [subdomain, name, database_name] = args;
  const generator = new TenantSiteGenerator(path.join(__dirname, '..'));
  
  generator.generateSite({ subdomain, name, database_name })
    .then((siteDir) => {
      console.log(`\n🎉 Tenant site generated successfully!`);
      console.log(`📁 Location: ${siteDir}`);
      console.log(`\nNext steps:`);
      console.log(`1. cd ${path.join(siteDir, 'backend')} && npm install`);
      console.log(`2. cd ${path.join(siteDir, 'frontend')} && npm install`);
      console.log(`3. Start backend: cd ${path.join(siteDir, 'backend')} && npm start`);
      console.log(`4. Start frontend: cd ${path.join(siteDir, 'frontend')} && npm start`);
    })
    .catch((error) => {
      console.error('Failed to generate tenant site:', error);
      process.exit(1);
    });
}