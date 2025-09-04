import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddCategoryModal from './AddCategoryModal';
import '../../mysass-custom.css';

const ProductCategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Helper function to determine if we're on a subdomain
  const getSubdomain = () => {
    const host = window.location.hostname;
    if (host.includes('localhost')) {
      const subdomainMatch = host.match(/^([^.]+)\.localhost$/);
      return subdomainMatch ? subdomainMatch[1] : null;
    }
    const parts = host.split('.');
    if (parts.length > 2) {
      return parts[0];
    }
    return null;
  };

  const isSubdomain = getSubdomain() === 'mysass';

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3005/api/product-categories?tenant=mysass');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category
  const handleDelete = async (id) => {
    try {
      // Optimistically remove from UI first
      const originalCategories = [...categories];
      setCategories(categories.filter(category => category._id !== id));

      const response = await fetch(`http://localhost:3005/api/product-categories/${id}?tenant=mysass`, {
        method: 'DELETE'
      });

      // Always refresh the list regardless of response status
      await fetchCategories();
      
    } catch (err) {
      console.error('Error deleting category:', err);
      // Always refresh to get the current state
      await fetchCategories();
    }
  };

  // Handle edit
  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowAddModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingCategory(null);
  };

  // Handle successful add/edit
  const handleCategorySaved = () => {
    fetchCategories();
    handleModalClose();
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="mysass-dashboard" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', color: 'var(--mysass-text-secondary)' }}>
          Loading categories...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mysass-dashboard" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', color: 'red' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mysass-dashboard">
      {/* Header */}
      <header className="mysass-categories-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '200px' }}>
          <Link 
            to={isSubdomain ? "/dashboard" : "/mysass/dashboard"} 
            style={{
              color: 'var(--mysass-text-secondary)',
              fontSize: '1.25rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = 'var(--mysass-primary)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--mysass-text-secondary)';
            }}
            title="Back to Dashboard"
          >
            ← Back
          </Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              color: 'var(--mysass-text-primary)',
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: '0 0 0.25rem 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Product Categories
            </h1>
            <p style={{
              color: 'var(--mysass-text-secondary)',
              margin: '0',
              fontSize: '0.85rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Manage product categories
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'background 0.2s ease',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.target.style.background = '#059669'}
          onMouseOut={(e) => e.target.style.background = '#10b981'}
        >
          <span style={{ fontSize: '1rem' }}>+</span>
          <span className="add-category-text">Add Category</span>
        </button>
      </header>

      {/* Categories Grid */}
      <div className="mysass-categories-grid" style={{
        padding: '1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {categories.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '4rem',
            color: 'var(--mysass-text-secondary)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3>No categories yet</h3>
            <p>Click "Add Category" to create your first product category</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className="mysass-category-card"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flex: 1
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px'
                  }}>
                    {category.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      color: 'var(--mysass-text-primary)',
                      margin: '0 0 0.25rem 0',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}>
                      {category.name}
                    </h3>
                    <p style={{
                      color: 'var(--mysass-text-secondary)',
                      margin: '0',
                      fontSize: '0.9rem'
                    }}>
                      Order: {category.order}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(category)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--mysass-text-secondary)',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.color = 'var(--mysass-primary)'}
                    onMouseOut={(e) => e.target.style.color = 'var(--mysass-text-secondary)'}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--mysass-text-secondary)',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#ef4444'}
                    onMouseOut={(e) => e.target.style.color = 'var(--mysass-text-secondary)'}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <p style={{
                color: 'var(--mysass-text-secondary)',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                marginBottom: '1rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {category.description}
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '1rem'
              }}>
                <span style={{ color: 'var(--mysass-text-secondary)' }}>
                  Created: {formatDate(category.createdAt)}
                </span>
                <span style={{
                  color: category.status === 'Active' ? '#10b981' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: category.status === 'Active' ? '#10b981' : '#6b7280'
                  }}></span>
                  {category.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <AddCategoryModal
          category={editingCategory}
          onClose={handleModalClose}
          onSave={handleCategorySaved}
        />
      )}

    </div>
  );
};

export default ProductCategoriesManagement;