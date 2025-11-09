import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { FiBarChart2, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Analytics.css';

const Analytics: React.FC = () => {
  const [previousCompletionRate, setPreviousCompletionRate] = useState<number | null>(null);

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

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/invoices');
        return response.data.data || [];
      } catch (error) {
        console.error('Failed to load invoices:', error);
        return [];
      }
    },
    retry: 1,
  });

  const { data: vendorBills, isLoading: vendorBillsLoading } = useQuery({
    queryKey: ['vendor-bills'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/vendor-bills');
        return response.data.data || [];
      } catch (error) {
        console.error('Failed to load vendor bills:', error);
        return [];
      }
    },
    retry: 1,
    enabled: true, // Will fail gracefully if user doesn't have permission
  });

  // Calculate analytics
  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter((p: any) => p.status === 'active').length || 0;
  const completedProjects = projects?.filter((p: any) => p.status === 'completed').length || 0;
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t: any) => t.status === 'done').length || 0;
  
  // Calculate completion rate: consider both task completion and project completion
  let completionRate = 0;
  if (totalTasks > 0) {
    // Base completion on tasks
    const taskCompletionRate = (completedTasks / totalTasks) * 100;
    // Boost completion rate if projects are completed
    const projectCompletionBoost = completedProjects > 0 ? (completedProjects / totalProjects) * 20 : 0;
    completionRate = Math.min(100, Math.round(taskCompletionRate + projectCompletionBoost));
  } else if (completedProjects > 0 && totalProjects > 0) {
    // If no tasks but projects are completed, show project completion rate
    completionRate = Math.round((completedProjects / totalProjects) * 100);
  }

  // Track completion rate changes
  useEffect(() => {
    const storedRate = localStorage.getItem('previousCompletionRate');
    if (storedRate) {
      setPreviousCompletionRate(parseFloat(storedRate));
    }
    
    // Store current rate for next time
    if (completionRate > 0) {
      localStorage.setItem('previousCompletionRate', completionRate.toString());
    }
  }, [completionRate]);

  // Calculate trend
  const completionRateChange = previousCompletionRate !== null 
    ? completionRate - previousCompletionRate 
    : 0;
  const isIncreasing = completionRateChange > 0;
  const isDecreasing = completionRateChange < 0;
  const trendText = isIncreasing 
    ? `+${completionRateChange.toFixed(1)}% from last view` 
    : isDecreasing 
    ? `${completionRateChange.toFixed(1)}% from last view`
    : 'No change';

  // Prepare chart data
  const projectStatusData = useMemo(() => {
    if (!projects) return [];
    const statusCounts: Record<string, number> = {};
    projects.forEach((p: any) => {
      const status = p.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
      value,
    }));
  }, [projects]);

  const taskStatusData = useMemo(() => {
    if (!tasks) return [];
    const statusCounts: Record<string, number> = {};
    tasks.forEach((t: any) => {
      const status = t.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
      value,
    }));
  }, [tasks]);

  const billsData = useMemo(() => {
    const invoicesList = invoices || [];
    const billsList = vendorBills || [];
    
    const totalRevenue = invoicesList.reduce((sum: number, inv: any) => {
      return sum + (parseFloat(inv.amount?.toString() || '0'));
    }, 0);

    const totalExpenses = billsList.reduce((sum: number, bill: any) => {
      return sum + (parseFloat(bill.amount?.toString() || '0'));
    }, 0);

    const paidRevenue = invoicesList
      .filter((inv: any) => inv.state === 'paid')
      .reduce((sum: number, inv: any) => {
        return sum + (parseFloat(inv.amount?.toString() || '0'));
      }, 0);

    const paidExpenses = billsList
      .filter((bill: any) => bill.state === 'paid')
      .reduce((sum: number, bill: any) => {
        return sum + (parseFloat(bill.amount?.toString() || '0'));
      }, 0);

    return [
      { name: 'Revenue', total: totalRevenue, paid: paidRevenue },
      { name: 'Expenses', total: totalExpenses, paid: paidExpenses },
    ];
  }, [invoices, vendorBills]);

  const COLORS = ['#4a7cff', '#9B8FA8', '#F5C2A0', '#16a34a', '#ef4444', '#f59e0b'];

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>View insights and performance metrics</p>
        </div>
      </div>

      {projectsLoading || tasksLoading || invoicesLoading || vendorBillsLoading ? (
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
              <div className={`analytics-change ${isIncreasing ? 'positive' : isDecreasing ? 'negative' : 'neutral'}`}>
                {isIncreasing ? <FiTrendingUp /> : isDecreasing ? <FiTrendingDown /> : <FiBarChart2 />}
                <span>{trendText}</span>
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
            {/* Projects Status Chart */}
            <div className="chart-card">
              <h3>Project Status Distribution</h3>
              {projectStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-empty">No project data available</div>
              )}
            </div>

            {/* Tasks Status Chart */}
            <div className="chart-card">
              <h3>Task Status Distribution</h3>
              {taskStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-empty">No task data available</div>
              )}
            </div>

            {/* Bills Revenue vs Expenses Chart */}
            <div className="chart-card chart-card-full">
              <h3>Revenue vs Expenses</h3>
              {billsData.length > 0 && (billsData[0].total > 0 || billsData[1].total > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={billsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                    <Legend />
                    <Bar dataKey="total" fill="#4a7cff" name="Total" />
                    <Bar dataKey="paid" fill="#16a34a" name="Paid" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-empty">No billing data available</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;

