import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Edit3, Globe, Save, X, Eye, Settings, FileText, Palette, Phone, Mail, MapPin } from 'lucide-react';

const TenantPageManagerPro = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pages, setPages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [editingPage, setEditingPage] = useState(null);
  const [editingSettings, setEditingSettings] = useState(false);
  const [tenantData, setTenantData] = useState(null);
  const [activeTab, setActiveTab] = useState('pages');

  const pageTypes = [
    { key: 'home', name: 'Home Page', icon: '🏠', description: 'Main landing page for your website' },
    { key: 'about', name: 'About Us', icon: 'ℹ️', description: 'Tell your story and company background' },
    { key: 'services', name: 'Services', icon: '⚙️', description: 'Showcase your products and services' },
    { key: 'testimonials', name: 'Testimonials', icon: '💬', description: 'Customer reviews and feedback' },
    { key: 'contact', name: 'Contact', icon: '📞', description: 'Contact information and forms' }
  ];

  useEffect(() => {
    if (user?.role === 'tenant') {
      fetchTenantData();
    }
  }, [user]);

  const fetchTenantData = async () => {
    try {
      console.log('fetchTenantData started');
      // Get tenant info first
      const tenantResponse = await api.get('/api/users/me');
      console.log('Tenant response:', tenantResponse);
      
      if (tenantResponse.data.success) {
        const userData = tenantResponse.data.data;
        console.log('User data received:', userData);
        setTenantData(userData);
        
        if (!userData.tenant?.subdomain) {
          console.error('No tenant subdomain in user data');
          alert('No tenant information found. Please contact support.');
          return;
        }
        
        // Get tenant pages
        console.log('Fetching pages for subdomain:', userData.tenant.subdomain);
        const pagesResponse = await api.get(`/api/tenant-website/${userData.tenant.subdomain}/dashboard/pages`);
        console.log('Pages response:', pagesResponse);
        if (pagesResponse.data.success) {
          setPages(pagesResponse.data.data);
        }

        // Get tenant settings
        console.log('Fetching settings for subdomain:', userData.tenant.subdomain);
        const settingsResponse = await api.get(`/api/tenant-website/${userData.tenant.subdomain}`);
        console.log('Settings response:', settingsResponse);
        if (settingsResponse.data.success) {
          setSettings(settingsResponse.data.data.settings);
        }
      } else {
        console.error('Tenant response not successful:', tenantResponse.data);
        alert('Failed to load tenant information.');
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      console.error('Error details:', error.response?.data);
      alert('Error loading data: ' + (error.response?.data?.message || error.message));
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
    console.log('handlePageSave called');
    console.log('editingPage:', editingPage);
    console.log('tenantData:', tenantData);
    
    if (!editingPage) {
      console.error('No editingPage data');
      alert('No page data to save');
      return;
    }
    
    if (!tenantData?.tenant?.subdomain) {
      console.error('No tenant subdomain found');
      alert('Tenant information not available');
      return;
    }
    
    setSaving(true);
    try {
      console.log('Making API call to save page:', editingPage);
      const apiUrl = `/api/tenant-website/${tenantData.tenant.subdomain}/dashboard/pages/${editingPage.page_type}`;
      console.log('API URL:', apiUrl);
      
      const response = await api.put(apiUrl, editingPage);
      
      console.log('Save response:', response);
      
      if (response.data.success) {
        // Refresh pages
        await fetchTenantData();
        setEditingPage(null);
        alert('Page saved successfully!');
      } else {
        throw new Error(response.data.message || 'Save failed');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to save page: ' + (error.response?.data?.message || error.message));
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
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading your website manager...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'tenant') {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h2>
          <p className="text-red-600">Only tenants can access this website manager.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Manager</h1>
            <p className="text-gray-600">Manage your website content, settings, and appearance</p>
          </div>
          {tenantData?.tenant?.subdomain && (
            <div className="mt-4 md:mt-0">
              <a
                href={`http://${tenantData.tenant.subdomain}.localhost:3001`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <Globe className="w-4 h-4 mr-2" />
                View Live Website
              </a>
            </div>
          )}
        </div>

        {/* Website Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Website Name</h3>
            <p className="text-gray-600">{settings?.site_name || tenantData?.tenant?.name}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Website URL</h3>
            <p className="text-gray-600">{tenantData?.tenant?.subdomain}.localhost:3001</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Status</h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ● Live
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('pages')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'pages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Pages
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'pages' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Website Pages</h2>
                <p className="text-gray-600">Edit and manage all your website pages</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageTypes.map((pageType) => {
                  const existingPage = pages.find(p => p.page_type === pageType.key);
                  return (
                    <div key={pageType.key} className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{pageType.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{pageType.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{pageType.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        {existingPage ? (
                          <div className="flex items-center text-green-600 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Content added
                          </div>
                        ) : (
                          <div className="flex items-center text-yellow-600 text-sm">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                            Using default content
                          </div>
                        )}
                        {existingPage?.title && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            Title: {existingPage.title}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePageEdit(pageType.key)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <a
                          href={`http://${tenantData?.tenant?.subdomain}.localhost:3001${pageType.key === 'home' ? '' : '/' + pageType.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Website Settings</h2>
                <p className="text-gray-600">Configure your website appearance and contact information</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Site Info */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Palette className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Site Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Site Name</p>
                      <p className="text-gray-900">{settings?.site_name || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tagline</p>
                      <p className="text-gray-900">{settings?.site_tagline || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Primary Color</p>
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded border mr-2"
                          style={{ backgroundColor: settings?.primary_color || '#10b981' }}
                        ></div>
                        <span className="text-gray-900">{settings?.primary_color || '#10b981'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Phone className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Contact Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-gray-900">{settings?.contact_email || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-gray-900">{settings?.contact_phone || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="text-gray-900">{settings?.address || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Settings className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Actions</h3>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={handleSettingsEdit}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Settings
                    </button>
                    <a
                      href={`http://${tenantData?.tenant?.subdomain}.localhost:3001`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Preview Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page Editor Modal */}
      {editingPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Edit {pageTypes.find(p => p.key === editingPage.page_type)?.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Update your page content and SEO information
                </p>
              </div>
              <button
                onClick={() => setEditingPage(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter page title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={editingPage.content}
                  onChange={(e) => setEditingPage({...editingPage, content: e.target.value})}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Enter page content (HTML allowed)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can use HTML tags for formatting (e.g., &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description (SEO)
                </label>
                <textarea
                  value={editingPage.meta_description}
                  onChange={(e) => setEditingPage({...editingPage, meta_description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description for search engines (150-160 characters recommended)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editingPage.meta_description.length}/160 characters
                </p>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setEditingPage(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  console.log('Save button clicked!', e);
                  handlePageSave();
                }}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Website Settings</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Configure your website appearance and contact information
                </p>
              </div>
              <button
                onClick={() => setEditingSettings(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Site Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={editingSettings.site_name}
                      onChange={(e) => setEditingSettings({...editingSettings, site_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={editingSettings.primary_color}
                        onChange={(e) => setEditingSettings({...editingSettings, primary_color: e.target.value})}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingSettings.primary_color}
                        onChange={(e) => setEditingSettings({...editingSettings, primary_color: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={editingSettings.meta_description}
                      onChange={(e) => setEditingSettings({...editingSettings, meta_description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of your business"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={editingSettings.contact_email}
                      onChange={(e) => setEditingSettings({...editingSettings, contact_email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={editingSettings.contact_phone}
                      onChange={(e) => setEditingSettings({...editingSettings, contact_phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setEditingSettings(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSettingsSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
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

export default TenantPageManagerPro;