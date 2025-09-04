import React, { useState, useEffect } from 'react';

const AddCategoryModal = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📦',
    order: 0,
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  // Initialize form data if editing
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '📦',
        order: category.order || 0,
        status: category.status || 'Active'
      });
    }
    // Reset validation when modal opens/closes
    setShowValidation(false);
  }, [category]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowValidation(true);
    
    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dataToSend = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon || '📦',
        order: parseInt(formData.order) || 0,
        status: formData.status || 'Active',
        tenant: 'mysass'
      };

      const url = category 
        ? `http://localhost:3005/api/product-categories/${category._id}?tenant=mysass`
        : 'http://localhost:3005/api/product-categories?tenant=mysass';
      
      const method = category ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save category');
      }

      setShowValidation(false);
      onSave();
    } catch (err) {
      console.error('Error saving category:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking outside modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="mysass-modal-backdrop" 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
    >
      <div 
        className="mysass-modal"
        style={{
          background: '#374151',
          borderRadius: '12px',
          padding: '1.5rem',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        <h2 style={{
          color: 'white',
          fontSize: '1.25rem',
          fontWeight: '700',
          margin: '0 0 1.5rem 0'
        }}>
          {category ? 'Edit Product Category' : 'Add Product Category'}
        </h2>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              required
              style={{
                width: '100%',
                background: '#4b5563',
                border: '1px solid #6b7280',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
            {showValidation && !formData.name.trim() && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.8rem',
                marginTop: '0.5rem'
              }}>
                This field is required
              </div>
            )}
          </div>

          {/* Description Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Description
            </label>
            <div style={{
              background: '#4b5563',
              border: '1px solid #6b7280',
              borderRadius: '8px',
              minHeight: '120px'
            }}>
              <div style={{
                borderBottom: '1px solid #6b7280',
                padding: '8px 12px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <select style={{
                  background: 'transparent',
                  color: 'white',
                  border: 'none',
                  fontSize: '0.85rem'
                }}>
                  <option>Normal</option>
                </select>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>B</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontStyle: 'italic' }}>I</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', textDecoration: 'underline' }}>U</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>S</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>•</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>1.</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>A</button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>🔗</button>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description..."
                required
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
              />
            </div>
            {showValidation && !formData.description.trim() && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.8rem',
                marginTop: '0.5rem'
              }}>
                This field is required
              </div>
            )}
          </div>

          {/* Icon Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Icon (emoji)
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              placeholder="📦"
              style={{
                width: '100%',
                background: '#4b5563',
                border: '1px solid #6b7280',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Order Field */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              min="0"
              style={{
                width: '100%',
                background: '#4b5563',
                border: '1px solid #6b7280',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#6b7280' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Saving...' : (category ? 'Update Category' : 'Add Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;