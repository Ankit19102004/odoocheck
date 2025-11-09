import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { canManageFinancials } from '../utils/roles';
import { formatCurrency } from '../utils/currency';
import { FiArrowLeft, FiSave, FiDollarSign, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import './ProjectSettings.css';

const ProjectSettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    budget: '',
    deadline: '',
    status: 'active' as 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user can manage financials
  React.useEffect(() => {
    if (user && !canManageFinancials(user.role)) {
      navigate(`/projects/${id}`);
    }
  }, [user, navigate, id]);

  // Load project data
  const { data: project, isLoading, error: projectError } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) throw new Error('Project ID is required');
      const response = await api.get(`/api/projects/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    retry: 1,
    onSuccess: (data) => {
      setFormData({
        budget: data.budget?.toString() || '',
        deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '',
        status: data.status || 'active',
      });
    },
    onError: (error) => {
      console.error('Failed to load project:', error);
    },
  });

  // Load project analytics
  const { data: analytics } = useQuery({
    queryKey: ['project-analytics', id],
    queryFn: async () => {
      if (!id) throw new Error('Project ID is required');
      const response = await api.get(`/api/analytics/project/${id}/summary`);
      return response.data.data;
    },
    enabled: !!id && !!project,
    retry: 1,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!id) throw new Error('Project ID is required');
      const response = await api.put(`/api/projects/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setSuccess('Project settings updated successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to update project settings');
      setSuccess('');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const submitData: any = {
      status: formData.status,
    };

    if (formData.budget) {
      submitData.budget = parseFloat(formData.budget);
    }

    if (formData.deadline) {
      submitData.deadline = formData.deadline;
    }

    updateMutation.mutate(submitData);
  };

  if (isLoading) {
    return <div className="loading">Loading project settings...</div>;
  }

  if (projectError) {
    return <div className="error">Failed to load project. Please try again later.</div>;
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  const budgetUsed = analytics?.cost || 0;
  const budgetRemaining = formData.budget ? parseFloat(formData.budget) - budgetUsed : 0;
  const budgetPercentage = formData.budget ? (budgetUsed / parseFloat(formData.budget)) * 100 : 0;

  return (
    <div className="project-settings-container">
      <div className="project-settings-header">
        <Link to={`/projects/${id}`} className="back-link">
          <FiArrowLeft /> Back to Project
        </Link>
        <h1>Project Settings</h1>
        <p>{project.name}</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <FiAlertCircle /> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <FiAlertCircle /> {success}
        </div>
      )}

      <div className="project-settings-content">
        <div className="settings-form-section">
          <h2>Project Configuration</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="status">
                <FiAlertCircle className="label-icon" />
                Project Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="budget">
                <FiDollarSign className="label-icon" />
                Budget
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="Enter project budget"
              />
              {formData.budget && (
                <div className="budget-info">
                  <div className="budget-bar">
                    <div
                      className="budget-bar-fill"
                      style={{
                        width: `${Math.min(100, budgetPercentage)}%`,
                        backgroundColor: budgetPercentage > 90 ? '#ef4444' : budgetPercentage > 75 ? '#f59e0b' : '#10b981',
                      }}
                    />
                  </div>
                  <div className="budget-details">
                    <span>Used: {formatCurrency(budgetUsed)}</span>
                    <span>Remaining: {formatCurrency(budgetRemaining)}</span>
                    <span>{budgetPercentage.toFixed(1)}% used</span>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="deadline">
                <FiCalendar className="label-icon" />
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updateMutation.isPending}
              >
                <FiSave /> Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/projects/${id}`)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {analytics && (
          <div className="settings-analytics-section">
            <h2>Financial Overview</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Revenue</h3>
                <div className="analytics-value">{formatCurrency(analytics.revenue || 0)}</div>
              </div>
              <div className="analytics-card">
                <h3>Total Cost</h3>
                <div className="analytics-value">{formatCurrency(analytics.cost || 0)}</div>
              </div>
              <div className="analytics-card">
                <h3>Profit</h3>
                <div className={`analytics-value ${(analytics.profit || 0) >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(analytics.profit || 0)}
                </div>
              </div>
              <div className="analytics-card">
                <h3>Hours Logged</h3>
                <div className="analytics-value">{analytics.hours_logged || 0}h</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSettings;

