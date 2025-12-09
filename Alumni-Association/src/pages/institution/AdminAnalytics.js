import React from 'react';

const AdminAnalytics = () => {
  // Mock data for key metrics
  const metricsData = [
    { title: 'Engagement Rate', value: '72%', change: '+5%' },
    { title: 'Alumni Participation in Events', value: '48%', change: '+3%' },
    { title: 'Mentorship Conversion', value: '35%', change: '+7%' },
    { title: 'Donations This Year', value: '$24,500', change: '+12%' }
  ];

  // Mock data for charts
  const departmentData = [
    { department: 'Computer Science', count: 320 },
    { department: 'Business', count: 210 },
    { department: 'Engineering', count: 180 },
    { department: 'Arts', count: 150 },
    { department: 'Medicine', count: 90 }
  ];

  const monthlyData = [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 150 },
    { month: 'Mar', users: 180 },
    { month: 'Apr', users: 210 },
    { month: 'May', users: 240 },
    { month: 'Jun', users: 280 }
  ];

  const regionData = [
    { region: 'North America', percentage: 45 },
    { region: 'Europe', percentage: 25 },
    { region: 'Asia', percentage: 20 },
    { region: 'Other', percentage: 10 }
  ];

  return (
    <div>
      {/* Time Range Selector and Filters */}
      <div className="card">
        <div className="filter-bar">
          <select className="time-selector">
            <option>Weekly</option>
            <option selected>Monthly</option>
            <option>Yearly</option>
          </select>
          <select className="department-filter">
            <option>All Departments</option>
            <option>Computer Science</option>
            <option>Business</option>
            <option>Engineering</option>
            <option>Arts</option>
            <option>Medicine</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid-4">
        {metricsData.map((metric, index) => (
          <div className="card" key={index}>
            <div className="card-header">
              <h3 className="card-title">{metric.title}</h3>
            </div>
            <div className="card-content">
              <div className="metric-value">{metric.value}</div>
              <div className="metric-change">↑ {metric.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid-2">
        {/* Bar Chart: Alumni by Department */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Alumni by Department</h3>
          </div>
          <div className="card-content">
            <div className="chart-container">
              <div className="bar-chart">
                {departmentData.map((dept, index) => (
                  <div key={index} className="bar-item">
                    <div 
                      className="bar" 
                      style={{ height: `${(dept.count / 320) * 150}px` }}
                    ></div>
                    <div className="bar-label">{dept.department}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Line Chart: Monthly Active Users */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Monthly Active Users</h3>
          </div>
          <div className="card-content">
            <div className="chart-container">
              <div className="line-chart">
                <div className="chart-line"></div>
                <div className="chart-data-points">
                  {monthlyData.map((data, index) => (
                    <div 
                      key={index} 
                      className="data-point" 
                      style={{ height: `${(data.users / 280) * 150}px` }}
                    >
                      <div className="point-label">{data.users}</div>
                    </div>
                  ))}
                </div>
                <div className="chart-x-axis">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="x-label">{data.month}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pie Chart: Alumni by Region */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Alumni by Region</h3>
        </div>
        <div className="card-content">
          <div className="chart-container pie-chart-container">
            <div className="pie-chart">
              {regionData.map((region, index) => (
                <div 
                  key={index} 
                  className="pie-slice"
                  style={{ 
                    clipPath: `path('M 100 100 L 100 0 A 100 100 0 ${index < 2 ? 1 : 0} 1 ${100 + 50 * Math.cos(index * 1.5)} ${100 + 50 * Math.sin(index * 1.5)} Z')`,
                    backgroundColor: `hsl(${index * 90}, 70%, 60%)`
                  }}
                >
                </div>
              ))}
              <div className="pie-center">Regions</div>
            </div>
            <div className="legend">
              {regionData.map((region, index) => (
                <div key={index} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: `hsl(${index * 90}, 70%, 60%)` }}
                  ></div>
                  <div className="legend-label">{region.region}: {region.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .filter-bar {
          display: flex;
          gap: 1rem;
        }
        .time-selector, .department-filter {
          padding: 0.5rem 1rem;
          border-radius: 999px;
          border: 1px solid #d1d5db;
        }
        .metric-value {
          font-size: 1.8rem;
          font-weight: 700;
        }
        .metric-change {
          font-size: 0.9rem;
          color: #10b981;
          font-weight: 500;
        }
        .chart-container {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bar-chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          width: 100%;
          height: 150px;
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          padding: 0 1rem 1rem 1rem;
        }
        .bar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .bar {
          width: 30px;
          background: #2563eb;
          border-radius: 4px 4px 0 0;
        }
        .bar-label {
          font-size: 0.75rem;
          text-align: center;
        }
        .line-chart {
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
          height: 1px;
          background: #e5e7eb;
        }
        .chart-data-points {
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          height: 100%;
          padding: 0 1rem;
        }
        .data-point {
          position: relative;
          width: 10px;
          background: #2563eb;
          border-radius: 50%;
        }
        .point-label {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
        }
        .chart-x-axis {
          display: flex;
          justify-content: space-around;
          padding: 0.5rem 1rem 0 1rem;
        }
        .x-label {
          font-size: 0.75rem;
          text-align: center;
        }
        .pie-chart-container {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .pie-chart {
          position: relative;
          width: 200px;
          height: 200px;
          border-radius: 50%;
        }
        .pie-slice {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .pie-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        .legend {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .legend-color {
          width: 20px;
          height: 20px;
          border-radius: 4px;
        }
        @media (max-width: 768px) {
          .pie-chart-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminAnalytics;