import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FiCheckCircle, FiClock, FiAlertCircle, FiDollarSign, FiCalendar } from "react-icons/fi";
import BudgetAlert from "../components/BudgetAlert";
import type { IProject, ITask } from '@shared';
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: projects, isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const response = await api.get("/api/projects");
        if (response.data && response.data.success) {
          return response.data.data || [];
        }
        throw new Error(response.data?.error || 'Failed to load projects');
      } catch (err: any) {
        console.error('Failed to load projects:', err);
        if (err.response?.data?.error) {
          throw new Error(err.response.data.error);
        }
        if (err.message) {
          throw err;
        }
        throw new Error('Failed to load projects. Please check your connection and try again.');
      }
    },
    retry: 1,
    onError: (error: any) => {
      console.error('Failed to load projects:', error);
    },
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await api.get("/api/tasks");
      return response.data.data;
    },
    retry: 1,
  });

  const roleBasedMessage = () => {
    switch (user?.role) {
      case "admin":
        return "👑 You have full admin access to all features";
      case "project_manager":
        return "Welcome! You can manage projects and team tasks.";
      case "sales_finance":
        return "Welcome! Manage sales, invoices, and financial data.";
      case "team_member":
        return "Welcome! View and update your assigned tasks.";
      default:
        return "Welcome to OneFlow!";
    }
  };

  const activeProjects = projects?.filter((p: IProject) => p.status === "active").length || 0;
  const pendingTasks = tasks?.filter((t: ITask) => t.status !== "done").length || 0;
  const blockedTasks = tasks?.filter((t: ITask) => t.status === "blocked").length || 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      default:
        return "medium";
    }
  };

  const calculateProgress = (project: IProject) => {
    // Calculate progress based on tasks if available
    if (tasks) {
      const projectTasks = tasks.filter((t: ITask) => t.project_id === project.id);
      if (projectTasks.length > 0) {
        const completedTasks = projectTasks.filter((t: ITask) => t.status === "done").length;
        return Math.round((completedTasks / projectTasks.length) * 100);
      }
    }
    // Default progress based on status
    switch (project.status) {
      case "completed":
        return 100;
      case "active":
        return 50;
      case "planning":
        return 25;
      default:
        return 0;
    }
  };

  const getStatusText = (project: IProject) => {
    const progress = calculateProgress(project);
    if (progress >= 90) return "Almost Done";
    if (progress >= 50) return "On Track";
    if (progress >= 25) return "In Progress";
    return "Getting Started";
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's a complete overview of all projects and activities.</p>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-text">
            <h2>
              Welcome back, <strong>{user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.first_name || user?.email || "Admin User"}</strong>
            </h2>
            <p>{roleBasedMessage()}</p>
          </div>
          <div className="welcome-icon">
            <span>👤</span>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {(user?.role === 'admin' || user?.role === 'project_manager' || user?.role === 'sales_finance') && (
        <BudgetAlert />
      )}

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card stat-card-green">
          <div className="stat-icon green">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Active Projects</h3>
            <p className="stat-value">{activeProjects}</p>
            <p className="stat-change positive">📈 +2 vs last month</p>
          </div>
        </div>

        <div className="stat-card stat-card-yellow">
          <div className="stat-icon yellow">
            <FiClock />
          </div>
          <div className="stat-content">
            <h3>Pending Tasks</h3>
            <p className="stat-value">{pendingTasks}</p>
            <p className="stat-change negative">📉 -5 vs last month</p>
          </div>
        </div>

        <div className="stat-card stat-card-red">
          <div className="stat-icon red">
            <FiAlertCircle />
          </div>
          <div className="stat-content">
            <h3>Blocked Items</h3>
            <p className="stat-value">{blockedTasks}</p>
            <p className="stat-change positive">📈 +1 vs last month</p>
          </div>
        </div>

        <div className="stat-card stat-card-blue">
          <div className="stat-icon blue">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <h3>Revenue (MTD)</h3>
            <p className="stat-value">₹42.5k</p>
            <p className="stat-change positive">📈 +12% vs last month</p>
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="projects-section">
        <div className="projects-header">
          <h2>Active Projects</h2>
          <p>Track progress and manage your ongoing projects.</p>
        </div>

        {projectsLoading && <div className="loading">Loading projects...</div>}
        {projectsError && <div className="error">Failed to load projects. Please try again later.</div>}
        {!projectsLoading && !projectsError && (
          <div className="projects-grid">
            {projects?.slice(0, 4).map((project: IProject) => {
              const progress = calculateProgress(project);
              const statusText = getStatusText(project);
              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="project-card-modern"
                >
                  <div className="project-card-header">
                    <h3>{project.name}</h3>
                    <span className={`priority-badge priority-${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                  <div className="project-client">{project.manager?.first_name || "Client"}</div>
                  
                  <div className="project-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-percentage">{progress}%</span>
                  </div>

                  <div className="project-meta">
                    <div className="project-due-date">
                      <FiCalendar className="icon" />
                      <span>Due: {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "No deadline"}</span>
                    </div>
                    <div className="project-status-badge">
                      {statusText}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
