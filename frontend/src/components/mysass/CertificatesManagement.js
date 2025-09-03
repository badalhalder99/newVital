import React, { useState, useEffect } from 'react';
import AddCertificateModal from './AddCertificateModal';

const CertificatesManagement = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3011/api/certificates?tenant=mysass');
      if (!response.ok) {
        throw new Error('Failed to fetch certificates');
      }
      const data = await response.json();
      setCertificates(data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCertificate = () => {
    setEditingCertificate(null);
    setShowAddModal(true);
  };

  const handleEditCertificate = (certificate) => {
    setEditingCertificate(certificate);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCertificate(null);
  };

  const handleCertificateSaved = () => {
    fetchCertificates();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    try {
      // Optimistically remove from UI first
      const originalCertificates = [...certificates];
      setCertificates(certificates.filter(certificate => certificate._id !== id));
      
      const response = await fetch(`http://localhost:3011/api/certificates/${id}?tenant=mysass`, {
        method: 'DELETE'
      });
      
      // Always refresh the list regardless of response status
      await fetchCertificates();
    } catch (err) {
      console.error('Error deleting certificate:', err);
      await fetchCertificates();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="mysass-certificates-container">
      <div className="mysass-certificates-header">
        <div className="mysass-header-left">
          <button className="mysass-back-btn" onClick={() => window.history.back()}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="mysass-header-text">
            <h2>Certificates</h2>
            <p>Manage certificates and awards</p>
          </div>
        </div>
        <button className="mysass-add-certificate-btn" onClick={handleAddCertificate}>
          <i className="fas fa-plus"></i> Add Certificate
        </button>
      </div>

      {loading ? (
        <div className="mysass-loading">
          <div className="mysass-spinner"></div>
          <p>Loading certificates...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="mysass-empty-state">
          <div className="mysass-empty-icon">
            <i className="fas fa-award"></i>
          </div>
          <h3>No certificates yet</h3>
          <p>Add your first certificate to get started</p>
          <button className="mysass-add-btn-empty" onClick={handleAddCertificate}>
            <i className="fas fa-plus"></i> Add First Certificate
          </button>
        </div>
      ) : (
        <div className="mysass-certificates-grid">
          {certificates.map((certificate) => (
            <div key={certificate._id} className="mysass-certificate-card">
              <div className="mysass-certificate-header">
                <div className="mysass-certificate-logo">
                  {certificate.logo ? (
                    <img src={certificate.logo} alt={certificate.name} />
                  ) : (
                    <div className="mysass-certificate-logo-placeholder">
                      <i className="fas fa-award"></i>
                    </div>
                  )}
                </div>
                <div className="mysass-certificate-info">
                  <h3>{certificate.name}</h3>
                  <p className="mysass-certificate-order">Order: {certificate.order}</p>
                </div>
                <div className="mysass-certificate-actions">
                  <button
                    className="mysass-edit-btn"
                    onClick={() => handleEditCertificate(certificate)}
                    title="Edit certificate"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="mysass-delete-btn"
                    onClick={() => handleDelete(certificate._id)}
                    title="Delete certificate"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="mysass-certificate-meta">
                <span className="mysass-certificate-date">
                  Created: {formatDate(certificate.createdAt)}
                </span>
                <span className={`mysass-certificate-status ${certificate.status?.toLowerCase()}`}>
                  {certificate.status || 'Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddCertificateModal
          certificate={editingCertificate}
          onClose={handleCloseModal}
          onCertificateSaved={handleCertificateSaved}
        />
      )}
    </div>
  );
};

export default CertificatesManagement;