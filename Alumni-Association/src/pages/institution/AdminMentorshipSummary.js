import React from 'react';

const AdminMentorshipSummary = () => {
  // Mock data for KPI cards
  const kpiData = [
    { title: 'Active Mentors', value: '86', change: '+5%' },
    { title: 'Ongoing Mentorships', value: '142', change: '+12%' },
    { title: 'Sessions This Month', value: '256', change: '+8%' },
    { title: 'Avg Rating', value: '4.7', change: '+0.2' }
  ];

  // Mock data for recent mentorship requests
  const recentRequests = [
    { student: 'Alex Turner', alumni: 'John Smith', dept: 'Computer Science', status: 'Pending', requested: '2023-05-15' },
    { student: 'Jennifer Lee', alumni: 'Sarah Johnson', dept: 'Business', status: 'Approved', requested: '2023-05-14' },
    { student: 'Mike Wilson', alumni: 'Michael Chen', dept: 'Engineering', status: 'Pending', requested: '2023-05-13' },
    { student: 'Emma Davis', alumni: 'Emma Wilson', dept: 'Arts', status: 'Approved', requested: '2023-05-12' }
  ];

  // Mock data for top mentors
  const topMentors = [
    { name: 'John Smith', dept: 'Computer Science', sessions: 24, rating: '4.9', badge: 'Top Mentor' },
    { name: 'Sarah Johnson', dept: 'Business', sessions: 18, rating: '4.8', badge: 'Star Mentor' },
    { name: 'Michael Chen', dept: 'Engineering', sessions: 15, rating: '4.7', badge: 'Top Mentor' },
    { name: 'Emma Wilson', dept: 'Arts', sessions: 12, rating: '4.6', badge: 'Star Mentor' }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'chip pending';
      case 'Approved': return 'chip approved';
      default: return 'chip';
    }
  };

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

      {/* Two Panels */}
      <div className="grid-2">
        {/* Recent Mentorship Requests */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Mentorship Requests</h3>
            <button className="btn btn-ghost">View All</button>
          </div>
          <div className="card-content">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Alumni</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Requested On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request, index) => (
                  <tr key={index}>
                    <td>{request.student}</td>
                    <td>{request.alumni}</td>
                    <td>{request.dept}</td>
                    <td>
                      <span className={getStatusClass(request.status)}>
                        {request.status}
                      </span>
                    </td>
                    <td>{request.requested}</td>
                    <td>
                      <button className="btn btn-primary">Approve</button>
                      <button className="btn btn-ghost">Reassign</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Mentors */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Mentors</h3>
          </div>
          <div className="card-content">
            <table className="table">
              <thead>
                <tr>
                  <th>Alumni Name</th>
                  <th>Department</th>
                  <th>Sessions</th>
                  <th>Avg Rating</th>
                  <th>Badge</th>
                </tr>
              </thead>
              <tbody>
                {topMentors.map((mentor, index) => (
                  <tr key={index}>
                    <td>{mentor.name}</td>
                    <td>{mentor.dept}</td>
                    <td>{mentor.sessions}</td>
                    <td>{mentor.rating}</td>
                    <td>
                      <span className="chip approved">{mentor.badge}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Optional Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Sessions per Month</h3>
        </div>
        <div className="card-content">
          <div className="chart-placeholder">
            {/* In a real implementation, this would be a line chart */}
            <div className="chart-container">
              <div className="chart-line"></div>
              <div className="chart-data-points">
                {[10, 25, 15, 30, 20, 40, 35].map((value, index) => (
                  <div 
                    key={index} 
                    className="data-point" 
                    style={{ height: `${value * 2}px` }}
                  ></div>
                ))}
              </div>
            </div>
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
        .chart-placeholder {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          border-radius: 0.5rem;
        }
        .chart-container {
          width: 100%;
          height: 150px;
          position: relative;
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
        }
        .chart-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #2563eb;
          transform: translateY(-50px);
        }
        .chart-data-points {
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          height: 100%;
          padding: 0 1rem;
        }
        .data-point {
          width: 20px;
          background: #2563eb;
          border-radius: 4px 4px 0 0;
        }
      `}</style>
    </div>
  );
};

export default AdminMentorshipSummary;