import React, { useState, useEffect } from 'react';
import AddClientModal from './AddClientModal';

const ClientsManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3011/api/clients?tenant=mysass');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setShowAddModal(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingClient(null);
  };

  const handleClientSaved = () => {
    fetchClients();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    try {
      // Optimistically remove from UI first
      const originalClients = [...clients];
      setClients(clients.filter(client => client._id !== id));
      
      const response = await fetch(`http://localhost:3011/api/clients/${id}?tenant=mysass`, {
        method: 'DELETE'
      });
      
      // Always refresh the list regardless of response status
      await fetchClients();
    } catch (err) {
      console.error('Error deleting client:', err);
      await fetchClients();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="mysass-clients-container">
      <div className="mysass-clients-header">
        <div className="mysass-header-left">
          <button className="mysass-back-btn" onClick={() => window.history.back()}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="mysass-header-text">
            <h2>Clients</h2>
            <p>Manage client logos and information</p>
          </div>
        </div>
        <button className="mysass-add-client-btn" onClick={handleAddClient}>
          <i className="fas fa-plus"></i> Add Client
        </button>
      </div>

      {loading ? (
        <div className="mysass-loading">
          <div className="mysass-spinner"></div>
          <p>Loading clients...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="mysass-empty-state">
          <div className="mysass-empty-icon">
            <i className="fas fa-users"></i>
          </div>
          <h3>No clients yet</h3>
          <p>Add your first client to get started</p>
          <button className="mysass-add-btn-empty" onClick={handleAddClient}>
            <i className="fas fa-plus"></i> Add First Client
          </button>
        </div>
      ) : (
        <div className="mysass-clients-grid">
          {clients.map((client) => (
            <div key={client._id} className="mysass-client-card">
              <div className="mysass-client-header">
                <div className="mysass-client-logo">
                  {client.logo ? (
                    <img src={client.logo} alt={client.name} />
                  ) : (
                    <div className="mysass-client-logo-placeholder">
                      <i className="fas fa-building"></i>
                    </div>
                  )}
                </div>
                <div className="mysass-client-info">
                  <h3>{client.name}</h3>
                  <p className="mysass-client-order">Order: {client.order}</p>
                </div>
                <div className="mysass-client-actions">
                  <button
                    className="mysass-edit-btn"
                    onClick={() => handleEditClient(client)}
                    title="Edit client"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="mysass-delete-btn"
                    onClick={() => handleDelete(client._id)}
                    title="Delete client"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="mysass-client-meta">
                <span className="mysass-client-date">
                  Created: {formatDate(client.createdAt)}
                </span>
                <span className={`mysass-client-status ${client.status?.toLowerCase()}`}>
                  {client.status || 'Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddClientModal
          client={editingClient}
          onClose={handleCloseModal}
          onClientSaved={handleClientSaved}
        />
      )}
    </div>
  );
};

export default ClientsManagement;