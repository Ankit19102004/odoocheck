import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar } from 'react-icons/fi';
import type { IProject } from '@shared';

interface ProjectCardProps {
  project: IProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
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

  // Calculate progress (simplified - in real app, calculate from tasks)
  const calculateProgress = () => {
    switch (project.status) {
      case "completed":
        return 100;
      case "active":
        return Math.floor(Math.random() * 50) + 50; // 50-100% for demo
      case "planning":
        return Math.floor(Math.random() * 30) + 10; // 10-40% for demo
      default:
        return 0;
    }
  };

  const progress = calculateProgress();

  const getStatusText = () => {
    if (progress >= 90) return "Almost Done";
    if (progress >= 50) return "On Track";
    if (progress >= 25) return "In Progress";
    return "Getting Started";
  };

  // Mock team members for demo (in real app, get from project)
  const teamMembers = [
    { initials: "AM", name: "Alice Manager" },
    { initials: "JS", name: "John Smith" },
    { initials: "RD", name: "Robert Doe" },
  ].slice(0, Math.min(4, Math.floor(Math.random() * 4) + 1));

  return (
    <Link to={`/projects/${project.id}`} className="project-card-modern">
      <div className="project-card-header">
        <h3>{project.name}</h3>
        <span className={`priority-badge priority-${getPriorityColor(project.priority)}`}>
          {project.priority}
        </span>
      </div>
      
      <div className="project-client">
        {project.manager?.first_name && project.manager?.last_name
          ? `${project.manager.first_name} ${project.manager.last_name}`
          : "Client"}
      </div>

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
          <span>
            Due: {project.deadline 
              ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : "No deadline"}
          </span>
        </div>
        <div className="project-status-badge">
          {getStatusText()}
        </div>
      </div>

      {teamMembers.length > 0 && (
        <div className="project-team">
          <div className="team-avatars">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="team-avatar"
                title={member.name}
              >
                {member.initials}
              </div>
            ))}
          </div>
        </div>
      )}
    </Link>
  );
};

export default ProjectCard;
