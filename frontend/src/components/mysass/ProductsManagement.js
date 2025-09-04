import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddProductModal from './AddProductModal';
import '../../mysass-custom.css';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3005/api/products?tenant=mysass');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    try {
      // Optimistically remove from UI first
      const originalProducts = [...products];
      setProducts(products.filter(product => product._id !== id));

      const response = await fetch(`http://localhost:3005/api/products/${id}?tenant=mysass`, {
        method: 'DELETE'
      });

      // Always refresh the list regardless of response status
      await fetchProducts();
      
    } catch (err) {
      console.error('Error deleting product:', err);
      // Always refresh to get the current state
      await fetchProducts();
    }
  };

  // Handle edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingProduct(null);
  };

  // Handle successful add/edit
  const handleProductSaved = () => {
    fetchProducts();
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
          Loading products...
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
      <header className="mysass-products-header" style={{
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
            className="back-button"
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
            <h1 className="page-title" style={{
              color: 'var(--mysass-text-primary)',
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: '0 0 0.25rem 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Products
            </h1>
            <p className="page-subtitle" style={{
              color: 'var(--mysass-text-secondary)',
              margin: '0',
              fontSize: '0.85rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Manage products and portfolio
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="add-button"
          style={{
            background: '#8B5CF6',
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
          onMouseOver={(e) => e.target.style.background = '#7C3AED'}
          onMouseOut={(e) => e.target.style.background = '#8B5CF6'}
        >
          <span style={{ fontSize: '1rem' }}>+</span>
          <span className="add-product-text">Add Product</span>
        </button>
      </header>

      {/* Products Grid */}
      <div className="mysass-products-grid" style={{
        padding: '1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {products.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '4rem',
            color: 'var(--mysass-text-secondary)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3>No products yet</h3>
            <p>Click "Add Product" to create your first product</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="mysass-product-card"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="product-card-header" style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div className="product-info" style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  flex: 1
                }}>
                  <div className="product-image" style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: product.images && product.images.length > 0 ? 
                      `url(${product.images[0]})` : 
                      'linear-gradient(135deg, var(--mysass-primary), var(--mysass-secondary))',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '600'
                  }}>
                    {(!product.images || product.images.length === 0) && '📦'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 className="product-title" style={{
                      color: 'var(--mysass-text-primary)',
                      margin: '0 0 0.25rem 0',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      color: 'var(--mysass-text-secondary)',
                      margin: '0 0 0.25rem 0',
                      fontSize: '0.85rem'
                    }}>
                      {product.category}
                    </p>
                    <p style={{
                      color: 'var(--mysass-text-secondary)',
                      margin: '0',
                      fontSize: '0.8rem'
                    }}>
                      Order: {product.order}
                    </p>
                  </div>
                </div>
                <div className="product-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(product)}
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
                    onClick={() => handleDelete(product._id)}
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
              
              <p className="product-description" style={{
                color: 'var(--mysass-text-secondary)',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                marginBottom: '1rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {product.description}
              </p>
              
              <div className="product-meta" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '1rem'
              }}>
                <span style={{ color: 'var(--mysass-text-secondary)' }}>
                  Created: {formatDate(product.createdAt)}
                </span>
                <span style={{
                  color: product.status === 'Active' ? '#10b981' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: product.status === 'Active' ? '#10b981' : '#6b7280'
                  }}></span>
                  {product.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <AddProductModal
          product={editingProduct}
          onClose={handleModalClose}
          onSave={handleProductSaved}
        />
      )}

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .mysass-products-header {
            flex-direction: column !important;
            gap: 1rem !important;
            align-items: stretch !important;
            padding: 1rem 0.75rem !important;
          }
          
          .mysass-products-grid {
            grid-template-columns: 1fr !important;
            padding: 0.75rem !important;
            gap: 1rem !important;
          }
          
          .mysass-product-card {
            padding: 1.25rem !important;
          }
          
          .add-product-text {
            display: none !important;
          }
          
          .product-card-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          
          .product-info {
            flex-direction: row !important;
            align-items: center !important;
          }
          
          .product-actions {
            align-self: flex-end !important;
            margin-top: auto !important;
          }
        }
        
        @media (max-width: 480px) {
          .mysass-dashboard {
            fontSize: 0.9rem !important;
          }
          
          .mysass-products-header {
            padding: 0.75rem 0.5rem !important;
          }
          
          .mysass-products-grid {
            padding: 0.5rem !important;
            gap: 0.75rem !important;
          }
          
          .mysass-product-card {
            padding: 1rem !important;
            borderRadius: 12px !important;
          }
          
          .product-title {
            fontSize: 1.1rem !important;
            lineHeight: 1.3 !important;
          }
          
          .product-description {
            fontSize: 0.85rem !important;
            WebkitLineClamp: 2 !important;
          }
          
          .product-meta {
            fontSize: 0.75rem !important;
            flexDirection: column !important;
            gap: 0.5rem !important;
            alignItems: flex-start !important;
          }
          
          .product-image {
            width: 50px !important;
            height: 50px !important;
            borderRadius: 8px !important;
          }
          
          .back-button {
            fontSize: 1rem !important;
            padding: 0.375rem !important;
          }
          
          .page-title {
            fontSize: 1.3rem !important;
          }
          
          .page-subtitle {
            fontSize: 0.8rem !important;
          }
        }
        
        @media (max-width: 360px) {
          .mysass-products-header {
            padding: 0.5rem !important;
          }
          
          .mysass-products-grid {
            padding: 0.5rem !important;
          }
          
          .mysass-product-card {
            padding: 0.75rem !important;
          }
          
          .product-info {
            gap: 0.5rem !important;
          }
          
          .product-image {
            width: 40px !important;
            height: 40px !important;
          }
          
          .product-title {
            fontSize: 1rem !important;
          }
          
          .add-button {
            padding: 8px 12px !important;
            fontSize: 0.8rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsManagement;