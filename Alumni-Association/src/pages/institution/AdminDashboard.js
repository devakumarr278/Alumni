import React from 'react';

const AdminDashboard = () => {
  // Mock data for KPI cards
  const kpiData = [
    { title: 'Total Alumni', value: '1,248', change: '+12%' },
    { title: 'Pending Verifications', value: '24', change: '-3%' },
    { title: 'Active Mentors', value: '86', change: '+5%' },
    { title: 'Upcoming Events', value: '7', change: '+2%' }
  ];

  // Mock data for verification queue
  const verificationQueue = [
    { name: 'John Smith', dept: 'Computer Science', year: '2020', score: '85%' },
    { name: 'Sarah Johnson', dept: 'Business', year: '2019', score: '92%' },
    { name: 'Michael Chen', dept: 'Engineering', year: '2021', score: '78%' },
    { name: 'Emma Wilson', dept: 'Arts', year: '2018', score: '88%' },
    { name: 'David Brown', dept: 'Medicine', year: '2022', score: '95%' }
  ];

  // Mock data for today's actions
  const todaysActions = [
    { action: 'New mentorship request', details: 'From Alex Turner', time: '10:30 AM' },
    { action: 'Event needs approval', details: 'Tech Conference 2024', time: '9:15 AM' },
    { action: 'Notification to send', details: 'Alumni meet-up reminder', time: 'Yesterday' },
    { action: 'New registration', details: 'Jennifer Lee', time: '8:45 AM' }
  ];

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid-4">
        {kpiData.map((kpi, index) => (
          <div className="card" key={index}>
            <div className="card-header">
              <h3 className="card-title">{kpi.title}</h3>
            </div>
            <div className="card-content">
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-change">{kpi.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity & Insights */}
      <div className="grid-2">
        {/* Verification Queue */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Verification Queue (Top 5)</h3>
            <button className="btn btn-ghost">View All</button>
          </div>
          <div className="card-content">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Dept</th>
                  <th>Grad Year</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {verificationQueue.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.dept}</td>
                    <td>{item.year}</td>
                    <td>{item.score}</td>
                    <td>
                      <button className="btn btn-primary">Approve</button>
                      <button className="btn btn-ghost">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Today's Actions</h3>
          </div>
          <div className="card-content">
            <ul className="actions-list">
              {todaysActions.map((action, index) => (
                <li key={index} className="action-item">
                  <div className="action-content">
                    <div className="action-title">{action.action}</div>
                    <div className="action-details">{action.details}</div>
                  </div>
                  <div className="action-time">{action.time}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .kpi-value {
          font-size: 1.8rem;
          font-weight: 700;
        }
        .kpi-change {
          font-size: 0.9rem;
          color: #10b981;
          font-weight: 500;
        }
        .actions-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .action-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .action-item:last-child {
          border-bottom: none;
        }
        .action-content {
          display: flex;
          flex-direction: column;
        }
        .action-title {
          font-weight: 500;
        }
        .action-details {
          font-size: 0.85rem;
          color: #6b7280;
        }
        .action-time {
          font-size: 0.85rem;
          color: #6b7280;
          align-self: center;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;