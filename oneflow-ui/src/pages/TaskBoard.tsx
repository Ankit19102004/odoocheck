import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { canCreateTask } from '../utils/roles';
import KanbanBoard from '../components/KanbanBoard';
import TaskForm from '../components/TaskForm';
import { FiPlus } from 'react-icons/fi';
import './TaskBoard.css';

const TaskBoard: React.FC = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', 'all'],
    queryFn: async () => {
      const response = await api.get('/api/tasks');
      return response.data.data;
    },
    retry: 1,
    onError: (error) => {
      console.error('Failed to load tasks:', error);
    },
  });

  return (
    <div className="task-board-container">
      <div className="task-board-header">
        <div>
          <h1>Task Board</h1>
          <p>Manage and track tasks across all projects</p>
        </div>
        {canCreateTask(user?.role) && (
          <button
            className="create-task-btn"
            onClick={() => setShowCreateForm(true)}
          >
            <FiPlus className="btn-icon" />
            Create Task
          </button>
        )}
      </div>

      {isLoading && <div className="loading">Loading tasks...</div>}
      {error && <div className="error">Failed to load tasks. Please try again later.</div>}
      {!isLoading && !error && (
        <>
          {showCreateForm && canCreateTask(user?.role) && (
            <TaskForm
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

export default TaskBoard;

