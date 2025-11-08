import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight, FiShield, FiFolder, FiUsers, FiDollarSign } from 'react-icons/fi';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    {
      role: 'admin',
      email: 'admin@oneflow.com',
      password: 'password123',
      title: 'Admin',
      description: 'Full system access',
      icon: <FiShield />,
    },
    {
      role: 'project_manager',
      email: 'manager@oneflow.com',
      password: 'password123',
      title: 'Project Manager',
      description: 'Manage projects & tasks',
      icon: <FiFolder />,
    },
    {
      role: 'team_member',
      email: 'alice@oneflow.com',
      password: 'password123',
      title: 'Team Member',
      description: 'Update tasks & log hours',
      icon: <FiUsers />,
    },
    {
      role: 'sales_finance',
      email: 'carol@oneflow.com',
      password: 'password123',
      title: 'Sales/Finance',
      description: 'Manage billing & expenses',
      icon: <FiDollarSign />,
    },
  ];

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      await login(demoEmail, demoPassword);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error' || !err.response) {
        setError('Network error: Cannot connect to server. Please make sure the backend is running on http://localhost:3001');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please check your credentials.');
      } else {
        const errorMessage = err.response?.data?.error 
          || err.response?.data?.message 
          || err.message 
          || 'Login failed. Please check your credentials.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error' || !err.response) {
        setError('Network error: Cannot connect to server. Please make sure the backend is running on http://localhost:3001');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        const errorMessage = err.response?.data?.error 
          || err.response?.data?.message 
          || err.message 
          || 'Login failed. Please check your credentials.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* LEFT PANEL - Features */}
      <div className="auth-left">
        <div>
          <h1 className="brand-title">OneFlow</h1>
          <p className="brand-subtitle">Project Management & Billing Platform</p>
          
          <div className="feature-list">
            <div className="feature-item">
              <div className="icon">📋</div>
              <div>
                <h4>Plan & Execute</h4>
                <p>Manage projects from start to finish.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="icon">👥</div>
              <div>
                <h4>Collaborate</h4>
                <p>Work together with your team seamlessly.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="icon">💰</div>
              <div>
                <h4>Bill & Track</h4>
                <p>Complete billing and financial tracking.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="auth-right">
        <div className="auth-card new-style">
          <h2>Sign In</h2>
          <p className="card-subtitle">Enter your credentials to access your workspace</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : (
                <>
                  Sign In <FiArrowRight style={{ marginLeft: '0.5rem' }} />
                </>
              )}
            </button>
          </form>

          <p className="divider-text">Or try a demo account</p>

          <div className="demo-accounts-grid">
            {demoAccounts.map((account) => (
              <div
                key={account.role}
                className="demo-account-card"
                onClick={() => handleDemoLogin(account.email, account.password)}
              >
                <div className="demo-account-icon">{account.icon}</div>
                <div className="demo-account-info">
                  <div className="demo-account-title">{account.title}</div>
                  <div className="demo-account-description">{account.description}</div>
                </div>
              </div>
            ))}
          </div>

          <p className="auth-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
