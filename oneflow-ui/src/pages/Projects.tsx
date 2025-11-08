import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { canCreateProject } from "../utils/roles";
import { FiPlus, FiSearch } from "react-icons/fi";
import type { IProject } from "@shared";
import ProjectCard from "../components/ProjectCard";
import "./Projects.css";
const Projects: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || "");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Update search query when URL param changes
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects", statusFilter, searchQuery],
    queryFn: async () => {
      try {
        const params: any = {};
        if (statusFilter) params.status = statusFilter;
        if (searchQuery) params.search = searchQuery;
        const response = await api.get("/api/projects", { params });
        if (response.data && response.data.success) {
          return response.data.data || [];
        }
        throw new Error(response.data?.error || 'Failed to load projects');
      } catch (err: any) {
        console.error("Failed to load projects:", err);
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
      console.error("Failed to load projects:", error);
    },
  });
  return (
    <div className="projects-page">
      {" "}
      <div className="projects-header">
        {" "}
        <div>
          {" "}
          <h1>Active Projects</h1>{" "}
          <p>Track progress and manage your ongoing projects</p>{" "}
        </div>{" "}
        <div className="projects-actions">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {canCreateProject(user?.role) && (
            <button
              className="create-project-btn"
              onClick={() => navigate("/projects/new")}
            >
              <FiPlus className="btn-icon" /> Create Project
            </button>
          )}
        </div>
      </div>{" "}
      {isLoading && <div className="loading">Loading projects...</div>}{" "}
      {error && (
        <div className="error">
          <strong>Error loading projects:</strong> {error instanceof Error ? error.message : 'Failed to load projects. Please try again later.'}
          <br />
          <small>If this persists, please check your connection and ensure the backend server is running.</small>
        </div>
      )}{" "}
      {!isLoading && !error && (
        <>
          {" "}
          <div className="projects-grid">
            {" "}
            {projects?.map((project: IProject) => (
              <ProjectCard key={project.id} project={project} />
            ))}{" "}
          </div>{" "}
          {projects?.length === 0 && (
            <div className="empty-state">
              {" "}
              <p>No projects found.</p>{" "}
            </div>
          )}{" "}
        </>
      )}{" "}
    </div>
  );
};
export default Projects;
