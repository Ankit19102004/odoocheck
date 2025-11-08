import React from "react";
import { useAuth } from "../context/AuthContext";
import { FiShield, FiBriefcase, FiUsers, FiDollarSign, FiCheck, FiX } from "react-icons/fi";
import "./Settings.css";

const Settings: React.FC = () => {
  const { user } = useAuth();

  const roles = [
    {
      name: "Admin",
      icon: <FiShield />,
      iconColor: "#1e40af",
      bgColor: "#dbeafe",
      permissions: [
        { text: "Full system access", allowed: true },
        { text: "User management", allowed: true },
        { text: "Create/edit/delete projects", allowed: true },
        { text: "Manage tasks", allowed: true },
        { text: "Billing & finances", allowed: true },
        { text: "Analytics & reports", allowed: true },
        { text: "System settings", allowed: true },
      ],
    },
    {
      name: "Project Manager",
      icon: <FiBriefcase />,
      iconColor: "#0369a1",
      bgColor: "#e0f2fe",
      permissions: [
        { text: "Create/edit projects", allowed: true },
        { text: "Assign team members", allowed: true },
        { text: "Create/manage tasks", allowed: true },
        { text: "Approve expenses", allowed: true },
        { text: "Trigger invoices", allowed: true },
        { text: "View analytics", allowed: true },
        { text: "User management", allowed: false },
      ],
    },
    {
      name: "Sales/Finance",
      icon: <FiDollarSign />,
      iconColor: "#166534",
      bgColor: "#dcfce7",
      permissions: [
        { text: "Create/manage sales orders", allowed: true },
        { text: "Create/manage purchase orders", allowed: true },
        { text: "Create/manage invoices", allowed: true },
        { text: "Manage vendor bills", allowed: true },
        { text: "Manage expenses", allowed: true },
        { text: "View projects", allowed: true },
        { text: "Create/edit projects", allowed: false },
      ],
    },
    {
      name: "Team Member",
      icon: <FiUsers />,
      iconColor: "#0369a1",
      bgColor: "#e0f2fe",
      permissions: [
        { text: "View assigned tasks", allowed: true },
        { text: "Update task status", allowed: true },
        { text: "Log hours", allowed: true },
        { text: "Submit expenses", allowed: true },
        { text: "View projects", allowed: true },
        { text: "Create/edit projects", allowed: false },
        { text: "Manage billing", allowed: false },
      ],
    },
  ];

  const isUserRole = (roleName: string) => {
    const roleMap: { [key: string]: string } = {
      "Admin": "admin",
      "Project Manager": "project_manager",
      "Sales/Finance": "sales_finance",
      "Team Member": "team_member",
    };
    return roleMap[roleName] === user?.role;
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Configure your workspace and view role permissions.</p>
      </div>

      <div className="section-header">
        <h2>Role Permissions Overview</h2>
        <p>Understanding what each role can do in OneFlow</p>
      </div>

      <div className="roles-grid">
        {roles.map((role) => (
          <div
            key={role.name}
            className={`role-card ${isUserRole(role.name) ? "active-role" : ""}`}
          >
            <div className="role-header">
              <div className="role-icon" style={{ backgroundColor: role.bgColor, color: role.iconColor }}>
                {role.icon}
              </div>
              <h3>{role.name}</h3>
              {isUserRole(role.name) && (
                <span className="role-badge">Your Role</span>
              )}
            </div>

            <ul className="permissions-list">
              {role.permissions.map((perm, index) => (
                <li key={index} className={perm.allowed ? "allowed" : "denied"}>
                  {perm.allowed ? (
                    <FiCheck className="permission-icon" />
                  ) : (
                    <FiX className="permission-icon" />
                  )}
                  <span>{perm.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
