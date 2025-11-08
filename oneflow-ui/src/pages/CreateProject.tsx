import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateProject.css";

const CreateProject: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    client: "",
    manager: "",
    priority: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "New",
    description: "",
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Project Created:", formData);
    navigate("/projects");
  };

  return (
    <div className="create-project-container">
      <h1>Project Information</h1>
      <p className="subtitle">Enter the basic information about your project</p>

      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-left">
          <label>
            Project Name *
            <input
              type="text"
              placeholder="e.g., Website Redesign"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </label>

          <label>
            Client Name
            <input
              type="text"
              placeholder="e.g., Acme Corporation"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            />
          </label>

          <label>
            Project Manager *
            <select
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              required
            >
              <option value="">Select manager</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
            </select>
          </label>

          <label>
            Priority *
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              required
            >
              <option value="">Select priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>

          <label>
            Tags
            <div className="tags-input">
              <input
                type="text"
                placeholder="Add a tag (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <button type="button" onClick={handleAddTag}>
                Add
              </button>
            </div>
            <div className="tag-list">
              {formData.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag} <button onClick={() => handleRemoveTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </label>

          <label>
            Project Description
            <textarea
              placeholder="Describe the project goals, scope, and deliverables..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </label>
        </div>

        <div className="form-right">
          <label>
            Start Date *
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </label>

          <label>
            End Date *
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </label>

          <label>
            Budget
            <input
              type="number"
              placeholder="₹0.00"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </label>

          <label>
            Status
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="New">New</option>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
            </select>
          </label>

          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={() => navigate("/projects")}>
              Cancel
            </button>
            <button type="submit" className="create-btn">
              Create Project
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
