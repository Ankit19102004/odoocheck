import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { ITask, IProject, IUser } from '@shared';
import { FiX } from 'react-icons/fi';
import './TaskForm.css';

interface TaskFormProps {
  task?: ITask;
  projectId?: number;
  onClose: () => void;
  onSuccess?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, projectId, onClose, onSuccess }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    project_id: projectId || task?.project_id || '',
    title: task?.title || '',
    description: task?.description || '',
    assignee_id: task?.assignee_id?.toString() || '',
    status: task?.status || 'new',
    priority: task?.priority || 'medium',
    deadline: task?.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
    time_estimate: task?.time_estimate?.toString() || '',
    required_skills: (task?.required_skills || []) as string[],
  });
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [suggestedAssignees, setSuggestedAssignees] = useState<any[]>([]);

  // Fetch projects
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/api/projects');
      return response.data.data as IProject[];
    },
    enabled: !projectId,
    retry: 1,
  });

  // Fetch users for assignee
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/api/users');
      return response.data.data as IUser[];
    },
    retry: 1,
  });

  // Fetch all available skills
  const { data: allSkills } = useQuery({
    queryKey: ['all-skills'],
    queryFn: async () => {
      const response = await api.get('/api/skills/all');
      return response.data.data as string[];
    },
    retry: 1,
  });

  // Fetch suggested assignees when skills change
  const { data: suggestions } = useQuery({
    queryKey: ['suggested-assignees', formData.required_skills],
    queryFn: async () => {
      if (!formData.required_skills || formData.required_skills.length === 0) {
        return [];
      }
      const response = await api.get('/api/skills/suggestions', {
        params: { required_skills: formData.required_skills },
      });
      return response.data.data;
    },
    enabled: formData.required_skills && formData.required_skills.length > 0,
    retry: 1,
  });

  useEffect(() => {
    if (suggestions && Array.isArray(suggestions)) {
      setSuggestedAssignees(suggestions);
    } else {
      setSuggestedAssignees([]);
    }
  }, [suggestions]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/tasks', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to create task');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/api/tasks/${task!.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to update task');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const submitData: any = {
      project_id: parseInt(formData.project_id.toString()),
      title: formData.title,
      description: formData.description || undefined,
      status: formData.status,
      priority: formData.priority,
      deadline: formData.deadline || undefined,
      time_estimate: formData.time_estimate ? parseFloat(formData.time_estimate) : undefined,
    };

    if (formData.assignee_id) {
      submitData.assignee_id = parseInt(formData.assignee_id);
    }

    // Temporarily disabled until database migration is run
    // if (formData.required_skills && formData.required_skills.length > 0) {
    //   submitData.required_skills = formData.required_skills;
    // }

    if (isEditing) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.required_skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        required_skills: [...prev.required_skills, skill],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.filter(s => s !== skillToRemove),
    }));
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // Filter projects based on user role
  const availableProjects = projects?.filter((p: IProject) => {
    if (user?.role === 'admin' || user?.role === 'sales_finance') return true;
    if (user?.role === 'project_manager') return p.manager_id === user.id;
    return false;
  }) || [];

  return (
    <div className="task-form-modal">
      <div className="task-form-content">
        <div className="task-form-header">
          <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!projectId && (
            <div className="form-group">
              <label htmlFor="project_id">Project *</label>
              <select
                id="project_id"
                name="project_id"
                value={formData.project_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a project</option>
                {availableProjects.map((project: IProject) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter task title"
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
              placeholder="Enter task description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignee_id">Assign To</label>
              <select
                id="assignee_id"
                name="assignee_id"
                value={formData.assignee_id}
                onChange={handleInputChange}
              >
                <option value="">Unassigned</option>
                {users?.map((user: IUser) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
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
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
              </select>
            </div>

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
          </div>

          <div className="form-group">
            <label htmlFor="time_estimate">Time Estimate (hours)</label>
            <input
              type="number"
              id="time_estimate"
              name="time_estimate"
              value={formData.time_estimate}
              onChange={handleInputChange}
              min="0"
              step="0.5"
              placeholder="0"
            />
          </div>

          {/* Skills feature temporarily disabled until database migration is run */}
          {/* Uncomment after running: oneflow-db/RUN-THIS-NOW.sql */}
          {/* 
          <div className="form-group">
            <label htmlFor="required_skills">Required Skills</label>
            <div className="skill-input-container">
              <input
                type="text"
                id="skill-input"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={handleSkillKeyPress}
                placeholder="Type a skill and press Enter"
                list="skills-list"
              />
              <datalist id="skills-list">
                {allSkills?.map((skill: string) => (
                  <option key={skill} value={skill} />
                ))}
              </datalist>
              <button type="button" onClick={addSkill} className="btn-add-skill">
                Add
              </button>
            </div>
            {formData.required_skills.length > 0 && (
              <div className="skills-list">
                {formData.required_skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="skill-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {suggestedAssignees.length > 0 && (
              <div className="suggested-assignees">
                <p className="suggestions-label">Suggested Assignees:</p>
                {suggestedAssignees.slice(0, 5).map((suggestion: any) => (
                  <div
                    key={suggestion.user.id}
                    className="suggestion-item"
                    onClick={() => setFormData(prev => ({ ...prev, assignee_id: suggestion.user.id.toString() }))}
                  >
                    <span>{suggestion.user.first_name} {suggestion.user.last_name}</span>
                    <span className="match-score">
                      {suggestion.match_percentage}% match ({suggestion.matching_skills.length} skills)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          */}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {isEditing ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

