import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

type UserRole = 'admin' | 'project_manager' | 'team_member' | 'sales_finance';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'team_member' as UserRole,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.error 
        || err.response?.data?.message 
        || err.message 
        || 'Registration failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions: { value: UserRole; label: string; description: string }[] = [
    {
      value: 'team_member',
      label: 'Team Member',
      description: 'View projects, update tasks, log time',
    },
    {
      value: 'project_manager',
      label: 'Project Manager',
      description: 'Manage projects and tasks, assign team members',
    },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card enhanced">
        {/* Left Violet Panel */}
        <div className="auth-side-panel">
          <div className="auth-panel-content">
            <h1>Welcome Back!</h1>
            <p>
              Enter your personal details and start managing your projects seamlessly.
            </p>
            <Link to="/login" className="outline-btn">
              SIGN IN
            </Link>
          </div>
        </div>

        {/* Right White Form Panel */}
        <div className="auth-form-panel">
          <h2>Create Account</h2>
          <div className="social-login">
            <button className="social-btn google">G+</button>
            <button className="social-btn facebook">f</button>
            <button className="social-btn github">🐙</button>
            <button className="social-btn linkedin">in</button>
          </div>
          <span className="divider-text">or use your email for registration</span>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                required
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={6}
            />

            {/* Role Selection */}
            <div className="role-selection">
              <p className="role-label">Join as:</p>
              <div className="role-options">
                {roleOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`role-option ${
                      formData.role === option.value ? 'selected' : ''
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, role: option.value })
                    }
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as UserRole,
                        })
                      }
                      required
                    />
                    <div className="role-info">
                      <span className="role-name">{option.label}</span>
                      <span className="role-description">
                        {option.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing up...' : 'SIGN UP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
