import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { canEditProject, canDeleteProject, canManageFinancials } from '../utils/roles';
import { formatCurrency } from '../utils/currency';
import BudgetAlert from '../components/BudgetAlert';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) throw new Error('Project ID is required');
      const response = await api.get(`/api/projects/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => {
      console.error('Failed to load project:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Project ID is required');
      await api.delete(`/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/projects');
    },
    onError: (error) => {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Please try again.');
    },
  });

  if (isLoading) {
    return <div>Loading project...</div>;
  }

  if (error) {
    return <div>Failed to load project. Please try again later.</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/projects">← Back to Projects</Link>
        {(canEditProject(user?.role) || canDeleteProject(user?.role)) && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            {canEditProject(user?.role) && (
              <button className="btn btn-secondary" onClick={() => navigate(`/projects/${id}/edit`)}>
                Edit Project
              </button>
            )}
            {canDeleteProject(user?.role) && (
              <button className="btn btn-secondary" onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white' }}>
                Delete Project
              </button>
            )}
          </div>
        )}
      </div>
      
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Link to={`/projects/${id}/tasks`} className="btn btn-primary">
          View Tasks
        </Link>
        {canManageFinancials(user?.role) && (
          <Link to={`/projects/${id}/settings`} className="btn btn-secondary">
            Project Settings
          </Link>
        )}
      </div>

      {/* Budget Alert */}
      {project.budget && (user?.role === 'admin' || user?.role === 'project_manager' || user?.role === 'sales_finance') && (
        <div style={{ marginTop: '2rem' }}>
          <BudgetAlert projectId={project.id} />
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h2>Project Information</h2>
        <p><strong>Status:</strong> {project.status}</p>
        <p><strong>Priority:</strong> {project.priority}</p>
        {project.deadline && (
          <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
        )}
        {project.budget && (
          <p><strong>Budget:</strong> {formatCurrency(project.budget)}</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;