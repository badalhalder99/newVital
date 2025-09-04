import React, { useState, useEffect } from 'react';

const AddClientModal = ({ client, onClose, onClientSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    order: 0,
    status: 'Active'
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        order: client.order || 0,
        status: client.status || 'Active'
      });
      if (client.logo) {
        setLogoPreview(client.logo);
      }
    }
  }, [client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          logo: 'File size must be less than 5MB'
        }));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          logo: 'Please select an image file'
        }));
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear logo error
      if (errors.logo) {
        setErrors(prev => ({
          ...prev,
          logo: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('order', formData.order);
      submitData.append('status', formData.status);
      submitData.append('tenant', 'mysass');

      if (logoFile) {
        submitData.append('logo', logoFile);
      }

      const url = client
        ? `http://localhost:3005/api/clients/${client._id}?tenant=mysass`
        : 'http://localhost:3005/api/clients?tenant=mysass';
      
      const method = client ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: submitData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save client');
      }

      onClientSaved();
    } catch (error) {
      console.error('Error saving client:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="mysass-modal-overlay" onClick={handleBackdropClick}>
      <div className="mysass-modal-content mysass-add-client-modal">
        <div className="mysass-modal-header">
          <h2>{client ? 'Edit Client' : 'Add Client'}</h2>
          <button className="mysass-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mysass-client-form">
          <div className="mysass-form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter client name"
              disabled={loading}
            />
            {errors.name && <span className="mysass-error-text">{errors.name}</span>}
          </div>

          <div className="mysass-form-group">
            <label htmlFor="logo">Logo</label>
            <div className="mysass-logo-upload">
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoChange}
                className="mysass-file-input"
                disabled={loading}
              />
              <label htmlFor="logo" className="mysass-file-label">
                {logoPreview ? (
                  <>
                    <div className="mysass-logo-preview">
                      <img src={logoPreview} alt="Logo preview" />
                    </div>
                    <div className="file-info">
                      <span className="file-btn">Choose File</span>
                      <span className="file-status">File selected</span>
                    </div>
                  </>
                ) : (
                  <div className="mysass-logo-placeholder">
                    <div className="file-info">
                      <span className="file-btn">Choose File</span>
                      <span className="file-status">No file chosen</span>
                    </div>
                  </div>
                )}
              </label>
            </div>
            {errors.logo && <span className="mysass-error-text">{errors.logo}</span>}
          </div>

          <div className="mysass-form-group">
            <label htmlFor="order">Order</label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              min="0"
              className={errors.order ? 'error' : ''}
              disabled={loading}
            />
            {errors.order && <span className="mysass-error-text">{errors.order}</span>}
          </div>

          <div className="mysass-form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={errors.status ? 'error' : ''}
              disabled={loading}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && <span className="mysass-error-text">{errors.status}</span>}
          </div>

          {errors.submit && (
            <div className="mysass-error-message">
              {errors.submit}
            </div>
          )}

          <div className="mysass-modal-actions">
            <button
              type="button"
              className="mysass-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="mysass-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {client ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  {client ? 'Update Client' : 'Add Client'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;