import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { FiCalendar, FiMoreVertical, FiEdit2 } from 'react-icons/fi';
import api from '../services/api';
import TaskForm from './TaskForm';
import type { ITask, IProject } from '@shared';
import './KanbanBoard.css';

interface KanbanBoardProps {
  tasks: ITask[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  // Fetch projects for task cards
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/api/projects');
      return response.data.data;
    },
    retry: 1,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: number; status: string }) => {
      await api.put(`/api/tasks/${taskId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Failed to update task:', error);
      alert('Failed to update task. Please try again.');
    },
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const taskId = parseInt(result.draggableId);
    const newStatus = result.destination.droppableId as ITask['status'];

    updateTaskMutation.mutate({ taskId, status: newStatus });
  };

  const columns = [
    { id: 'new' as const, title: 'New', color: '#e2e8f0', dotColor: '#4a7cff' },
    { id: 'in_progress' as const, title: 'In Progress', color: '#e2e8f0', dotColor: '#4a7cff' },
    { id: 'blocked' as const, title: 'Blocked', color: '#fee2e2', dotColor: '#ef4444' },
    { id: 'done' as const, title: 'Done', color: '#dcfce7', dotColor: '#16a34a' },
  ];

  const getTasksByStatus = (status: ITask['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  const getProjectName = (projectId?: number) => {
    if (!projectId || !projects) return 'No Project';
    const project = projects.find((p: IProject) => p.id === projectId);
    return project?.name || 'No Project';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return 'medium';
    }
  };

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return `${firstName[0]}${firstName[1] || ''}`.toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'UN';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      {editingTask && (
        <TaskForm
          task={editingTask}
          projectId={editingTask.project_id}
          onClose={() => setEditingTask(null)}
          onSuccess={() => {
            setEditingTask(null);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
          }}
        />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div key={column.id} className="kanban-column">
              {/* Column Header */}
              <div className="kanban-column-header" style={{ backgroundColor: column.color }}>
                <div className="column-title-wrapper">
                  <span className="column-dot" style={{ backgroundColor: column.dotColor }}></span>
                  <h3 className="column-title">{column.title}</h3>
                </div>
                <span className="column-count">{columnTasks.length}</span>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`kanban-column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                          >
                            <div className="task-card-header">
                              <h4 className="task-title" title={task.title}>{task.title}</h4>
                              <div className="task-actions">
                                <button 
                                  className="task-edit-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTask(task);
                                  }}
                                  title="Edit Task"
                                >
                                  <FiEdit2 />
                                </button>
                                <button className="task-more-btn">
                                  <FiMoreVertical />
                                </button>
                              </div>
                            </div>

                            <div className="task-project-tag">
                              {getProjectName(task.project_id)}
                            </div>

                            <div className="task-meta">
                              <div className="task-due-date">
                                <FiCalendar className="task-icon" />
                                <span>Due: {formatDate(task.deadline?.toString())}</span>
                              </div>
                              <div className={`task-priority priority-${getPriorityColor(task.priority)}`}>
                                {task.priority || 'Medium'}
                              </div>
                            </div>

                            {task.assignee && (
                              <div className="task-assignee">
                                <div className="assignee-avatar">
                                  {getInitials(
                                    task.assignee.first_name,
                                    task.assignee.last_name,
                                    task.assignee.email
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Empty State */}
                    {columnTasks.length === 0 && (
                      <div className="kanban-empty-state">
                        No tasks here yet
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
    </>
  );
};

export default KanbanBoard;
