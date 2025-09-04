import React, { useState, useEffect } from 'react';
import '../../mysass-custom.css';

const AddProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    order: 0,
    status: 'Active'
  });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        order: product.order || 0,
        status: product.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        order: 0,
        status: 'Active'
      });
    }
    setImages([]);
    setError('');
  }, [product]);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3010/api/product-categories?tenant=mysass');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    setImages(files);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Product name is required');
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      setLoading(false);
      return;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('order', formData.order);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('tenant', 'mysass');

      // Add images
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const url = product 
        ? `http://localhost:3010/api/products/${product._id}?tenant=mysass`
        : 'http://localhost:3010/api/products?tenant=mysass';
      
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      onSave();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError('');
    onClose();
  };

  return (
    <div className="modal-container" style={{
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
    }}>
      <div className="modal-content" style={{
        background: 'var(--mysass-surface)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 className="modal-title" style={{
          color: 'var(--mysass-text-primary)',
          fontSize: '1.5rem',
          fontWeight: '700',
          margin: '0 0 2rem 0'
        }}>
          {product ? 'Edit Product' : 'Add Product'}
        </h2>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Name */}
          <div>
            <label style={{
              display: 'block',
              color: 'var(--mysass-text-primary)',
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
              required
              className="form-input"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--mysass-text-primary)',
                fontSize: '0.95rem'
              }}
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label style={{
              display: 'block',
              color: 'var(--mysass-text-primary)',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="form-textarea"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--mysass-text-primary)',
                fontSize: '0.95rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              placeholder="Enter product description..."
            />
          </div>

          {/* Category */}
          <div>
            <label style={{
              display: 'block',
              color: 'var(--mysass-text-primary)',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="form-select"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--mysass-text-primary)',
                fontSize: '0.95rem'
              }}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name} style={{ background: 'var(--mysass-surface)' }}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div>
            <label style={{
              display: 'block',
              color: 'var(--mysass-text-primary)',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Pictures
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--mysass-text-primary)',
                fontSize: '0.95rem'
              }}
            />
            <p style={{
              color: 'var(--mysass-text-secondary)',
              fontSize: '0.8rem',
              margin: '0.5rem 0 0 0'
            }}>
              Maximum 5 images, 5MB each
            </p>
          </div>

          {/* Order */}
          <div>
            <label style={{
              display: 'block',
              color: 'var(--mysass-text-primary)',
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
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--mysass-text-primary)',
                fontSize: '0.95rem'
              }}
              placeholder="0"
            />
          </div>

          {/* Status */}
          <div>
            <label style={{
              display: 'block',
              color: 'var(--mysass-text-primary)',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--mysass-text-primary)',
                fontSize: '0.95rem'
              }}
            >
              <option value="Active" style={{ background: 'var(--mysass-surface)' }}>Active</option>
              <option value="Inactive" style={{ background: 'var(--mysass-surface)' }}>Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="form-buttons" style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <button
              type="submit"
              disabled={loading}
              className="form-button"
              style={{
                flex: 1,
                background: '#8B5CF6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => !loading && (e.target.style.background = '#7C3AED')}
              onMouseOut={(e) => !loading && (e.target.style.background = '#8B5CF6')}
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="form-button"
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--mysass-text-primary)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => !loading && (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
              onMouseOut={(e) => !loading && (e.target.style.background = 'rgba(255, 255, 255, 0.1)')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .modal-container {
            padding: 0.5rem !important;
          }
          
          .modal-content {
            padding: 1.5rem !important;
            maxHeight: 95vh !important;
            borderRadius: 12px !important;
          }
          
          .modal-title {
            fontSize: 1.3rem !important;
            marginBottom: 1.5rem !important;
          }
          
          .form-buttons {
            flexDirection: column !important;
            gap: 0.75rem !important;
          }
          
          .form-button {
            padding: 0.875rem 1rem !important;
            fontSize: 0.9rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .modal-content {
            padding: 1rem !important;
            fontSize: 0.9rem !important;
          }
          
          .modal-title {
            fontSize: 1.2rem !important;
          }
          
          .form-input, .form-textarea, .form-select {
            padding: 0.625rem !important;
            fontSize: 0.9rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AddProductModal;