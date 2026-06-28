import React, { useState, useEffect, useCallback } from 'react';
import { Users, Folder, DollarSign, Calendar, RefreshCw, Plus, ArrowRight } from 'lucide-react';
import { employeeAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import Spinner from '../components/Spinner';

const Dashboard = ({ setActiveTab, triggerNotification }) => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departmentsCount: 0,
    averageSalary: 0,
    newEmployeesThisMonth: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    
    try {
      const response = await employeeAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      triggerNotification('Failed to load dashboard metrics. Check server connection.', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [triggerNotification]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return <Spinner message="Loading dashboard statistics..." />;
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Dashboard</h1>
          <p>Welcome back! Here is a summary of TechNova's workspace analytics.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => fetchStats(true)}
            className="btn btn-outline"
            disabled={isRefreshing}
            title="Refresh statistics"
          >
            <RefreshCw size={16} className={isRefreshing ? 'spinner' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Manage Employees</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-grid">
        {/* Total Employees */}
        <div className="stat-card">
          <div className="stat-card-icon">
            <Users size={24} />
          </div>
          <div className="stat-card-info">
            <div className="stat-card-value">{stats.totalEmployees}</div>
            <div className="stat-card-label">Total Employees</div>
          </div>
        </div>

        {/* Departments */}
        <div className="stat-card">
          <div className="stat-card-icon">
            <Folder size={24} />
          </div>
          <div className="stat-card-info">
            <div className="stat-card-value">{stats.departmentsCount}</div>
            <div className="stat-card-label">Departments</div>
          </div>
        </div>

        {/* Average Salary */}
        <div className="stat-card">
          <div className="stat-card-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-card-info">
            <div className="stat-card-value">{formatCurrency(stats.averageSalary)}</div>
            <div className="stat-card-label">Average Salary</div>
          </div>
        </div>

        {/* New Hires */}
        <div className="stat-card accent">
          <div className="stat-card-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-card-info">
            <div className="stat-card-value">{stats.newEmployeesThisMonth}</div>
            <div className="stat-card-label">New Hires (This Month)</div>
          </div>
        </div>
      </div>

      {/* Additional Dashboard Sections */}
      <div className="dashboard-details">
        {/* Workspace Summary */}
        <div className="content-card">
          <h3 className="content-card-title">Company Overview</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>
            TechNova Solutions has grown its operations into <strong>{stats.departmentsCount} departments</strong>, employing a diverse talent pool of <strong>{stats.totalEmployees} professionals</strong>. The aggregate annual salary average is currently <strong>{formatCurrency(stats.averageSalary)}</strong>.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <div style={{ flex: '1', minWidth: '180px', padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--background-color)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>HR Action Ratio</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>100% Active</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>All employee data audited.</div>
            </div>
            <div style={{ flex: '1', minWidth: '180px', padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--background-color)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Hiring Speed</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-color)' }}>+{stats.newEmployeesThisMonth} Hires</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Added in this billing cycle.</div>
            </div>
          </div>
        </div>

        {/* Quick Help Card */}
        <div className="content-card">
          <h3 className="content-card-title">Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveTab('employees')}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'space-between', padding: '0.75rem 1rem' }}
            >
              <span>View Employee Directory</span>
              <ArrowRight size={16} />
            </button>
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255, 127, 80, 0.08)', border: '1px solid rgba(255, 127, 80, 0.15)', color: 'var(--text-primary)', fontSize: '0.8rem' }}>
              <strong>System Notice:</strong> Please ensure all new staff records have valid phone numbers and join dates for salary audits.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
