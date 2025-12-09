import React, { useState } from 'react';

const AdminAlumniManagement = () => {
  const [filters, setFilters] = useState({
    department: 'All',
    batch: 'All',
    location: 'All',
    industry: 'All',
    engagement: 'All'
  });

  // Mock data for alumni
  const alumniData = [
    { id: 1, name: 'John Smith', role: 'Software Engineer', company: 'Google', country: 'USA', mentorship: 'Active', lastLogin: '2023-05-15', tags: ['Star mentor', 'Donor'] },
    { id: 2, name: 'Sarah Johnson', role: 'Product Manager', company: 'Microsoft', country: 'Canada', mentorship: 'Inactive', lastLogin: '2023-05-10', tags: ['Donor'] },
    { id: 3, name: 'Michael Chen', role: 'Data Scientist', company: 'Amazon', country: 'UK', mentorship: 'Active', lastLogin: '2023-05-12', tags: ['Star mentor'] },
    { id: 4, name: 'Emma Wilson', role: 'UX Designer', company: 'Apple', country: 'Australia', mentorship: 'Active', lastLogin: '2023-05-14', tags: [] },
    { id: 5, name: 'David Brown', role: 'CTO', company: 'Startup Inc', country: 'Germany', mentorship: 'Inactive', lastLogin: '2023-05-05', tags: ['Star mentor', 'Donor'] }
  ];

  const filterOptions = {
    department: ['All', 'Computer Science', 'Business', 'Engineering', 'Arts', 'Medicine'],
    batch: ['All', '2023', '2022', '2021', '2020', '2019'],
    location: ['All', 'USA', 'Canada', 'UK', 'Australia', 'Germany'],
    industry: ['All', 'Technology', 'Finance', 'Healthcare', 'Education', 'Consulting'],
    engagement: ['All', 'High', 'Medium', 'Low']
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div>
      {/* Smart Directory Filters */}
      <div className="card">
        <div className="filter-bar">
          {Object.entries(filterOptions).map(([filterType, options]) => (
            <select
              key={filterType}
              className="filter-select"
              value={filters[filterType]}
              onChange={(e) => handleFilterChange(filterType, e.target.value)}
            >
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ))}
          <button className="btn btn-primary">Apply Filters</button>
        </div>
      </div>

      {/* Alumni Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Alumni Directory</h3>
          <div className="bulk-actions">
            <button className="btn btn-ghost">Send Email</button>
            <button className="btn btn-ghost">Invite to Event</button>
            <button className="btn btn-ghost">Mark as Spotlight</button>
          </div>
        </div>
        <div className="card-content">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Company</th>
                <th>Country</th>
                <th>Mentorship Status</th>
                <th>Last Login</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {alumniData.map(alumni => (
                <tr key={alumni.id}>
                  <td>{alumni.name}</td>
                  <td>{alumni.role}</td>
                  <td>{alumni.company}</td>
                  <td>{alumni.country}</td>
                  <td>
                    <span className={`chip ${alumni.mentorship === 'Active' ? 'approved' : 'rejected'}`}>
                      {alumni.mentorship}
                    </span>
                  </td>
                  <td>{alumni.lastLogin}</td>
                  <td>
                    {alumni.tags.map((tag, index) => (
                      <span key={index} className="chip approved">{tag}</span>
                    ))}
                  </td>
                  <td>
                    <button className="btn btn-ghost">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .filter-bar {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .filter-select {
          padding: 0.5rem 1rem;
          border-radius: 999px;
          border: 1px solid #d1d5db;
        }
        .bulk-actions {
          display: flex;
          gap: 0.5rem;
        }
        @media (max-width: 768px) {
          .filter-bar {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminAlumniManagement;