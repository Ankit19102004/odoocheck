import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';
import { 
  FiHome, 
  FiFolder, 
  FiFileText, 
  FiSettings, 
  FiDollarSign, 
  FiLogOut, 
  FiUsers, 
  FiBarChart2,
  FiGrid,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiCheck,
  FiX
} from 'react-icons/fi';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Sample notifications - can be replaced with API call later
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'task',
      message: 'New task assigned to you: "Update project documentation"',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'project',
      message: 'Project "Website Redesign" deadline is approaching',
      time: '5 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'system',
      message: 'Your timesheet for this week is pending submission',
      time: '1 day ago',
      read: false,
    },
  ]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };

    if (dropdownOpen || notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, notificationOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getRoleDisplay = () => {
    switch (user?.role) {
      case 'admin':
        return 'Admin';
      case 'project_manager':
        return 'PM';
      case 'team_member':
        return 'TM';
      case 'sales_finance':
        return 'SF';
      default:
        return 'User';
    }
  };

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) {
      return user.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <div className="app-container">
      {/* ====== SIDEBAR ====== */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>OneFlow</h1>
          <p className="sidebar-subtitle">Project Management</p>
        </div>

        <nav>
          <ul className="sidebar-nav">
            <li>
              <Link
                to="/dashboard"
                className={location.pathname === '/dashboard' ? 'active' : ''}
              >
                <FiGrid className="nav-icon" /> Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/projects"
                className={
                  location.pathname.startsWith('/projects') &&
                  !location.pathname.includes('/task-board') &&
                  !location.pathname.includes('/billing') &&
                  !location.pathname.includes('/team') &&
                  !location.pathname.includes('/analytics') &&
                  !location.pathname.includes('/settings')
                    ? 'active'
                    : ''
                }
              >
                <FiFolder className="nav-icon" /> Projects
              </Link>
            </li>

            <li>
              <Link
                to="/task-board"
                className={location.pathname === '/task-board' ? 'active' : ''}
              >
                <FiFileText className="nav-icon" /> Task Board
              </Link>
            </li>

            {(user?.role === 'admin' || user?.role === 'sales_finance' || user?.role === 'project_manager') && (
              <li>
                <Link
                  to="/billing"
                  className={location.pathname === '/billing' ? 'active' : ''}
                >
                  <FiDollarSign className="nav-icon" /> Billing
                </Link>
              </li>
            )}

            {(user?.role === 'admin' || user?.role === 'project_manager') && (
              <li>
                <Link
                  to="/team"
                  className={location.pathname === '/team' ? 'active' : ''}
                >
                  <FiUsers className="nav-icon" /> Team
                </Link>
              </li>
            )}

            {(user?.role === 'admin' || user?.role === 'project_manager') && (
              <li>
                <Link
                  to="/analytics"
                  className={location.pathname === '/analytics' ? 'active' : ''}
                >
                  <FiBarChart2 className="nav-icon" /> Analytics
                </Link>
              </li>
            )}

            <li>
              <Link
                to="/settings"
                className={location.pathname === '/settings' ? 'active' : ''}
              >
                <FiSettings className="nav-icon" /> Settings
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Profile at Bottom */}
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {getInitials()}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{getUserDisplayName()}</div>
            <div className="sidebar-user-role">{getRoleDisplay()}</div>
          </div>
          <button 
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <FiLogOut className="sidebar-logout-icon" />
          </button>
        </div>
      </aside>

      {/* ====== MAIN AREA ====== */}
      <div className="main-content">
        {/* Top Navigation Bar */}
        <header className="topbar">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects, tasks, or team members..."
              className="search-input"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && globalSearch.trim()) {
                  navigate(`/projects?search=${encodeURIComponent(globalSearch.trim())}`);
                  setGlobalSearch('');
                }
              }}
            />
          </div>

          <div className="topbar-right">
            <div 
              className="notification-container" 
              ref={notificationRef}
            >
              <button 
                className="notification-btn"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <FiBell className="notification-icon" />
                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>

              {notificationOpen && (
                <div className="notification-dropdown">
                  <div className="notification-dropdown-header">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        className="mark-all-read-btn"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="notification-dropdown-content">
                    {notifications.length === 0 ? (
                      <div className="notification-empty">
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${!notification.read ? 'unread' : ''}`}
                        >
                          <div className="notification-content">
                            <p className="notification-message">{notification.message}</p>
                            <span className="notification-time">{notification.time}</span>
                          </div>
                          <div className="notification-actions">
                            {!notification.read && (
                              <button
                                className="notification-action-btn"
                                onClick={() => markAsRead(notification.id)}
                                title="Mark as read"
                              >
                                <FiCheck />
                              </button>
                            )}
                            <button
                              className="notification-action-btn delete-btn"
                              onClick={() => deleteNotification(notification.id)}
                              title="Delete"
                            >
                              <FiX />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div 
              className="user-profile-dropdown-container" 
              ref={dropdownRef}
            >
              <button 
                className="user-profile-dropdown"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-profile-avatar">
                  {getInitials()}
                </div>
                <div className="user-profile-info">
                  <div className="user-profile-name">{getUserDisplayName()}</div>
                  <div className="user-profile-role">{getRoleDisplay()}</div>
                </div>
                <FiChevronDown className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-menu-header">
                    <div className="dropdown-menu-user-info">
                      <div className="dropdown-menu-name">{getUserDisplayName()}</div>
                      <div className="dropdown-menu-email">{user?.email}</div>
                    </div>
                  </div>
                  <div className="dropdown-menu-divider"></div>
                  <Link 
                    to="/settings" 
                    className="dropdown-menu-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiSettings className="dropdown-menu-icon" />
                    <span>Settings</span>
                  </Link>
                  <button 
                    className="dropdown-menu-item logout-item"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="dropdown-menu-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="content-wrapper">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default Layout;
