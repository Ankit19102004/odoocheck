import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiShield, FiBriefcase, FiUsers, FiDollarSign, FiX } from 'react-icons/fi';
import './Team.css';
import type { IUser } from '@shared';

const Team: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'team_member' as 'admin' | 'project_manager' | 'team_member' | 'sales_finance',
    hourly_rate: '',
  });
  const [error, setError] = useState('');

  const { data: users, isLoading, error: fetchError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/api/users');
      return response.data.data as IUser[];
    },
    retry: 1,
    onError: (error) => {
      console.error('Failed to load users:', error);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/users', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowAddForm(false);
      resetForm();
      setError(''); // Clear any previous errors
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create user';
      setError(errorMessage);
      console.error('Create user error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/api/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUser(null);
      resetForm();
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to update user');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to delete user');
    },
  });

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'team_member',
      hourly_rate: '',
    });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hourly_rate' ? value : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.first_name.trim()) {
      setError('First name is required');
      return;
    }
    if (!formData.last_name.trim()) {
      setError('Last name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (editingUser) {
      const updateData: any = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : 0,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      updateMutation.mutate({ id: editingUser.id, data: updateData });
    } else {
      if (!formData.password || formData.password.length < 6) {
        setError('Password is required and must be at least 6 characters');
        return;
      }
      createMutation.mutate({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : 0,
      });
    }
  };

  const handleEdit = (user: IUser) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: '',
      role: user.role,
      hourly_rate: user.hourly_rate?.toString() || '0',
    });
    setShowAddForm(true);
    setError('');
  };

  const handleDelete = (userId: number, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      deleteMutation.mutate(userId);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingUser(null);
    resetForm();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <FiShield className="role-icon admin" />;
      case 'project_manager':
        return <FiBriefcase className="role-icon manager" />;
      case 'team_member':
        return <FiUsers className="role-icon member" />;
      case 'sales_finance':
        return <FiDollarSign className="role-icon finance" />;
      default:
        return <FiUser className="role-icon" />;
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'project_manager':
        return 'Project Manager';
      case 'team_member':
        return 'Team Member';
      case 'sales_finance':
        return 'Sales/Finance';
      default:
        return role;
    }
  };

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="team-container">
      <div className="team-header">
        <div>
          <h1>User Management</h1>
          <p>Manage users, roles, and access permissions</p>
        </div>
        {(user?.role === 'admin') && (
          <button className="add-user-btn" onClick={() => { setShowAddForm(true); setEditingUser(null); resetForm(); }}>
            <FiPlus className="btn-icon" />
            Add User
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && user?.role === 'admin' && (
        <div className="user-form-modal">
          <div className="user-form-content">
            <div className="user-form-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="close-btn" onClick={handleCancel}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {!editingUser && (
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingUser}
                  />
                </div>
              )}
              {editingUser && (
                <div className="form-group">
                  <label>New Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="team_member">Team Member</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="sales_finance">Sales/Finance</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Hourly Rate (₹)</label>
                  <input
                    type="number"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && <div className="loading">Loading users...</div>}
      {fetchError && <div className="error">Failed to load users. Please try again later.</div>}
      
      {!isLoading && !fetchError && (
        <>
          <div className="users-section">
            <h2>All Users ({users?.length || 0})</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Hourly Rate</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((teamUser: IUser) => (
                    <tr key={teamUser.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {getInitials(teamUser.first_name, teamUser.last_name, teamUser.email)}
                          </div>
                          <div className="user-info">
                            <div className="user-name">
                              {teamUser.first_name} {teamUser.last_name}
                              {teamUser.id === user?.id && <span className="you-badge"> (You)</span>}
                            </div>
                            <div className="user-email">{teamUser.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="role-badge">
                          {getRoleIcon(teamUser.role)}
                          <span>{getRoleDisplay(teamUser.role)}</span>
                        </div>
                      </td>
                      <td>
                        <span className="hourly-rate">₹{teamUser.hourly_rate || 0}/hr</span>
                      </td>
                      <td>
                        <span className="status-badge active">Active</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {(user?.role === 'admin' && teamUser.id !== user?.id) && (
                            <>
                              <button 
                                className="action-btn edit" 
                                title="Edit"
                                onClick={() => handleEdit(teamUser)}
                              >
                                <FiEdit2 />
                              </button>
                              <button 
                                className="action-btn delete" 
                                title="Delete"
                                onClick={() => handleDelete(teamUser.id, `${teamUser.first_name} ${teamUser.last_name}`)}
                              >
                                <FiTrash2 />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Team;
