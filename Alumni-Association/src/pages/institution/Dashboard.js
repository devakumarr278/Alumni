import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/institutionDashboard.css';

const InstitutionDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Alumni',
      value: '2,842',
      description: 'Registered alumni members',
      change: '+126',
      changeType: 'up'
    },
    {
      title: 'Events This Year',
      value: '42',
      description: 'Organized events and meetups',
      change: '+18%',
      changeType: 'up'
    },
    {
      title: 'Active Users',
      value: '1,204',
      description: 'Monthly active participants',
      change: '+15%',
      changeType: 'down'
    },
    {
      title: 'Job Placements',
      value: '327',
      description: 'Successful alumni placements',
      change: '+22%',
      changeType: 'up'
    }
  ];

  // Mock pending alumni approvals - in real app, fetch from API
  const pendingApprovals = [
    {
      id: 'pending_alumni_1',
      name: 'John Pending',
      email: 'john.pending@gmail.com',
      graduationYear: 2023,
      department: 'Computer Science',
      rollNumber: 'PEND2023001',
      submittedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'pending_alumni_2',
      name: 'Sarah Waiting',
      email: 'sarah.waiting@gmail.com',
      graduationYear: 2022,
      department: 'Mechanical Engineering',
      rollNumber: 'WAIT2022001',
      submittedAt: '2024-01-14T15:20:00Z'
    },
    {
      id: 'pending_alumni_3',
      name: 'Michael Chen',
      email: 'michael.chen@gmail.com',
      graduationYear: 2024,
      department: 'Electrical Engineering',
      rollNumber: 'CHEN2024001',
      submittedAt: '2024-01-16T09:15:00Z'
    }
  ];

  const quickActions = [
    { title: 'Manage Alumni', icon: 'fa-users', path: '/institution/alumni' },
    { title: 'Create Event', icon: 'fa-calendar-plus', path: '/institution/events' },
    { title: 'View Analytics', icon: 'fa-chart-pie', path: '/institution/analytics' },
    { title: 'Manage Gallery', icon: 'fa-images', path: '/institution/gallery' },
  ];

  const handleApproveAlumni = async (alumniId) => {
    try {
      // In real app, this would call API to approve alumni
      console.log('Approving alumni:', alumniId);
      alert('Alumni approved successfully! They can now login to their account.');
      // Refresh the list or update state
    } catch (error) {
      console.error('Error approving alumni:', error);
      alert('Error approving alumni. Please try again.');
    }
  };

  const handleRejectAlumni = async (alumniId) => {
    try {
      // In real app, this would call API to reject alumni
      console.log('Rejecting alumni:', alumniId);
      alert('Alumni registration rejected.');
      // Refresh the list or update state
    } catch (error) {
      console.error('Error rejecting alumni:', error);
      alert('Error rejecting alumni. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="main-panel">
      <h1>Institution Dashboard</h1>
      <div className="desc">
        Welcome back, {user?.name || 'SKCET Administration'}. Here's what's happening with your alumni network today.
      </div>
      
      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <div className="action-card" key={index}>
            <i className={`fas ${action.icon}`}></i>
            <span>{action.title}</span>
            <button 
              className="action-btn" 
              type="button"
              onClick={() => navigate(action.path)}
            >
              Go to {action.title}
            </button>
          </div>
        ))}
      </div>
      
      {/* Statistics Overview */}
      <div className="stats-overview">
        {stats.map((stat, index) => (
          <div className="stats-card" key={index}>
            <div className="stats-title">{stat.title}</div>
            <div className="stats-value">{stat.value}</div>
            <div className="stats-label">
              {stat.description} 
              <span className={`stats-change ${stat.changeType === 'down' ? 'down' : ''}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pending Alumni Approvals */}
      <div className="approvals-section">
        <h3>Pending Alumni Approvals</h3>
        <ul className="approval-list">
          {pendingApprovals.map((alumni) => (
            <li className="approval-item" key={alumni.id}>
              <div className="approval-info">
                <span className="user-initial">
                  {alumni.name.split(' ').map(n => n[0]).join('')}
                </span>
                <div className="approval-details">
                  <span className="name">{alumni.name}</span>
                  <span className="email">{alumni.email}</span>
                  <span className="approval-meta">
                    Submitted on {formatDate(alumni.submittedAt)}
                  </span>
                </div>
              </div>
              <div className="approval-actions">
                <button 
                  className="approve-btn"
                  onClick={() => handleApproveAlumni(alumni.id)}
                >
                  Approve
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleRejectAlumni(alumni.id)}
                >
                  Reject
                </button>
                <button 
                  className="details-btn"
                  onClick={() => navigate('/institution/alumni')}
                >
                  Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InstitutionDashboard;