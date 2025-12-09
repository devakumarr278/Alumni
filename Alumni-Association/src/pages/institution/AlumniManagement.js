import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AlumniManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('pending');
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);

  // Fetch alumni data on component mount
  useEffect(() => {
    fetchAlumniData();
  }, [filter]);

  const fetchAlumniData = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from the actual API
      // For now, using mock data
      const mockData = [
        { 
          _id: 1, 
          firstName: 'Fareed', 
          lastName: 'M', 
          email: 'eeexam2025@gmail.com', 
          graduationYear: 2023, 
          department: 'Information Technology', 
          status: 'pending',
          company: 'Infosys',
          location: 'Chennai, India',
          collegeName: 'Your College Name',
          rollNumber: 'IT2023XXX',
          isVerified: false,
          idProof: 'https://example.com/id-proof-1.jpg',
          degreeCert: 'https://example.com/degree-cert-1.pdf'
        },
        { 
          _id: 2, 
          firstName: 'Sarah', 
          lastName: 'Johnson', 
          email: 'sarah.johnson@example.com', 
          graduationYear: 2022, 
          department: 'Computer Science', 
          status: 'pending',
          company: 'TCS',
          location: 'Bangalore, India',
          collegeName: 'Your College Name',
          rollNumber: 'CS2022XXX',
          isVerified: false,
          idProof: 'https://example.com/id-proof-2.jpg',
          degreeCert: 'https://example.com/degree-cert-2.pdf'
        },
        { 
          _id: 3, 
          firstName: 'Michael', 
          lastName: 'Brown', 
          email: 'michael.brown@example.com', 
          graduationYear: 2021, 
          department: 'Electronics', 
          status: 'approved',
          company: 'Wipro',
          location: 'Hyderabad, India',
          collegeName: 'Your College Name',
          rollNumber: 'EC2021XXX',
          isVerified: true,
          idProof: 'https://example.com/id-proof-3.jpg',
          degreeCert: 'https://example.com/degree-cert-3.pdf'
        },
        { 
          _id: 4, 
          firstName: 'Emma', 
          lastName: 'Wilson', 
          email: 'emma.wilson@example.com', 
          graduationYear: 2023, 
          department: 'Mechanical', 
          status: 'pending',
          company: 'L&T',
          location: 'Pune, India',
          collegeName: 'Your College Name',
          rollNumber: 'ME2023XXX',
          isVerified: false,
          idProof: 'https://example.com/id-proof-4.jpg',
          degreeCert: 'https://example.com/degree-cert-4.pdf'
        }
      ];
      setAlumniData(mockData);
    } catch (error) {
      console.error('Error fetching alumni data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (filterValue) => {
    setFilter(filterValue);
  };

  const handleVerifyAlumni = async (alumniId, decision, reason = null) => {
    try {
      // In a real app, this would call the API to verify the alumni
      // For now, just update the local state
      setAlumniData(prevData => 
        prevData.map(alumni => 
          alumni._id === alumniId 
            ? { 
                ...alumni, 
                status: decision === 'approve' ? 'approved' : 'rejected',
                isVerified: decision === 'approve' ? true : alumni.isVerified,
                rejectionReason: reason || null
              } 
            : alumni
        )
      );
      
      // Close modals
      if (selectedAlumni && selectedAlumni._id === alumniId) {
        setIsPanelOpen(false);
        setSelectedAlumni(null);
      }
      
      // Show success message
      if (decision === 'approve') {
        setToastMessage('✅ Alumni Approved Successfully');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setShowRejectModal(false);
        setRejectReason('');
        setToastMessage(' Alumni Rejected');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error('Error verifying alumni:', error);
      setToastMessage('Error verifying alumni. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleAlumniClick = (alumni) => {
    setSelectedAlumni(alumni);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedAlumni(null);
  };

  const openRejectModal = () => {
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason('');
  };

  const submitRejection = () => {
    if (rejectReason && selectedAlumni) {
      handleVerifyAlumni(selectedAlumni._id, 'reject', rejectReason);
    }
  };

  const openDoc = (docUrl) => {
    setCurrentDoc(docUrl);
    setShowDocViewer(true);
  };

  const closeDocViewer = () => {
    setShowDocViewer(false);
    setCurrentDoc(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-badge approved';
      case 'rejected':
        return 'status-badge rejected';
      default:
        return 'status-badge pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  // Count alumni by status
  const pendingCount = alumniData.filter(a => a.status === 'pending').length;
  const approvedCount = alumniData.filter(a => a.status === 'approved').length;
  const rejectedCount = alumniData.filter(a => a.status === 'rejected').length;

  const filteredAlumni = alumniData.filter(alumni => {
    const matchesSearch = 
      (alumni.firstName && alumni.firstName.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (alumni.lastName && alumni.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alumni.email && alumni.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alumni.department && alumni.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || alumni.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="alumni-verification-page">
      {/* Page Title Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="page-title-card"
      >
        <h1 className="text-2xl font-bold text-gray-800">Alumni Verification</h1>
        <p className="text-gray-600 mt-1">Manually verify new alumni registrations</p>
      </motion.div>

      {/* Smart Control Bar */}
      <div className="control-bar">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search alumni by name, email, or department..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{pendingCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Approved</span>
              <span className="stat-value">{approvedCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rejected</span>
              <span className="stat-value">{rejectedCount}</span>
            </div>
          </div>
        </div>
        
        <div className="filter-pills-container">
          <button 
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-pill ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => handleFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-pill ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => handleFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`filter-pill ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => handleFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Alumni Cards Grid - Premium Design */}
      {!loading && (
        <div className="alumni-cards-grid">
          {filteredAlumni.map((alumni, index) => (
            <motion.div
              key={alumni._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="alumni-card"
              onClick={() => handleAlumniClick(alumni)}
            >
              <div className="card-header">
                <div className="avatar">
                  {alumni.firstName?.charAt(0)}{alumni.lastName?.charAt(0)}
                </div>
                <span className={getStatusClass(alumni.status)}>
                  {getStatusText(alumni.status)}
                </span>
              </div>

              <h3 className="alumni-name">{alumni.firstName} {alumni.lastName}</h3>
              <p className="alumni-dept">{alumni.department} • {alumni.graduationYear}</p>

              <div className="alumni-meta">
                <span className="company">🏢 {alumni.company}</span>
                <span className="location">📍 {alumni.location}</span>
              </div>

              <div className="card-footer">
                <span className="verify-btn">
                  {alumni.status === 'approved' 
                    ? 'View verified profile →' 
                    : 'Verify Profile →'}
                </span>
              </div>
              
              {alumni.isVerified && (
                <span className="verified-badge">
                  ✔ Verified by Institution
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredAlumni.length === 0 && (
        <div className="empty-state-card">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No alumni found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Enhanced Center Profile Modal */}
      <AnimatePresence>
        {isPanelOpen && selectedAlumni && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="alumni-modal-overlay"
              onClick={closePanel}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="alumni-modal-card"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-btn" onClick={closePanel}>✕</button>

                <div className="alumni-header">
                  <div className="avatar">
                    {selectedAlumni.firstName?.charAt(0)}{selectedAlumni.lastName?.charAt(0)}
                  </div>

                  <div className="alumni-info">
                    <h2>{selectedAlumni.firstName} {selectedAlumni.lastName}</h2>
                    <p className="dept">{selectedAlumni.department}</p>
                    <p className="college">{selectedAlumni.collegeName}</p>
                    <p className="batch">Batch • {selectedAlumni.graduationYear}</p>
                    {selectedAlumni.isVerified && (
                      <span className="verified-badge">
                        ✔ Verified by Institution
                      </span>
                    )}
                  </div>
                </div>

                <div className="alumni-details">
                  <div>
                    <label>Email</label>
                    <span>{selectedAlumni.email}</span>
                  </div>

                  <div>
                    <label>Register No</label>
                    <span>{selectedAlumni.rollNumber}</span>
                  </div>

                  <div>
                    <label>Company</label>
                    <span>{selectedAlumni.company}</span>
                  </div>

                  <div>
                    <label>Location</label>
                    <span>{selectedAlumni.location}</span>
                  </div>
                </div>

                {selectedAlumni.status !== 'approved' && (
                  <div className="documents-section">
                    <h4>Uploaded Documents</h4>
                    <button 
                      className="doc-button"
                      onClick={() => openDoc(selectedAlumni.idProof)}
                    >
                      View ID Proof
                    </button>
                  </div>
                )}

                {selectedAlumni.status !== 'approved' && (
                  <div className="action-buttons">
                    <button 
                      className="approve-btn"
                      onClick={() => handleVerifyAlumni(selectedAlumni._id, 'approve')}
                    >
                      Approve
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={openRejectModal}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {selectedAlumni.status === 'approved' && (
                  <div className="verified-message">
                    <span className="verified-badge large">
                      ✔ Verified by Institution
                    </span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reject Reason Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="alumni-modal-overlay"
            onClick={closeRejectModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="reject-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Reject Alumni Request</h3>

              <textarea
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />

              <div className="reject-actions">
                <button className="cancel-btn" onClick={closeRejectModal}>
                  Cancel
                </button>
                <button
                  className="confirm-reject"
                  disabled={!rejectReason}
                  onClick={submitRejection}
                >
                  Confirm Reject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Viewer */}
      <AnimatePresence>
        {showDocViewer && currentDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="alumni-modal-overlay"
            onClick={closeDocViewer}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="doc-viewer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="doc-viewer-header">
                <h3>Document Preview</h3>
                <button className="close-btn" onClick={closeDocViewer}>✕</button>
              </div>
              <iframe 
                src={currentDoc} 
                title="Document Preview" 
                className="doc-iframe"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="toast success"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Styles for Premium Alumni Verification Page */}
      <style jsx>{`
        .alumni-verification-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f7f8fc 0%, #eef2ff 100%);
          padding: 24px;
        }

        /* Page Title Card */
        .page-title-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          margin-bottom: 24px;
        }

        /* Smart Control Bar */
        .control-bar {
          background: linear-gradient(135deg, #f8f9ff, #eef2ff);
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          margin-bottom: 24px;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 40px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: white;
          font-size: 14px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }

        .search-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .stats-container {
          display: flex;
          gap: 16px;
          margin-top: 12px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .filter-pills-container {
          display: flex;
          gap: 8px;
          margin-top: 16px;
          flex-wrap: wrap;
        }

        .filter-pill {
          padding: 10px 18px;
          border-radius: 999px;
          font-weight: 500;
          background: #fff;
          border: 1px solid #e5e7eb;
          transition: all 0.25s ease;
          cursor: pointer;
          font-size: 14px;
        }

        .filter-pill:hover {
          background: #f3f4f6;
        }

        .filter-pill.active {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: white;
          box-shadow: 0 6px 16px rgba(79,70,229,0.35);
          border: none;
        }

        /* Alumni Cards Grid */
        .alumni-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        /* Premium Alumni Card */
        .alumni-card {
          background: white;
          border-radius: 18px;
          padding: 20px;
          position: relative;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.03);
        }

        .alumni-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 45px rgba(0,0,0,0.12);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: white;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        /* Status Badges */
        .status-badge {
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.pending {
          background: #fff7ed;
          color: #d97706;
        }

        .status-badge.approved {
          background: #ecfdf5;
          color: #16a34a;
        }

        .status-badge.rejected {
          background: #fef2f2;
          color: #dc2626;
        }

        .alumni-name {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .alumni-dept {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 16px 0;
        }

        .alumni-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .company, .location {
          font-size: 14px;
          color: #4b5563;
        }

        .card-footer {
          border-top: 1px solid #f3f4f6;
          padding-top: 16px;
        }

        .verify-btn {
          color: #4f46e5;
          font-weight: 600;
          font-size: 14px;
        }

        .verify-btn:hover {
          text-decoration: underline;
        }

        /* Verified Badge */
        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: #dcfce7;
          color: #166534;
          font-size: 12px;
          border-radius: 999px;
          font-weight: 600;
          margin-top: 8px;
        }

        .verified-badge.large {
          font-size: 14px;
          padding: 8px 16px;
        }

        /* Empty State */
        .empty-state-card {
          background: white;
          border-radius: 16px;
          padding: 48px 24px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
        }

        /* Modal Overlay */
        .alumni-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        /* Alumni Modal Card */
        .alumni-modal-card {
          background: #fff;
          width: 520px;
          max-width: 90%;
          padding: 24px;
          border-radius: 16px;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          max-height: 90vh;
          overflow-y: auto;
        }

        /* Close Button */
        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          border: none;
          background: #f1f1f1;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
        }

        /* Alumni Header */
        .alumni-header {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 20px;
        }

        /* Avatar */
        .avatar {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg,#6a5acd,#8a2be2);
          color: white;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 22px;
          font-weight: 600;
        }

        /* Name & Info */
        .alumni-header h2 {
          margin: 0 0 6px 0;
          font-size: 22px;
          font-weight: 700;
        }

        .dept {
          font-weight: 500;
          color: #555;
          margin: 0 0 2px 0;
        }

        .college {
          font-size: 14px;
          color: #777;
          margin: 0 0 2px 0;
        }

        .batch {
          font-size: 13px;
          color: #999;
          margin: 0;
        }

        /* Alumni Details */
        .alumni-details {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 16px;
          margin: 20px 0;
        }

        .alumni-details label {
          font-size: 12px;
          color: #888;
        }

        .alumni-details span {
          display: block;
          font-weight: 500;
          margin-top: 4px;
        }

        /* Documents Section */
        .documents-section {
          margin: 20px 0;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .documents-section h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .doc-button {
          display: block;
          width: 100%;
          margin-top: 8px;
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          text-align: left;
          font-weight: 500;
        }

        .doc-button:hover {
          background: #f3f4f6;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
        }

        .approve-btn {
          padding: 12px 30px;
          border-radius: 8px;
          border: none;
          background: #16a34a;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .approve-btn:hover {
          background: #15803d;
        }

        .reject-btn {
          padding: 12px 30px;
          border-radius: 8px;
          border: 1px solid #dc2626;
          background: #fff;
          color: #dc2626;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .reject-btn:hover {
          background: #fef2f2;
        }

        /* Verified Message */
        .verified-message {
          text-align: center;
          margin-top: 20px;
        }

        /* Reject Modal */
        .reject-modal {
          background: white;
          padding: 24px;
          border-radius: 14px;
          width: 400px;
          max-width: 90%;
        }

        .reject-modal h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .reject-modal textarea {
          width: 100%;
          height: 100px;
          margin-top: 12px;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          resize: none;
          font-family: inherit;
        }

        .reject-modal textarea:focus {
          outline: none;
          border-color: #4f46e5;
        }

        .reject-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
        }

        .cancel-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background: #f9fafb;
          cursor: pointer;
        }

        .confirm-reject {
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid #dc2626;
          background: #dc2626;
          color: white;
          cursor: pointer;
        }

        .confirm-reject:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Document Viewer */
        .doc-viewer {
          background: white;
          width: 90%;
          max-width: 800px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .doc-viewer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #eee;
        }

        .doc-viewer-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .doc-iframe {
          width: 100%;
          height: 70vh;
          border: none;
        }

        /* Toast */
        .toast {
          position: fixed;
          bottom: 30px;
          right: 30px;
          padding: 14px 20px;
          border-radius: 10px;
          font-weight: 500;
          z-index: 1000;
        }

        .toast.success {
          background: #16a34a;
          color: white;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .alumni-verification-page {
            padding: 16px;
          }
          
          .stats-container {
            flex-direction: column;
            gap: 8px;
          }
          
          .alumni-details {
            grid-template-columns: 1fr;
          }
          
          .action-buttons {
            flex-direction: column;
            gap: 12px;
          }
          
          .approve-btn, .reject-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AlumniManagement;