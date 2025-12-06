import React, { useState } from 'react';
import { useStudent } from '../StudentContext';
import Badge, { BADGE_TYPES } from '../../../components/Badge';

const BadgeVerificationRequest = () => {
  // Always call hooks at the top level
  const contextValue = useStudent();
  const [selectedBadgeType, setSelectedBadgeType] = useState('');
  const [documents, setDocuments] = useState({
    studentId: '',
    graduationYear: '',
    skill: '',
    additionalInfo: '',
    supportingDocs: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Handle context errors
  if (!contextValue) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Context Error</h3>
        <p className="text-gray-700">There was an error accessing the student data context.</p>
      </div>
    );
  }

  const { submitVerificationRequest, hasUserBadge, studentData } = contextValue;
  
  // Handle studentData errors
  if (!studentData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Data Error</h3>
        <p className="text-gray-700">Student data is not available.</p>
      </div>
    );
  }

  // Filter badge types that require admin approval and user doesn't already have
  const availableBadgeTypes = Object.keys(BADGE_TYPES).filter(type => {
    // Skip auto-granted badges and badges user already has
    const autoGrantedTypes = ['mentor-ready']; // These are awarded automatically
    return !autoGrantedTypes.includes(type) && !hasUserBadge(type);
  });

  const handleDocumentChange = (field, value) => {
    setDocuments(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd upload to a server and get a URL
      setDocuments(prev => ({
        ...prev,
        supportingDocs: {
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString()
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBadgeType) {
      setSubmitMessage('Please select a badge type');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await submitVerificationRequest(selectedBadgeType, {
        ...documents,
        studentProfile: {
          name: studentData?.profile?.name || '',
          email: studentData?.profile?.email || '',
          major: studentData?.profile?.major || '',
          graduationYear: studentData?.profile?.graduationYear || ''
        }
      });

      setSubmitMessage('Verification request submitted successfully! We will review your application within 5-7 business days.');
      
      // Reset form
      setSelectedBadgeType('');
      setDocuments({
        studentId: '',
        graduationYear: '',
        skill: '',
        additionalInfo: '',
        supportingDocs: null
      });
      
    } catch (error) {
      console.error('Error submitting verification request:', error);
      setSubmitMessage('Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (availableBadgeTypes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Badge Verification</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h4>
          <p className="text-gray-600">
            You have either earned all available badges or have pending verification requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Request Badge Verification</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Badge Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Badge Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableBadgeTypes.map(badgeType => {
              const badge = BADGE_TYPES[badgeType];
              return (
                <div key={badgeType}>
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="badgeType"
                      value={badgeType}
                      checked={selectedBadgeType === badgeType}
                      onChange={(e) => setSelectedBadgeType(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{badge?.icon || '🏅'}</span>
                      <div>
                        <div className="font-medium">{badge?.name || 'Unknown Badge'}</div>
                        <div className="text-sm text-gray-600">{badge?.description || ''}</div>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic form fields based on selected badge */}
        {selectedBadgeType && (
          <div className="space-y-4 border-t pt-6">
            <h4 className="font-medium text-gray-800">Verification Information</h4>
            
            {selectedBadgeType === 'verified-alumni' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    value={documents.studentId}
                    onChange={(e) => handleDocumentChange('studentId', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your student ID"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Year *
                  </label>
                  <input
                    type="number"
                    value={documents.graduationYear}
                    onChange={(e) => handleDocumentChange('graduationYear', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="YYYY"
                    min="1950"
                    max="2030"
                    required
                  />
                </div>
              </>
            )}

            {selectedBadgeType === 'skill-expert' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area of Expertise *
                </label>
                <input
                  type="text"
                  value={documents.skill}
                  onChange={(e) => handleDocumentChange('skill', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., React Development, Data Science, etc."
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information
              </label>
              <textarea
                value={documents.additionalInfo}
                onChange={(e) => handleDocumentChange('additionalInfo', e.target.value)}
                rows="3"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Provide any additional context or information to support your verification request..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supporting Documents
              </label>
              <input
                type="file"
                onChange={handleFileUpload}
                className="w-full border border-gray-300 rounded-md p-2"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <div className="text-xs text-gray-500 mt-1">
                Upload transcripts, certificates, or other supporting documents (PDF, images, or documents)
              </div>
              {documents.supportingDocs && (
                <div className="mt-2 text-sm text-green-600">
                  ✓ {documents.supportingDocs.name} uploaded
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!selectedBadgeType || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Verification Request'}
          </button>
        </div>
      </form>

      {/* Submit message */}
      {submitMessage && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          submitMessage.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {submitMessage}
        </div>
      )}

      {/* Current verification requests */}
      {studentData?.badges?.verificationRequests?.length > 0 && (
        <div className="mt-6 border-t pt-6">
          <h4 className="font-medium text-gray-800 mb-3">Pending Verification Requests</h4>
          <div className="space-y-2">
            {(studentData.badges.verificationRequests || []).map((request, index) => (
              <div key={request?.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{BADGE_TYPES[request?.badgeType]?.icon || '🏅'}</span>
                  <div>
                    <div className="font-medium">{BADGE_TYPES[request?.badgeType]?.name || 'Unknown Badge'}</div>
                    <div className="text-sm text-gray-600">
                      Submitted: {request?.submissionDate ? new Date(request.submissionDate).toLocaleDateString() : 'Unknown Date'}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  request?.status === 'approved' ? 'bg-green-100 text-green-800' :
                  request?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {request?.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Unknown'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeVerificationRequest;