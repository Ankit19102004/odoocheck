import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { FiBarChart2, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import './Analytics.css';

const Analytics: React.FC = () => {
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/api/projects');
      return response.data.data;
    },
    retry: 1,
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await api.get('/api/tasks');
      return response.data.data;
    },
    retry: 1,
  });

  // Calculate analytics
  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter((p: any) => p.status === 'active').length || 0;
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t: any) => t.status === 'completed').length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>View insights and performance metrics</p>
        </div>
      </div>

      {projectsLoading || tasksLoading ? (
        <div className="loading">Loading analytics...</div>
      ) : (
        <>
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-card-header">
                <h3>Total Projects</h3>
                <FiBarChart2 className="analytics-icon" />
              </div>
              <div className="analytics-value">{totalProjects}</div>
              <div className="analytics-change positive">
                <FiTrendingUp />
                <span>Active: {activeProjects}</span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-header">
                <h3>Total Tasks</h3>
                <FiBarChart2 className="analytics-icon" />
              </div>
              <div className="analytics-value">{totalTasks}</div>
              <div className="analytics-change positive">
                <FiTrendingUp />
                <span>Completed: {completedTasks}</span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-header">
                <h3>Completion Rate</h3>
                <FiBarChart2 className="analytics-icon" />
              </div>
              <div className="analytics-value">{completionRate}%</div>
              <div className="analytics-change positive">
                <FiTrendingUp />
                <span>On track</span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-header">
                <h3>Team Performance</h3>
                <FiBarChart2 className="analytics-icon" />
              </div>
              <div className="analytics-value">Good</div>
              <div className="analytics-change positive">
                <FiTrendingUp />
                <span>Improving</span>
              </div>
            </div>
          </div>

          <div className="analytics-charts">
            <div className="chart-placeholder">
              <h3>Project Status Distribution</h3>
              <p>Chart visualization will be implemented here</p>
            </div>
            <div className="chart-placeholder">
              <h3>Task Completion Trends</h3>
              <p>Chart visualization will be implemented here</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;

