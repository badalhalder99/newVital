import React, { useState, useEffect } from 'react';

const ContactsManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [loading, setLoading] = useState(true);

  // Default contacts to show
  const defaultContacts = [
    {
      _id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      company: 'Tech Solutions Inc',
      phone: '+1 (555) 123-4567',
      subject: 'Product Inquiry',
      message: 'I am interested in your software development services and would like to schedule a consultation.',
      status: 'new',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      replied: false
    },
    {
      _id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@startup.io',
      company: 'Startup Innovations',
      phone: '+1 (555) 987-6543',
      subject: 'Partnership Opportunity',
      message: 'We are looking for a technology partner for our upcoming project. Your company seems like a perfect fit.',
      status: 'read',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      replied: false
    }
  ];

  useEffect(() => {
    // Simulate loading and set default contacts
    const timer = setTimeout(() => {
      setContacts(defaultContacts);
      setFilteredContacts(defaultContacts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = contacts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'All Status') {
      filtered = filtered.filter(contact => contact.status === statusFilter.toLowerCase());
    }

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, statusFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'new':
        return 'status-new';
      case 'read':
        return 'status-read';
      case 'replied':
        return 'status-replied';
      default:
        return 'status-new';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return 'fas fa-envelope';
      case 'read':
        return 'fas fa-eye';
      case 'replied':
        return 'fas fa-reply';
      default:
        return 'fas fa-envelope';
    }
  };

  // Calculate stats
  const totalContacts = contacts.length;
  const newMessages = contacts.filter(c => c.status === 'new').length;
  const readMessages = contacts.filter(c => c.status === 'read').length;
  const repliedMessages = contacts.filter(c => c.replied).length;

  return (
    <div className="mysass-contacts-container">
      <div className="mysass-contacts-header">
        <div className="mysass-header-left">
          <button className="mysass-back-btn" onClick={() => window.history.back()}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="mysass-header-text">
            <h2>Contact Form Submissions</h2>
            <p>Manage and respond to contact form entries</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mysass-contacts-stats">
        <div className="mysass-stat-card">
          <div className="mysass-stat-icon blue">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="mysass-stat-info">
            <h3>{totalContacts}</h3>
            <p>Total Contacts</p>
          </div>
        </div>

        <div className="mysass-stat-card">
          <div className="mysass-stat-icon cyan">
            <i className="fas fa-comment"></i>
          </div>
          <div className="mysass-stat-info">
            <h3>{newMessages}</h3>
            <p>New Messages</p>
          </div>
        </div>

        <div className="mysass-stat-card">
          <div className="mysass-stat-icon orange">
            <i className="fas fa-eye"></i>
          </div>
          <div className="mysass-stat-info">
            <h3>{readMessages}</h3>
            <p>Read</p>
          </div>
        </div>

        <div className="mysass-stat-card">
          <div className="mysass-stat-icon green">
            <i className="fas fa-phone"></i>
          </div>
          <div className="mysass-stat-info">
            <h3>{repliedMessages}</h3>
            <p>Replied</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mysass-contacts-filters">
        <div className="mysass-search-container">
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="mysass-search-input"
          />
          <i className="fas fa-search mysass-search-icon"></i>
        </div>
        
        <div className="mysass-filter-container">
          <i className="fas fa-filter mysass-filter-icon"></i>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="mysass-status-filter"
          >
            <option value="All Status">All Status</option>
            <option value="New">New</option>
            <option value="Read">Read</option>
            <option value="Replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Contact List */}
      {loading ? (
        <div className="mysass-loading">
          <div className="mysass-spinner"></div>
          <p>Loading contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="mysass-empty-state">
          <div className="mysass-empty-icon">
            <i className="fas fa-comments"></i>
          </div>
          <h3>No contacts found</h3>
          <p>No contact form submissions match your current filters</p>
        </div>
      ) : (
        <div className="mysass-contacts-list">
          {filteredContacts.map((contact) => (
            <div key={contact._id} className="mysass-contact-card">
              <div className="mysass-contact-header">
                <div className="mysass-contact-info">
                  <div className="mysass-contact-name-status">
                    <h3>{contact.name}</h3>
                    <span className={`mysass-contact-status ${getStatusClass(contact.status)}`}>
                      <i className={getStatusIcon(contact.status)}></i>
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </span>
                  </div>
                  <p className="mysass-contact-email">{contact.email}</p>
                  <p className="mysass-contact-company">{contact.company}</p>
                </div>
                <div className="mysass-contact-actions">
                  <button
                    className="mysass-action-btn reply"
                    title="Reply"
                  >
                    <i className="fas fa-reply"></i>
                  </button>
                  <button
                    className="mysass-action-btn mark-read"
                    title="Mark as read"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="mysass-action-btn delete"
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div className="mysass-contact-details">
                <div className="mysass-contact-subject">
                  <strong>Subject:</strong> {contact.subject}
                </div>
                <div className="mysass-contact-message">
                  <strong>Message:</strong>
                  <p>{contact.message}</p>
                </div>
                <div className="mysass-contact-meta">
                  <span className="mysass-contact-phone">
                    <i className="fas fa-phone"></i> {contact.phone}
                  </span>
                  <span className="mysass-contact-date">
                    <i className="fas fa-calendar"></i> {formatDate(contact.submittedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactsManagement;