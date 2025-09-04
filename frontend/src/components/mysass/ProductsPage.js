import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../mysass-custom.css';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch product categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3005/api/product-categories?tenant=mysass');
        if (response.ok) {
          const categories = await response.json();
          setProductCategories(categories);
        } else {
          console.error('Failed to fetch categories');
          // Fallback to default categories if API fails
          setProductCategories([
            {
              name: 'Knitwear',
              description: 'Sweaters, cardigans, hoodies and comfort footwear',
              icon: '🧶',
              features: ['Category: Production', '5 products available']
            },
            {
              name: 'Knit',
              description: 'T-shirts and knits (single and double jersey)',
              icon: '👕', 
              features: ['Category: Production', '6 products available']
            },
            {
              name: 'Wovens',
              description: 'Shirts, blouses, outerwear',
              icon: '👗',
              features: ['Category: Production', '4 products available']
            },
            {
              name: 'Denim',
              description: 'Jeans, jackets, vintage brands',
              icon: '👖',
              features: ['Category: Production', '7 products available']
            },
            {
              name: 'Active & Sportswear',
              description: 'Performance fabrics, gym wear',
              icon: '🏃‍♂️',
              features: ['Category: Production', '5 products available']
            },
            {
              name: 'Intimates & Accessories',
              description: 'Undergarments, belts, scarves',
              icon: '👙',
              features: ['Category: Production', '3 products available']
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories if fetch fails
        setProductCategories([
          {
            name: 'Knitwear',
            description: 'Sweaters, cardigans, hoodies and comfort footwear',
            icon: '🧶',
            features: ['Category: Production', '5 products available']
          },
          {
            name: 'Knit',
            description: 'T-shirts and knits (single and double jersey)',
            icon: '👕', 
            features: ['Category: Production', '6 products available']
          },
          {
            name: 'Wovens',
            description: 'Shirts, blouses, outerwear',
            icon: '👗',
            features: ['Category: Production', '4 products available']
          },
          {
            name: 'Denim',
            description: 'Jeans, jackets, vintage brands',
            icon: '👖',
            features: ['Category: Production', '7 products available']
          },
          {
            name: 'Active & Sportswear',
            description: 'Performance fabrics, gym wear',
            icon: '🏃‍♂️',
            features: ['Category: Production', '5 products available']
          },
          {
            name: 'Intimates & Accessories',
            description: 'Undergarments, belts, scarves',
            icon: '👙',
            features: ['Category: Production', '3 products available']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  // Fetch products from database
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/products?tenant=mysass');
      if (response.ok) {
        const productsData = await response.json();
        setProducts(productsData.filter(product => product.status === 'Active'));
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Generate filter categories from database categories
  const filterCategories = ['All', ...productCategories.map(cat => cat.name)];

  return (
    <div className="mysass-page">
      {/* Hero Section */}
      <section className="mysass-hero" style={{ padding: '100px 2rem 80px' }}>
        <div className="mysass-grid mysass-grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
          <div>
            <h1 style={{ marginBottom: '2rem', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Our <span className="highlight">Products & Portfolio</span>
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--mysass-text-secondary)',
              marginBottom: '3rem',
              lineHeight: '1.7'
            }}>
              Showcasing our expertise across diverse apparel categories and sustainable partnerships and sustainable manufacturing solutions.
            </p>
            <Link to="/mysass/contact" className="mysass-btn mysass-btn-primary">
              View Categories
            </Link>
          </div>
          
          {/* Product Images Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src="/4.png" 
                alt="Premium T-shirt"
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
              <p style={{ color: 'var(--mysass-text-secondary)', fontSize: '0.9rem', margin: '0' }}>
                Premium T-shirt
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src="/7.png" 
                alt="Quality Jacket"
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
              <p style={{ color: 'var(--mysass-text-secondary)', fontSize: '0.9rem', margin: '0' }}>
                Quality Jacket
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Product Categories</h2>
        <p className="mysass-section-subtitle">
          We specialize in diverse apparel categories, ensuring quality and sustainability across all product lines.
        </p>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ color: 'var(--mysass-text-secondary)' }}>Loading categories...</p>
          </div>
        ) : (
          <div className="mysass-grid mysass-grid-3">
            {productCategories.map((category, index) => (
              <div key={index} className="mysass-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1.5rem',
                  color: 'var(--mysass-primary)'
                }}>
                  {category.icon}
                </div>
                <h3 style={{ 
                  color: 'var(--mysass-text-primary)', 
                  fontSize: '1.3rem',
                  marginBottom: '1rem'
                }}>
                  {category.name}
                </h3>
                <p style={{ 
                  color: 'var(--mysass-text-secondary)', 
                  marginBottom: '1.5rem',
                  lineHeight: '1.6'
                }}>
                  {category.description}
                </p>
                <div>
                  {(category.features || []).map((feature, idx) => (
                    <p key={idx} style={{ 
                      color: 'var(--mysass-primary)', 
                      fontSize: '0.9rem',
                      margin: '0.25rem 0'
                    }}>
                      {feature}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Our Products */}
      <section className="mysass-section" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
        <h2 className="mysass-section-title">Our Products</h2>
        <p className="mysass-section-subtitle">
          Explore our diverse product portfolio with sustainable manufacturing solutions.
        </p>
        
        {/* Filter */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '3rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginRight: '2rem'
          }}>
            <span style={{ color: 'var(--mysass-text-primary)', fontWeight: '500' }}>
              🔻 Filter by Category
            </span>
          </div>
          {filterCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className="mysass-btn"
              style={{
                background: selectedCategory === category ? 
                  'var(--mysass-primary)' : 
                  'rgba(255, 255, 255, 0.1)',
                color: selectedCategory === category ? 
                  'white' : 
                  'var(--mysass-text-secondary)',
                padding: '8px 16px',
                fontSize: '0.9rem',
                border: selectedCategory === category ? 
                  'none' : 
                  '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {category}
            </button>
          ))}
          <button className="mysass-btn mysass-btn-primary" style={{ padding: '8px 16px' }}>
            All Products
          </button>
        </div>

        {/* Product Grid */}
        <div className="mysass-grid mysass-grid-4">
          {products.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '4rem',
              color: 'var(--mysass-text-secondary)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <h3>No products available</h3>
              <p>Products will appear here once they are added to the database</p>
            </div>
          ) : (
            products
              .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
              .map((product) => (
                <div key={product._id} className="mysass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: product.images && product.images.length > 0 ? 
                      `url(${product.images[0]})` : 
                      'linear-gradient(135deg, var(--mysass-primary), var(--mysass-secondary))',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    marginBottom: '1.5rem',
                    color: 'white'
                  }}>
                    {(!product.images || product.images.length === 0) && '📦'}
                  </div>
                  <h4 style={{ 
                    color: 'var(--mysass-text-primary)', 
                    marginBottom: '0.5rem'
                  }}>
                    {product.name}
                  </h4>
                  <p style={{ 
                    color: 'var(--mysass-text-secondary)', 
                    marginBottom: '0.5rem',
                    fontSize: '0.85rem'
                  }}>
                    {product.category}
                  </p>
                  <p style={{ 
                    color: 'var(--mysass-text-secondary)', 
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4'
                  }}>
                    {product.description}
                  </p>
                  <button className="mysass-btn mysass-btn-primary" style={{
                    padding: '8px 16px',
                    fontSize: '0.9rem'
                  }}>
                    View Details
                  </button>
                </div>
              ))
          )}
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Client Testimonials</h2>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ 
            color: 'var(--mysass-text-secondary)', 
            fontSize: '1.1rem',
            fontStyle: 'italic'
          }}>
            No testimonials available at the moment
          </p>
        </div>
      </section>

      {/* Product Gallery */}
      <section className="mysass-section">
        <h2 className="mysass-section-title">Product Gallery</h2>
        <p className="mysass-section-subtitle">
          Explore our diverse range of sustainable fashion products
        </p>
        
        <div className="mysass-grid mysass-grid-3" style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
          {[
            { src: '/5.png', name: 'Casual Shorts' },
            { src: '/4.png', name: 'Casual Tee' },
            { src: '/3.png', name: 'Graphic Tee' },
            { src: '/7.png', name: 'Winter Jacket' },
            { src: '/2.png', name: 'Summer Dress' },
            { src: '/6.png', name: 'Cozy Sweater' }
          ].map((product, index) => (
            <div key={index} className="mysass-card" style={{ 
              textAlign: 'center', 
              padding: '1.5rem 1rem',
              transition: 'all 0.3s ease'
            }}>
              <img 
                src={product.src} 
                alt={product.name}
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
              <p style={{ 
                color: 'var(--mysass-text-secondary)', 
                fontSize: '0.85rem',
                margin: '0'
              }}>
                {product.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mysass-section">
        <div className="mysass-card" style={{ 
          textAlign: 'center', 
          padding: '4rem',
          background: 'linear-gradient(135deg, var(--mysass-primary), var(--mysass-secondary))',
          color: 'white'
        }}>
          <h2 className="mysass-section-title" style={{ color: 'white' }}>
            Ready to Start Your Next Product?
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '3rem',
            opacity: '0.9',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Let's discuss how we can help bring your product vision to life with sustainable high-quality manufacturing.
          </p>
          <Link 
            to="/mysass/contact" 
            className="mysass-btn"
            style={{ 
              background: 'white', 
              color: 'var(--mysass-primary)',
              fontWeight: '600',
              fontSize: '1.1rem',
              padding: '18px 36px'
            }}
          >
            Start Your Product ➜
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;