import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Edit3, Globe, Save, X, Eye, Settings } from 'lucide-react';

const TenantPageManager = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pages, setPages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [editingPage, setEditingPage] = useState(null);
  const [editingSettings, setEditingSettings] = useState(false);
  const [tenantData, setTenantData] = useState(null);

  const pageTypes = [
    { key: 'home', name: 'Home Page', icon: '🏠' },
    { key: 'about', name: 'About Us', icon: 'ℹ️' },
    { key: 'services', name: 'Services', icon: '⚙️' },
    { key: 'testimonials', name: 'Testimonials', icon: '💬' },
    { key: 'contact', name: 'Contact', icon: '📞' }
  ];

  useEffect(() => {
    if (user?.role === 'tenant') {
      fetchTenantData();
    }
  }, [user]);

  const fetchTenantData = async () => {
    try {
      // Get tenant info first
      const tenantResponse = await api.get('/api/users/me');
      if (tenantResponse.data.success) {
        const userData = tenantResponse.data.data;
        setTenantData(userData);
        
        // Get tenant pages
        const pagesResponse = await api.get(`/api/tenant-website/${userData.tenant?.subdomain}/dashboard/pages`);
        if (pagesResponse.data.success) {
          setPages(pagesResponse.data.data);
        }

        // Get tenant settings
        const settingsResponse = await api.get(`/api/tenant-website/${userData.tenant?.subdomain}`);
        if (settingsResponse.data.success) {
          setSettings(settingsResponse.data.data.settings);
        }
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageEdit = (pageType) => {
    const existingPage = pages.find(p => p.page_type === pageType);
    setEditingPage({
      page_type: pageType,
      title: existingPage?.title || '',
      content: existingPage?.content || '',
      meta_description: existingPage?.meta_description || ''
    });
  };

  const handlePageSave = async () => {
    if (!editingPage || !tenantData?.tenant?.subdomain) return;
    
    setSaving(true);
    try {
      await api.put(
        `/api/tenant-website/${tenantData.tenant.subdomain}/dashboard/pages/${editingPage.page_type}`,
        editingPage
      );
      
      // Refresh pages
      await fetchTenantData();
      setEditingPage(null);
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Failed to save page. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsEdit = () => {
    setEditingSettings({
      site_name: settings?.site_name || tenantData?.tenant?.name || '',
      site_tagline: settings?.site_tagline || '',
      primary_color: settings?.primary_color || '#10b981',
      secondary_color: settings?.secondary_color || '#059669',
      contact_email: settings?.contact_email || '',
      contact_phone: settings?.contact_phone || '',
      address: settings?.address || '',
      meta_description: settings?.meta_description || '',
      social_media: settings?.social_media || {}
    });
  };

  const handleSettingsSave = async () => {
    if (!editingSettings || !tenantData?.tenant?.subdomain) return;
    
    setSaving(true);
    try {
      await api.put(
        `/api/tenant-website/${tenantData.tenant.subdomain}/dashboard/settings`,
        editingSettings
      );
      
      // Refresh data
      await fetchTenantData();
      setEditingSettings(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading page manager...</div>;
  }

  if (user?.role !== 'tenant') {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">Only tenants can access this page manager.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Website Management</h2>
          {tenantData?.tenant?.subdomain && (
            <a
              href={`http://localhost:3000/${tenantData.tenant.subdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Globe className="w-4 h-4 mr-2" />
              View Website
            </a>
          )}
        </div>

        {/* Website Settings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Website Settings</h3>
            <button
              onClick={handleSettingsEdit}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Settings
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Site Name:</strong> {settings?.site_name || tenantData?.tenant?.name}</p>
                <p><strong>URL:</strong> localhost:3000/{tenantData?.tenant?.subdomain}</p>
                <p><strong>Email:</strong> {settings?.contact_email || 'Not set'}</p>
              </div>
              <div>
                <p><strong>Phone:</strong> {settings?.contact_phone || 'Not set'}</p>
                <p><strong>Primary Color:</strong> 
                  <span 
                    className="inline-block w-6 h-6 rounded ml-2 border"
                    style={{ backgroundColor: settings?.primary_color || '#10b981' }}
                  ></span>
                </p>
                <p><strong>Tagline:</strong> {settings?.site_tagline || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Management */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageTypes.map((pageType) => {
              const existingPage = pages.find(p => p.page_type === pageType.key);
              return (
                <div key={pageType.key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold flex items-center">
                      <span className="mr-2">{pageType.icon}</span>
                      {pageType.name}
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageEdit(pageType.key)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <a
                        href={`http://localhost:3000/${tenantData?.tenant?.subdomain}${pageType.key === 'home' ? '' : '/' + pageType.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {existingPage ? (
                      <span className="text-green-600">✓ Content added</span>
                    ) : (
                      <span className="text-yellow-600">⚠ Using default content</span>
                    )}
                  </p>
                  {existingPage?.title && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      Title: {existingPage.title}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Page Editor Modal */}
      {editingPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                Edit {pageTypes.find(p => p.key === editingPage.page_type)?.name}
              </h3>
              <button
                onClick={() => setEditingPage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter page title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={editingPage.content}
                  onChange={(e) => setEditingPage({...editingPage, content: e.target.value})}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter page content (HTML allowed)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can use HTML tags for formatting
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description (for SEO)
                </label>
                <textarea
                  value={editingPage.meta_description}
                  onChange={(e) => setEditingPage({...editingPage, meta_description: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description for search engines"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingPage(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePageSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Page'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Editor Modal */}
      {editingSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Website Settings</h3>
              <button
                onClick={() => setEditingSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={editingSettings.site_name}
                    onChange={(e) => setEditingSettings({...editingSettings, site_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={editingSettings.site_tagline}
                    onChange={(e) => setEditingSettings({...editingSettings, site_tagline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={editingSettings.primary_color}
                    onChange={(e) => setEditingSettings({...editingSettings, primary_color: e.target.value})}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={editingSettings.contact_email}
                    onChange={(e) => setEditingSettings({...editingSettings, contact_email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={editingSettings.contact_phone}
                    onChange={(e) => setEditingSettings({...editingSettings, contact_phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={editingSettings.address}
                    onChange={(e) => setEditingSettings({...editingSettings, address: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={editingSettings.meta_description}
                    onChange={(e) => setEditingSettings({...editingSettings, meta_description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of your business"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingSettings(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSettingsSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantPageManager;