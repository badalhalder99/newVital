import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddMemberModal from './AddMemberModal';
import '../../mysass-custom.css';

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

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

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3005/api/team-members?tenant=mysass');
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      const data = await response.json();
      setTeamMembers(data);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Delete team member
  const handleDelete = async (id) => {
    try {
      // Optimistically remove from UI first
      const originalTeamMembers = [...teamMembers];
      setTeamMembers(teamMembers.filter(member => member._id !== id));

      const response = await fetch(`http://localhost:3005/api/team-members/${id}?tenant=mysass`, {
        method: 'DELETE'
      });

      // Always refresh the list regardless of response status
      await fetchTeamMembers();
      
    } catch (err) {
      console.error('Error deleting team member:', err);
      // Always refresh to get the current state
      await fetchTeamMembers();
    }
  };

  // Handle edit
  const handleEdit = (member) => {
    setEditingMember(member);
    setShowAddModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingMember(null);
  };

  // Handle successful add/edit
  const handleMemberSaved = () => {
    fetchTeamMembers();
    handleModalClose();
  };

  if (loading) {
    return (
      <div className="mysass-dashboard" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', color: 'var(--mysass-text-secondary)' }}>
          Loading team members...
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
      <header className="mysass-team-header" style={{
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
              Team Members
            </h1>
            <p style={{
              color: 'var(--mysass-text-secondary)',
              margin: '0',
              fontSize: '0.85rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Manage leadership profiles
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: '#4F83F5',
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
          onMouseOver={(e) => e.target.style.background = '#3B6FE8'}
          onMouseOut={(e) => e.target.style.background = '#4F83F5'}
        >
          <span style={{ fontSize: '1rem' }}>+</span>
          <span className="add-member-text">Add Member</span>
        </button>
      </header>

      {/* Team Members Grid */}
      <div className="mysass-team-grid" style={{
        padding: '1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {teamMembers.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '4rem',
            color: 'var(--mysass-text-secondary)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <h3>No team members yet</h3>
            <p>Click "Add Member" to add your first team member</p>
          </div>
        ) : (
          teamMembers.map((member) => (
            <div
              key={member._id}
              className="mysass-team-card"
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
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: member.image ? `url(${member.image})` : 'linear-gradient(135deg, var(--mysass-primary), var(--mysass-secondary))',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}>
                  {!member.image && (member.name ? member.name.charAt(0).toUpperCase() : '?')}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    color: 'var(--mysass-text-primary)',
                    margin: '0 0 0.25rem 0',
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    {member.name}
                  </h3>
                  <p style={{
                    color: 'var(--mysass-text-secondary)',
                    margin: '0',
                    fontSize: '0.9rem'
                  }}>
                    {member.position}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(member)}
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
                    onClick={() => handleDelete(member._id)}
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
                marginBottom: '1rem'
              }}>
                {member.description}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem'
              }}>
                <span style={{ color: 'var(--mysass-text-secondary)' }}>
                  Order: {member.order}
                </span>
                <span style={{
                  color: member.status === 'Active' ? '#10b981' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: member.status === 'Active' ? '#10b981' : '#6b7280'
                  }}></span>
                  {member.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Member Modal */}
      {showAddModal && (
        <AddMemberModal
          member={editingMember}
          onClose={handleModalClose}
          onSave={handleMemberSaved}
        />
      )}

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .mysass-team-header {
            flex-direction: column;
            gap: 1rem !important;
            align-items: flex-start !important;
          }
          
          .mysass-team-grid {
            grid-template-columns: 1fr !important;
            padding: 1rem !important;
          }
          
          .mysass-team-card {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TeamManagement;