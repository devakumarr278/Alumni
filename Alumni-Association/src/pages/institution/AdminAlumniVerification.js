import React, { useState } from 'react';

const AdminAlumniVerification = () => {
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Mock data for alumni verification
  const alumniData = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      department: 'Computer Science',
      graduationYear: '2020',
      college: 'Institute of Technology',
      company: 'Tata Consultancy Services',
      registrationNumber: 'CS20IT045',
      location: 'Bengaluru, India',
      status: 'Pending'
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      department: 'Business Administration',
      graduationYear: '2019',
      college: 'Business School',
      company: 'Deloitte',
      registrationNumber: 'BA19BS012',
      location: 'Mumbai, India',
      status: 'Pending'
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Chen',
      department: 'Mechanical Engineering',
      graduationYear: '2021',
      college: 'Engineering College',
      company: 'Siemens',
      registrationNumber: 'ME21EC078',
      location: 'Pune, India',
      status: 'Pending'
    },
    {
      id: 4,
      firstName: 'Emma',
      lastName: 'Wilson',
      department: 'Fine Arts',
      graduationYear: '2018',
      college: 'College of Arts',
      company: 'Freelance Designer',
      registrationNumber: 'FA18CA034',
      location: 'Chennai, India',
      status: 'Pending'
    }
  ];

  const openDetails = (alumni) => {
    console.log('Opening details for:', alumni);
    setSelectedAlumni(alumni);
    setIsPanelOpen(true);
  };

  const closeDetails = () => {
    console.log('Closing details panel');
    setIsPanelOpen(false);
    setSelectedAlumni(null);
  };

  const handleApprove = (alumniId) => {
    // In a real app, this would make an API call
    console.log(`Approved alumni with ID: ${alumniId}`);
    closeDetails();
  };

  const handleReject = (alumniId) => {
    // In a real app, this would make an API call
    console.log(`Rejected alumni with ID: ${alumniId}`);
    closeDetails();
  };

  return (
    <div className="verification-layout">
      {/* Alumni Cards */}
      <div className="alumni-grid">
        {alumniData.map((alumni) => (
          <div 
            className="alumni-card" 
            key={alumni.id}
            onClick={() => openDetails(alumni)}
          >
            <div className="avatar">
              {alumni.firstName.charAt(0)}{alumni.lastName.charAt(0)}
            </div>
            <div className="alumni-info">
              <h3>{alumni.firstName} {alumni.lastName}</h3>
              <p>{alumni.department} • {alumni.graduationYear}</p>
              <span className="status pending">Pending Approval</span>
            </div>
            <div className="actions">
              <button 
                className="approve"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(alumni.id);
                }}
              >
                Approve
              </button>
              <button 
                className="reject"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(alumni.id);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Panel */}
      {isPanelOpen && selectedAlumni && (
        <div className={`details-panel ${isPanelOpen ? 'active' : ''}`} id="detailsPanel">
          <div className="panel-header">
            <h2>Alumni Details</h2>
            <span className="close" onClick={closeDetails}>×</span>
          </div>

          <div className="detail-row">
            <label>Name</label>
            <span>{selectedAlumni.firstName} {selectedAlumni.lastName}</span>
          </div>
          <div className="detail-row">
            <label>College</label>
            <span>{selectedAlumni.college}</span>
          </div>
          <div className="detail-row">
            <label>Department</label>
            <span>{selectedAlumni.department}</span>
          </div>
          <div className="detail-row">
            <label>Passed Out</label>
            <span>{selectedAlumni.graduationYear}</span>
          </div>
          <div className="detail-row">
            <label>Company</label>
            <span>{selectedAlumni.company}</span>
          </div>
          <div className="detail-row">
            <label>Registration No</label>
            <span>{selectedAlumni.registrationNumber}</span>
          </div>
          <div className="detail-row">
            <label>Location</label>
            <span>{selectedAlumni.location}</span>
          </div>

          <div className="panel-actions">
            <button 
              className="approve full"
              onClick={() => handleApprove(selectedAlumni.id)}
            >
              Approve Alumni
            </button>
            <button 
              className="reject outline"
              onClick={() => handleReject(selectedAlumni.id)}
            >
              Reject
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .verification-layout {
          position: relative;
        }
        
        .details-panel {
          background: #ffffff;
          border-radius: 1rem;
          padding: 1.2rem;
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
          transform: translateX(100%);
          transition: transform 0.25s ease;
          position: fixed;
          right: 0;
          top: 70px;
          bottom: 0;
          width: 350px;
          overflow-y: auto;
          z-index: 1000;
          border-left: 1px solid #e5e7eb;
        }

        .details-panel.active {
          transform: translateX(0);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .panel-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }

        .close {
          font-size: 1.4rem;
          cursor: pointer;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.6rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-row label {
          color: #6b7280;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .detail-row span {
          font-weight: 600;
          text-align: right;
        }

        .panel-actions {
          margin-top: 1.5rem;
          display: flex;
          gap: 0.6rem;
        }

        .panel-actions .approve.full {
          flex: 1;
          padding: 0.6rem;
        }

        .panel-actions .reject.outline {
          background: transparent;
          border: 1px solid #b91c1c;
          color: #b91c1c;
        }

        @media (max-width: 960px) {
          .details-panel {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
          }
          
          .details-panel.active {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminAlumniVerification;