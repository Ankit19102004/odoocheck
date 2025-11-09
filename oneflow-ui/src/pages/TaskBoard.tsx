import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { canCreateTask } from '../utils/roles';
import KanbanBoard from '../components/KanbanBoard';
import TaskForm from '../components/TaskForm';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import type { ITask } from '@shared';
import './TaskBoard.css';

const TaskBoard: React.FC = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [projectFilter, setProjectFilter] = useState<string>('');

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

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/api/projects');
      return response.data.data;
    },
    retry: 1,
  });

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter((task: ITask) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          task.title?.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter && task.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter && task.priority !== priorityFilter) {
        return false;
      }

      // Project filter
      if (projectFilter && task.project_id?.toString() !== projectFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, projectFilter]);

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

      {/* Search and Filter Section */}
      <div className="task-board-filters">
        <div className="search-filter-group">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <FiFilter className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="done">Done</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Projects</option>
              {projects?.map((project: any) => (
                <option key={project.id} value={project.id.toString()}>
                  {project.name}
                </option>
              ))}
            </select>
            {(statusFilter || priorityFilter || projectFilter || searchQuery) && (
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setStatusFilter('');
                  setPriorityFilter('');
                  setProjectFilter('');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
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

          <KanbanBoard tasks={filteredTasks || []} />
        </>
      )}
    </div>
  );
};

export default TaskBoard;

