import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../mysass-custom.css';

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    teamMembers: 2,
    products: 1,
    categories: 1,
    clients: 0,
    contacts: 0,
    testimonials: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Mock user data - in real app this would come from API
    setUserData({
      name: 'admin',
      email: 'admin@admin.com'
    });
  }, []);

  const handleLogout = () => {
    // Implement logout logic
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to MySaaS home page instead of global signin
    navigate('/mysass');
  };

  const managementCards = [
    {
      title: 'Team Management',
      description: 'Manage team members, their roles, and information.',
      buttonText: 'Manage Team',
      buttonColor: 'var(--mysass-accent-blue)',
      link: '/mysass/dashboard/team'
    },
    {
      title: 'Product Categories',
      description: 'Manage product categories and classifications.',
      buttonText: 'Manage Categories',
      buttonColor: 'var(--mysass-primary)',
      link: '/mysass/dashboard/categories'
    },
    {
      title: 'Product Management',
      description: 'Add, edit, or remove products from the portfolio.',
      buttonText: 'Manage Products',
      buttonColor: 'var(--mysass-accent-purple)',
      link: '/mysass/dashboard/products'
    },
    {
      title: 'Client Management',
      description: 'Manage client information and logos.',
      buttonText: 'Manage Clients',
      buttonColor: 'var(--mysass-accent-orange)',
      link: '/mysass/dashboard/clients'
    },
    {
      title: 'Certificate Management',
      description: 'Manage certificates and accreditations.',
      buttonText: 'Manage Certificates',
      buttonColor: 'var(--mysass-accent-red)',
      link: '/mysass/dashboard/certificates'
    },
    {
      title: 'Contact Management',
      description: 'View and manage contact form submissions.',
      buttonText: 'Manage Contacts',
      buttonColor: 'var(--mysass-accent-cyan)',
      link: '/mysass/dashboard/contacts'
    },
    {
      title: 'Testimonial Management',
      description: 'Add, edit, and manage client testimonials.',
      buttonText: 'Manage Testimonials',
      buttonColor: 'var(--mysass-accent-purple)',
      link: '/mysass/dashboard/testimonials'
    },
    {
      title: 'User Management',
      description: 'Manage admin users and permissions.',
      buttonText: 'Manage Users',
      buttonColor: 'var(--mysass-text-muted)',
      link: '/mysass/dashboard/users'
    }
  ];

  const metricCards = [
    {
      title: 'Team Members',
      value: stats.teamMembers,
      icon: '👥',
      color: 'blue'
    },
    {
      title: 'Products',
      value: stats.products,
      icon: '📦',
      color: 'green'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: '📂',
      color: 'purple'
    },
    {
      title: 'Clients',
      value: stats.clients,
      icon: '👤',
      color: 'orange'
    },
    {
      title: 'Contacts',
      value: stats.contacts,
      icon: '📧',
      color: 'cyan'
    },
    {
      title: 'Testimonials',
      value: stats.testimonials,
      icon: '💬',
      color: 'purple'
    }
  ];

  return (
    <div className="mysass-dashboard">
      {/* Dashboard Header */}
      <header className="mysass-dashboard-header">
        <div>
          <h2 style={{
            color: 'var(--mysass-text-primary)',
            fontSize: '26px',
            fontWeight: '600',
            margin: '0 0 0.5rem 0'
          }}>
            Dashboard
          </h2>
          <p style={{
            color: 'var(--mysass-text-secondary)',
            margin: '0',
            fontSize: '1rem'
          }}>
            Welcome back, {userData?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="logoutBtn"
        >
          Logout
        </button>
      </header>

      <div className="mysass-dashboard-content">
        {/* Metrics Overview */}
        <div className="mysass-dashboard-grid" style={{ marginBottom: '3rem' }}>
          {metricCards.map((metric, index) => (
            <div key={index} className="mysass-metric-card">
              <div className={`mysass-metric-icon ${metric.color}`}>
                {metric.icon}
              </div>
              <div className="mysass-metric-content">
                <h3>{metric.value}</h3>
                <p>{metric.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Management Cards */}
        <div className="mysass-management-grid">
          {managementCards.map((card, index) => (
            <div key={index} className="mysass-management-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link
                to={card.link}
                className="mysass-btn"
                style={{
                  background: card.buttonColor,
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'inline-block'
                }}
              >
                {card.buttonText}
              </Link>
            </div>
          ))}
        </div>


        {/* Website Preview */}
        <section style={{ marginTop: '4rem' }}>
          <h2 style={{
            color: 'var(--mysass-text-primary)',
            marginBottom: '2rem',
            fontSize: '1.5rem'
          }}>
            Website Management
          </h2>
          <div className="mysass-card" style={{ padding: '2rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h3 style={{
                  color: 'var(--mysass-text-primary)',
                  margin: '0 0 0.5rem 0'
                }}>
                  Harmony Sourcing Website
                </h3>
                <p style={{
                  color: 'var(--mysass-text-secondary)',
                  margin: '0'
                }}>
                  Manage your website content, pages, and settings
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href="/mysass"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mysass-btn mysass-btn-secondary"
                >
                  View Website 🔗
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;