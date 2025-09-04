import React, { useState, useEffect } from 'react';

const AddUserModal = ({ user, onClose, onUserSaved }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        password: '', // Don't populate password for editing
        role: user.role || 'admin',
        status: user.status || 'active'
      });
    }
  }, [user]);

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!user) { // Only require password for new users
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    } else if (formData.password.trim() && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const submitData = {
        email: formData.email.trim(),
        role: formData.role,
        status: formData.status,
        tenant: 'mysass'
      };

      // Only include password if it's provided
      if (formData.password.trim()) {
        submitData.password = formData.password.trim();
      }

      const url = user
        ? `http://localhost:3005/api/admin-users/${user._id}?tenant=mysass`
        : 'http://localhost:3005/api/admin-users?tenant=mysass';
      
      const method = user ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save user');
      }

      onUserSaved();
    } catch (error) {
      console.error('Error saving user:', error);
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
      <div className="mysass-modal-content mysass-add-user-modal">
        <div className="mysass-modal-header">
          <h2>{user ? 'Edit User' : 'Add User'}</h2>
          <button className="mysass-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mysass-user-form">
          <div className="mysass-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              disabled={loading}
            />
            {errors.email && <span className="mysass-error-text">{errors.email}</span>}
          </div>

          <div className="mysass-form-group">
            <label htmlFor="password">Password {user && '(leave blank to keep current)'}</label>
            <div className="mysass-password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                disabled={loading}
              />
              <button
                type="button"
                className="mysass-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.password && <span className="mysass-error-text">{errors.password}</span>}
          </div>

          <div className="mysass-form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={errors.role ? 'error' : ''}
              disabled={loading}
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
              <option value="moderator">Moderator</option>
            </select>
            {errors.role && <span className="mysass-error-text">{errors.role}</span>}
          </div>

          {user && (
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && <span className="mysass-error-text">{errors.status}</span>}
            </div>
          )}

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
              className="mysass-btn-user-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {user ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  {user ? 'Update User' : 'Add User'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;