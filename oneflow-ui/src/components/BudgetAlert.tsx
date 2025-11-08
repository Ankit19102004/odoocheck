import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { formatCurrency } from '../utils/currency';
import { FiAlertTriangle, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import './BudgetAlert.css';

interface BudgetAlertProps {
  projectId?: number;
}

interface ProjectBudget {
  id: number;
  name: string;
  budget: number;
  spent: number;
  percentage: number;
  status: 'safe' | 'warning' | 'danger' | 'critical';
}

const BudgetAlert: React.FC<BudgetAlertProps> = ({ projectId }) => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', projectId || 'all'],
    queryFn: async () => {
      if (projectId) {
        try {
          const response = await api.get(`/api/projects/${projectId}/analytics`);
          const projectResponse = await api.get(`/api/projects/${projectId}`);
          return [{
            ...projectResponse.data.data,
            cost: response.data.data.cost || 0,
          }];
        } catch {
          return [];
        }
      } else {
        const response = await api.get('/api/projects');
        const allProjects = response.data.data;
        // Fetch analytics for each project
        const projectsWithBudget = await Promise.all(
          allProjects.map(async (project: any) => {
            try {
              const analyticsResponse = await api.get(`/api/projects/${project.id}/analytics`);
              return {
                ...project,
                cost: analyticsResponse.data.data.cost || 0,
              };
            } catch {
              return {
                ...project,
                budget: project.budget || 0,
                cost: 0,
              };
            }
          })
        );
        return projectsWithBudget;
      }
    },
    retry: 1,
  });

  const calculateBudgetStatus = (budget: number, spent: number): 'safe' | 'warning' | 'danger' | 'critical' => {
    if (!budget || budget === 0) return 'safe';
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'critical';
    if (percentage >= 90) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'safe';
  };

  const getBudgetData = (): ProjectBudget[] => {
    if (!projects) return [];
    return projects
      .filter((project: any) => project.budget && parseFloat(project.budget?.toString() || '0') > 0)
      .map((project: any) => {
        const spent = parseFloat((project.cost || 0).toString());
        const budget = parseFloat(project.budget?.toString() || '0');
        const percentage = budget > 0 ? (spent / budget) * 100 : 0;
        const status = calculateBudgetStatus(budget, spent);
        return {
          id: project.id,
          name: project.name,
          budget,
          spent,
          percentage,
          status,
        };
      })
      .filter((p: ProjectBudget) => p.status !== 'safe')
      .sort((a: ProjectBudget, b: ProjectBudget) => b.percentage - a.percentage);
  };

  const budgetAlerts = getBudgetData();

  if (isLoading) {
    return <div className="budget-alert-loading">Loading budget alerts...</div>;
  }

  if (budgetAlerts.length === 0) {
    return null;
  }

  const getAlertIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <FiAlertTriangle className="alert-icon critical" />;
      case 'danger':
        return <FiAlertCircle className="alert-icon danger" />;
      case 'warning':
        return <FiAlertCircle className="alert-icon warning" />;
      default:
        return <FiCheckCircle className="alert-icon safe" />;
    }
  };

  const getAlertMessage = (status: string, percentage: number) => {
    switch (status) {
      case 'critical':
        return `Budget exceeded by ${(percentage - 100).toFixed(1)}%`;
      case 'danger':
        return `Budget at ${percentage.toFixed(1)}% - Critical threshold`;
      case 'warning':
        return `Budget at ${percentage.toFixed(1)}% - Approaching limit`;
      default:
        return '';
    }
  };

  return (
    <div className="budget-alerts-container">
      <div className="budget-alerts-header">
        <h3>Budget Alerts</h3>
        <span className="alert-count">{budgetAlerts.length}</span>
      </div>
      <div className="budget-alerts-list">
        {budgetAlerts.map((alert) => (
          <div key={alert.id} className={`budget-alert budget-alert-${alert.status}`}>
            <div className="alert-content">
              {getAlertIcon(alert.status)}
              <div className="alert-details">
                <div className="alert-project-name">{alert.name}</div>
                <div className="alert-message">{getAlertMessage(alert.status, alert.percentage)}</div>
                <div className="alert-budget-info">
                  <span>Spent: {formatCurrency(alert.spent)}</span>
                  <span>Budget: {formatCurrency(alert.budget)}</span>
                </div>
              </div>
            </div>
            <div className="budget-progress-bar">
              <div
                className={`budget-progress budget-progress-${alert.status}`}
                style={{ width: `${Math.min(alert.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetAlert;

