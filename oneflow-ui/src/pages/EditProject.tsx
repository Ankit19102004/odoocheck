import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { canEditProject } from '../utils/roles';
import type { IProject, IUser } from '@shared';
import './EditProject.css';

const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager_id: '',
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    budget: '',
    status: 'planning' as 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  // Check if user can edit projects
  useEffect(() => {
    if (user && !canEditProject(user.role)) {
      navigate('/projects');
    }
  }, [user, navigate]);

  // Load project data
  const { data: project, isLoading: projectLoading, error: projectError } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) throw new Error('Project ID is required');
      const response = await api.get(`/api/projects/${id}`);
      return response.data.data as IProject;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => {
      console.error('Failed to load project:', error);
    },
  });

  // Load users for manager selection (only if admin)
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/api/users');
      return response.data.data as IUser[];
    },
    enabled: user?.role === 'admin',
    retry: 1,
  });

  // Populate form when project data is loaded
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        manager_id: project.manager_id?.toString() || '',
        deadline: project.deadline 
          ? new Date(project.deadline).toISOString().split('T')[0]
          : '',
        priority: project.priority || 'medium',
        budget: project.budget?.toString() || '',
        status: project.status || 'planning',
        tags: project.tags?.map(tag => tag.tag) || [],
      });
    }
  }, [project]);

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!id) throw new Error('Project ID is required');
      const response = await api.put(`/api/projects/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate(`/projects/${id}`);
    },
    onError: (error: any) => {
      console.error('Failed to update project:', error);
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || 'Failed to update project. Please try again.';
      setError(errorMessage);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const submitData: any = {
      name: formData.name,
      description: formData.description || undefined,
      deadline: formData.deadline || undefined,
      priority: formData.priority,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      status: formData.status,
      tags: formData.tags,
    };

    // Only include manager_id if user is admin and it's changed
    if (user?.role === 'admin' && formData.manager_id) {
      submitData.manager_id = parseInt(formData.manager_id);
    }

    updateMutation.mutate(submitData);
  };

  if (projectLoading) {
    return (
      <div className="edit-project-container">
        <div className="loading">Loading project...</div>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="edit-project-container">
        <div className="error">Failed to load project. Please try again later.</div>
        <Link to="/projects" className="btn btn-primary">Back to Projects</Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="edit-project-container">
        <div className="error">Project not found</div>
        <Link to="/projects" className="btn btn-primary">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="edit-project-container">
      <div className="edit-project-header">
        <Link to={`/projects/${id}`} className="back-link">← Back to Project</Link>
        <h1>Edit Project</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-project-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter project name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Enter project description"
            />
          </div>

          {user?.role === 'admin' && users && (
            <div className="form-group">
              <label htmlFor="manager_id">Project Manager</label>
              <select
                id="manager_id"
                name="manager_id"
                value={formData.manager_id}
                onChange={handleInputChange}
              >
                <option value="">Select a manager</option>
                {users
                  .filter(u => u.role === 'project_manager' || u.role === 'admin')
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        <div className="form-section">
          <h2>Project Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
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
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="deadline">Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="budget">Budget (₹)</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Tags</h2>
          <div className="form-group">
            <label htmlFor="tagInput">Add Tags</label>
            <div className="tag-input-group">
              <input
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Enter a tag and press Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="tags-container">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <Link to={`/projects/${id}`} className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;

