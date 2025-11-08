import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { canCreateTask } from '../utils/roles';
import KanbanBoard from '../components/KanbanBoard';
import TaskForm from '../components/TaskForm';
import './ProjectTasks.css';

const ProjectTasks: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const projectId = id ? parseInt(id) : undefined;

  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      if (!id) throw new Error('Project ID is required');
      const response = await api.get('/api/tasks', { params: { project_id: id } });
      return response.data.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => {
      console.error('Failed to load tasks:', error);
    },
  });

  return (
    <div className="task-page">
      <div className="task-header">
        <div>
          <h1 className="task-title">Task Board</h1>
          <p className="task-subtitle">Manage and track tasks for this project</p>
        </div>
        {canCreateTask(user?.role) && (
          <button
            className="create-task-btn"
            onClick={() => setShowCreateForm(true)}
          >
            + Create Task
          </button>
        )}
      </div>

      {isLoading && <div className="loading">Loading tasks...</div>}
      {error && <div className="error">Failed to load tasks. Please try again later.</div>}
      {!isLoading && !error && (
        <>
          {showCreateForm && canCreateTask(user?.role) && (
            <TaskForm
              projectId={projectId}
              onClose={() => setShowCreateForm(false)}
              onSuccess={() => {
                setShowCreateForm(false);
                refetch();
              }}
            />
          )}

          <KanbanBoard tasks={tasks || []} />
        </>
      )}
    </div>
  );
};

export default ProjectTasks;
