import React, { useState, useEffect } from 'react';
import AddUserModal from './AddUserModal';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3011/api/admin-users?tenant=mysass');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
  };

  const handleUserSaved = () => {
    fetchUsers();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    try {
      // Optimistically remove from UI first
      const originalUsers = [...users];
      setUsers(users.filter(user => user._id !== id));
      
      const response = await fetch(`http://localhost:3011/api/admin-users/${id}?tenant=mysass`, {
        method: 'DELETE'
      });
      
      // Always refresh the list regardless of response status
      await fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      await fetchUsers();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusClass = (status) => {
    return status === 'active' ? 'active' : 'inactive';
  };

  return (
    <div className="mysass-users-container">
      <div className="mysass-users-header">
        <div className="mysass-header-left">
          <button className="mysass-back-btn" onClick={() => window.history.back()}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="mysass-header-text">
            <h2>User Management</h2>
            <p>Manage admin users</p>
          </div>
        </div>
        <button className="mysass-add-user-btn" onClick={handleAddUser}>
          <i className="fas fa-plus"></i> Add User
        </button>
      </div>

      {loading ? (
        <div className="mysass-loading">
          <div className="mysass-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="mysass-empty-state">
          <div className="mysass-empty-icon">
            <i className="fas fa-users"></i>
          </div>
          <h3>No users yet</h3>
          <p>Add your first admin user to get started</p>
          <button className="mysass-add-btn-empty" onClick={handleAddUser}>
            <i className="fas fa-plus"></i> Add First User
          </button>
        </div>
      ) : (
        <div className="mysass-users-grid">
          {users.map((user) => (
            <div key={user._id} className="mysass-user-card">
              <div className="mysass-user-header">
                <div className="mysass-user-info">
                  <h3>{user.email}</h3>
                  <p className="mysass-user-role">{user.role || 'Admin'}</p>
                </div>
                <div className="mysass-user-actions">
                  <button
                    className="mysass-edit-btn"
                    onClick={() => handleEditUser(user)}
                    title="Edit user"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="mysass-delete-btn"
                    onClick={() => handleDelete(user._id)}
                    title="Delete user"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div className="mysass-user-details">
                <div className="mysass-user-meta">
                  <span className="mysass-user-date">
                    Created: {formatDate(user.createdAt)}
                  </span>
                  <span className="mysass-user-date">
                    Last Login: {formatDate(user.lastLogin)}
                  </span>
                </div>
                <div className="mysass-user-status-container">
                  <span className={`mysass-user-status ${getStatusClass(user.status)}`}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddUserModal
          user={editingUser}
          onClose={handleCloseModal}
          onUserSaved={handleUserSaved}
        />
      )}
    </div>
  );
};

export default UsersManagement;