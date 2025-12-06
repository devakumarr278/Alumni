import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, USER_ROLES } from '../context/AuthContext';
import Button from '../components/common/Button';
import { indianStates, collegesByState, validIndianDomains, indianDepartments, generateIndianYears } from '../data/indianColleges';
import passwordValidation from '../utils/passwordValidation';

const Register = () => {
  const { register, verifyEmail, resendVerificationEmail, pendingRegistration, loading, setLoading, setPendingRegistration } = useAuth();
  const navigate = useNavigate();
  
  // Add responsive styles
  const responsiveStyles = `
    @media (max-width: 768px) {
      .register-form {
        padding: 25px !important;
      }
      .password-fields {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Common fields
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    role: '',
    
    // Student specific - new order
    registerNumber: '',
    institutionalEmail: '',
    state: '',
    collegeName: '',
    department: '',
    passingOutYear: '',
    yearOfAdmission: '',
    
    // Alumni specific - mandatory fields in order
    personalEmail: '',
    institutionName: '',
    graduationYear: '',
    proofDocument: '',
    mobileNumber: '',
    rollNumber: '',
    companyName: '',
    companyLocation: '',
    companyCode: '',
    roleInCompany: '',
    
    // Institution specific
    institutionType: '',
    affiliationDetails: '',
    establishedYear: '',
    institutionCode: '',
    address: '',
    website: '',
    landlineNumber: '',
    institutionDocuments: ''
  });
  
  const [errors, setErrors] = useState({});
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ strength: 'weak', errors: [] });
  const [selectedState, setSelectedState] = useState('');
  const [collegeSearchTerm, setCollegeSearchTerm] = useState('');
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [resendLoading, setResendLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);

  // Check if there's a pending registration
  useEffect(() => {
    if (pendingRegistration && !emailSent) {
      setCurrentStep(3); // Jump to verification step
      setEmailSent(true);
    }
  }, [pendingRegistration, emailSent]);

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.role) newErrors.role = 'Please select a role';
    }
    
    if (step === 2) {
      // Enhanced Password validation
      const passwordValidationResult = passwordValidation.validatePassword(formData.password);
      if (!passwordValidationResult.isValid) {
        newErrors.password = passwordValidationResult.errors[0]; // Show first error
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      // Role-specific validations
      if (formData.role === USER_ROLES.STUDENT) {
        if (!formData.institutionalEmail.trim()) {
          newErrors.institutionalEmail = 'Institutional email is required';
        } else {
          // Validate email format instead of domain restriction
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.institutionalEmail)) {
            newErrors.institutionalEmail = 'Please enter a valid email address';
          }
        }
        
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';
        if (!formData.passingOutYear) newErrors.passingOutYear = 'Passing out year is required';
        if (!formData.yearOfAdmission) newErrors.yearOfAdmission = 'Year of admission is required';
      }
      
      if (formData.role === USER_ROLES.ALUMNI) {
        if (!formData.personalEmail.trim()) newErrors.personalEmail = 'Personal email is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.institutionName.trim()) newErrors.institutionName = 'Institution name is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';
        if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
        if (!formData.proofDocument) newErrors.proofDocument = 'Proof document is required';
        if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
        if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!formData.companyLocation.trim()) newErrors.companyLocation = 'Company location is required';
        if (!formData.companyCode.trim()) newErrors.companyCode = 'Company code is required';
        if (!formData.roleInCompany.trim()) newErrors.roleInCompany = 'Role in company is required';
        
        // Email validation
        if (formData.personalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)) {
          newErrors.personalEmail = 'Please enter a valid email address';
        }
        
        // Mobile number validation
        const mobileRegex = /^[+]?[0-9]{10,15}$/;
        if (formData.mobileNumber && !mobileRegex.test(formData.mobileNumber.replace(/\s/g, ''))) {
          newErrors.mobileNumber = 'Please enter a valid mobile number';
        }
      }
      
      if (formData.role === USER_ROLES.INSTITUTION) {
        if (!formData.institutionalEmail.trim()) newErrors.institutionalEmail = 'Institutional email is required';
        if (!formData.institutionName.trim()) newErrors.institutionName = 'Institution name is required';
        if (!formData.institutionType.trim()) newErrors.institutionType = 'Institution type is required';
        if (!formData.establishedYear) newErrors.establishedYear = 'Established year is required';
        if (!formData.address.trim()) newErrors.address = 'Complete address is required';
        if (!formData.website.trim()) newErrors.website = 'Official website is required';
        if (!formData.landlineNumber.trim()) newErrors.landlineNumber = 'Landline number is required';
        if (!formData.institutionDocuments) newErrors.institutionDocuments = 'Official documents are required';
        
        // Validate email format instead of domain restriction
        if (formData.institutionalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.institutionalEmail)) {
          newErrors.institutionalEmail = 'Please enter a valid email address';
        }
        
        // Validate website URL format
        if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
          newErrors.website = 'Please enter a valid website URL starting with http:// or https://';
        }
        
        // Validate phone numbers
        const landlineRegex = /^[0-9]{2,4}-[0-9]{6,8}$/;
        if (formData.landlineNumber && !landlineRegex.test(formData.landlineNumber)) {
          newErrors.landlineNumber = 'Please enter a valid landline number (e.g., 040-12345678)';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time password validation
    if (name === 'password') {
      const validation = passwordValidation.validatePassword(value);
      setPasswordStrength(validation);
    }
    
    // Handle state selection - filter colleges
    if (name === 'state') {
      setSelectedState(value);
      setFilteredColleges(collegesByState[value] || []);
      setFormData(prev => ({ 
        ...prev, 
        state: value,
        collegeName: '', // Reset college when state changes
        institutionName: '' // Reset institution when state changes for alumni
      }));
      setCollegeSearchTerm('');
    }
    
    // Handle file upload
    if (name === 'proofDocument') {
      const file = e.target.files[0];
      if (file) {
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, proofDocument: 'File size must be less than 10MB' }));
          return;
        }
        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          setErrors(prev => ({ ...prev, proofDocument: 'Only PDF, JPG, JPEG, PNG files are allowed' }));
          return;
        }
        setFormData(prev => ({ ...prev, [name]: file }));
      }
      return;
    }
    
    // Handle institution documents upload
    if (name === 'institutionDocuments') {
      const files = e.target.files;
      if (files && files.length > 0) {
        const validFiles = [];
        const errors = [];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          // Validate file size (10MB limit)
          if (file.size > 10 * 1024 * 1024) {
            errors.push(`${file.name}: File size must be less than 10MB`);
            continue;
          }
          
          // Validate file type
          const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
          if (!allowedTypes.includes(file.type)) {
            errors.push(`${file.name}: Only PDF, JPG, JPEG, PNG files are allowed`);
            continue;
          }
          
          validFiles.push(file);
        }
        
        if (errors.length > 0) {
          setErrors(prev => ({ ...prev, institutionDocuments: errors.join('; ') }));
        } else {
          setErrors(prev => ({ ...prev, institutionDocuments: '' }));
        }
        
        setFormData(prev => ({ ...prev, [name]: validFiles }));
      }
      return;
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Make sure this is at the very beginning
    
    console.log('Form submission started');
    if (!validateStep(2)) {
      console.log('Validation failed');
      return;
    }
    
    try {
      console.log('Submitting registration with data:', formData);
      
      // Log the specific fields being sent for debugging
      const registrationData = {
        firstName: formData.role === USER_ROLES.INSTITUTION 
          ? (formData.institutionName?.split(' ').slice(0, 1).join(' ') || 'Institution') 
          : formData.firstName?.trim(),
        lastName: formData.role === USER_ROLES.INSTITUTION 
          ? (formData.institutionName?.split(' ').slice(1).join(' ') || 'Admin') 
          : formData.lastName?.trim(),
        email: formData.role === USER_ROLES.ALUMNI ? formData.personalEmail?.trim() : formData.institutionalEmail?.trim(),
        password: formData.password,
        role: formData.role,  // This was incorrectly set as userType before
        collegeName: (formData.collegeName || formData.institutionName)?.trim(),
        // Use registerNumber for students and rollNumber for alumni
        rollNumber: formData.role === USER_ROLES.STUDENT ? formData.registerNumber?.trim() : formData.rollNumber?.trim(),
        department: formData.department?.trim(),
        graduationYear: formData.graduationYear,
        currentYear: formData.yearOfAdmission,
        phone: formData.mobileNumber?.trim(),
        currentPosition: formData.roleInCompany?.trim(),
        company: formData.companyName?.trim(),
        location: formData.companyLocation?.trim(),
        // Add institution-specific fields
        institutionType: formData.institutionType?.trim(),
        establishedYear: formData.establishedYear,
        address: formData.address?.trim(),
        website: formData.website?.trim(),
        institutionCode: formData.institutionCode?.trim()
      };
      
      // Log what we're actually sending
      console.log('Mapped registration data:', registrationData);
      
      // Check for missing required fields before sending
      const missingFields = [];
      if (!registrationData.firstName) missingFields.push('First name');
      if (!registrationData.lastName) missingFields.push('Last name');
      if (!registrationData.email) missingFields.push('Email');
      if (!registrationData.password) missingFields.push('Password');
      if (!registrationData.role) missingFields.push('Role');
      if (!registrationData.collegeName) missingFields.push('College name');
      
      // For students and alumni, rollNumber/registerNumber and department are required
      if ((registrationData.role === USER_ROLES.STUDENT || registrationData.role === USER_ROLES.ALUMNI)) {
        // For students, check registerNumber; for alumni, check rollNumber
        if (registrationData.role === USER_ROLES.STUDENT && !registrationData.rollNumber) {
          missingFields.push('Register number');
        } else if (registrationData.role === USER_ROLES.ALUMNI && !registrationData.rollNumber) {
          missingFields.push('Roll number');
        }
        
        if (!registrationData.department) missingFields.push('Department');
      }
      
      // For institutions, check institution-specific fields
      if (registrationData.role === USER_ROLES.INSTITUTION) {
        if (!registrationData.institutionType) missingFields.push('Institution type');
        if (!registrationData.establishedYear) missingFields.push('Established year');
        if (!registrationData.address) missingFields.push('Address');
      }
      
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        setErrors({ submit: `Missing required fields: ${missingFields.join(', ')}` });
        return;
      }
      
      const result = await register(registrationData);
      console.log('Registration result:', result);
      
      if (result.success) {
        console.log('Registration successful, moving to verification step');
        setCurrentStep(3);
        setEmailSent(true);
      } else {
        console.log('Registration failed:', result.error);
        // Scroll to top to show error message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setErrors({ submit: result.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setErrors({ verification: 'Please enter the verification code' });
      return;
    }
    
    try {
      console.log('Verifying email with code:', verificationCode);
      const result = await verifyEmail(verificationCode);
      console.log('Verification result:', result);
      
      if (result.success) {
        setCurrentStep(4);
        
        // ✅ Auto-redirect to dashboard if auto-login was successful
        if (result.autoLogin && result.user) {
          setTimeout(() => {
            // Redirect to appropriate dashboard based on user type
            switch (result.user.role || result.user.userType) { // Handle both role and userType
              case 'student':
              case USER_ROLES.STUDENT:
                console.log('Navigating to student dashboard');
                navigate('/studentpart/dashboard');
                break;
              case 'alumni':
              case USER_ROLES.ALUMNI:
                console.log('Navigating to alumni dashboard');
                // Check if alumni is pending approval (either from status or pendingApproval flag)
                if (result.user.status === 'pending' || result.pendingApproval) {
                  navigate('/pending-approval');
                } else {
                  navigate('/alumni/dashboard'); // Use the new route structure
                }
                break;
              case 'admin':
              case USER_ROLES.INSTITUTION:
                console.log('Navigating to institution dashboard');
                navigate('/institution/dashboard'); // Use the new route structure
                break;
              default:
                console.log('Unknown role, navigating to home');
                navigate('/');
            }
          }, 3000);
        } else {
          // Redirect to login page for manual login
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                message: 'Email verified successfully! Please log in to continue.',
                role: pendingRegistration?.role || formData.role
              } 
            });
          }, 3000);
        }
      } else {
        setErrors({ verification: result.error || 'Verification failed. Please try again.' });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setErrors({ verification: error.message || 'Verification failed. Please try again.' });
    }
  };

  const handleResendVerification = async () => {
    try {
      setResendLoading(true);
      setErrors({});
      
      // Use the resendVerificationEmail function from AuthContext
      const result = await resendVerificationEmail();
      
      if (result.success) {
        alert('Verification email resent successfully! Please check your inbox.');
      } else {
        throw new Error(result.error || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setErrors({ verification: error.message || 'Failed to resend verification email. Please try again.' });
    } finally {
      setResendLoading(false);
    }
  };

  const handleStartOver = () => {
    // Clear pending registration and form data
    localStorage.removeItem('pendingRegistration');
    if (setPendingRegistration) {
      setPendingRegistration(null);
    }
    setFormData({
      // Reset to initial form state
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      role: '',
      // Student specific
      registerNumber: '',
      institutionalEmail: '',
      state: '',
      collegeName: '',
      department: '',
      passingOutYear: '',
      yearOfAdmission: '',
      // Alumni specific
      personalEmail: '',
      institutionName: '',
      graduationYear: '',
      proofDocument: '',
      mobileNumber: '',
      rollNumber: '',
      companyName: '',
      companyLocation: '',
      companyCode: '',
      roleInCompany: '',
      // Institution specific
      institutionType: '',
      affiliationDetails: '',
      establishedYear: '',
      institutionCode: '',
      address: '',
      website: '',
      landlineNumber: '',
      institutionDocuments: ''
    });
    setCurrentStep(1);
    setErrors({});
    setVerificationCode('');
  };

  const handleChangeEmail = () => {
    // Allow user to change their email address during verification step
    const newEmail = prompt('Enter your correct email address:', 
      pendingRegistration?.email || formData.email || 
      (formData.role === USER_ROLES.ALUMNI 
        ? formData.personalEmail 
        : formData.institutionalEmail) || '');
    
    if (newEmail && newEmail !== (pendingRegistration?.email || formData.email)) {
      // Update form data with new email
      if (formData.role === USER_ROLES.ALUMNI) {
        setFormData(prev => ({ ...prev, personalEmail: newEmail }));
      } else {
        setFormData(prev => ({ ...prev, institutionalEmail: newEmail }));
      }
      
      // Update pending registration if it exists
      if (pendingRegistration && setPendingRegistration) {
        const updatedPendingReg = { ...pendingRegistration, email: newEmail };
        setPendingRegistration(updatedPendingReg);
        localStorage.setItem('pendingRegistration', JSON.stringify(updatedPendingReg));
      }
      
      // Resend verification to new email
      handleResendVerification();
    }
  };

  const renderRoleSelection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 
          style={{ 
            textAlign: 'center',
            fontSize: '26px',
            marginBottom: '25px',
            color: '#2c3e50',
            letterSpacing: '.04em'
          }}
        >
          Choose Your Role
        </h2>
        <p 
          className="text-lg mb-8" 
          style={{ color: '#738ab1', letterSpacing: '.02em' }}
        >
          Select the role that best describes you
        </p>
      </div>
      
      <div className="flex justify-between gap-5 mb-7" style={{ position: 'relative', zIndex: 2 }}>
        {[
          { 
            value: USER_ROLES.STUDENT, 
            label: 'Student', 
            icon: '🎓',
            description: 'Current student with college email'
          },
          { 
            value: USER_ROLES.ALUMNI, 
            label: 'Alumni', 
            icon: '🧑‍🎓',
            description: 'Graduate with verification documents'
          },
          { 
            value: USER_ROLES.INSTITUTION, 
            label: 'Institution', 
            icon: '🏛',
            description: 'Educational Institution'
          }
        ].map((role) => {
          const isSelected = formData.role === role.value;
          return (
            <label key={role.value} className="relative cursor-pointer flex-1">
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={isSelected}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div 
                className="transition-all duration-300 text-center flex flex-col items-center gap-2.5 relative transform"
                style={{
                  flex: 1,
                  background: isSelected 
                    ? 'linear-gradient(120deg, #e7f7fc 0%, #c8e2ff 100%)'
                    : 'linear-gradient(110deg, #f1f9fd 0%, #eef1fb 100%)',
                  borderRadius: '16px',
                  boxShadow: isSelected
                    ? '0 17px 32px 0 rgba(36, 101, 232, .19)'
                    : '0 3px 17px rgba(60,90,180,.09)',
                  padding: '33px 11px 23px',
                  border: isSelected 
                    ? '2px solid #2465e8'
                    : '2px solid #e3eafe',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  willChange: 'transform'
                }}
                tabIndex={0}
                aria-label={`${role.label} role: ${role.description}`}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.target.style.background = 'linear-gradient(120deg, #e7f7fc 0%, #c8e2ff 100%)';
                    e.target.style.borderColor = '#2465e8';
                    e.target.style.boxShadow = '0 17px 32px 0 rgba(36, 101, 232, .19)';
                    e.target.style.transform = 'translateY(-5px) scale(1.045)';
                    e.target.style.zIndex = '3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.target.style.background = 'linear-gradient(110deg, #f1f9fd 0%, #eef1fb 100%)';
                    e.target.style.borderColor = '#e3eafe';
                    e.target.style.boxShadow = '0 3px 17px rgba(60,90,180,.09)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.zIndex = '1';
                  }
                }}
              >
                <span 
                  className="text-4xl mb-0"
                  style={{
                    filter: isSelected 
                      ? 'drop-shadow(0 5px 6px #aac4ee)'
                      : 'drop-shadow(0 2px 3px #ccd8ee)',
                    transition: 'filter 0.21s'
                  }}
                  aria-hidden="true"
                >
                  {role.icon}
                </span>
                <span 
                  className="font-bold text-lg block"
                  style={{
                    color: isSelected ? '#2465e8' : '#243368',
                    letterSpacing: isSelected ? '.6px' : '.01em',
                    transition: 'color 0.15s, letter-spacing 0.15s'
                  }}
                >
                  {role.label}
                </span>
                <span 
                  className="text-base font-normal mt-0.5"
                  style={{
                    color: '#788ab1'
                  }}
                >
                  {role.description}
                </span>
              </div>
            </label>
          );
        })}
      </div>
      
      {errors.role && (
        <p className="text-red-600 text-sm text-center">{errors.role}</p>
      )}
      
      <div className="text-center">
        <button 
          onClick={handleNextStep}
          disabled={!formData.role}
          className="transition-all duration-200 font-semibold text-lg rounded-xl border-none py-4 cursor-pointer font-inherit"
          style={{
            background: formData.role 
              ? 'linear-gradient(90deg,#2465e8 60%, #3153dc 100%)'
              : '#9ca3af',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.14em',
            width: '83%',
            marginTop: '20px',
            boxShadow: formData.role 
              ? '0 2px 11px 0 rgba(36,101,232,.10)'
              : 'none',
            letterSpacing: '.04em',
            cursor: formData.role ? 'pointer' : 'not-allowed'
          }}
          onMouseEnter={(e) => {
            if (formData.role) {
              e.target.style.background = 'linear-gradient(90deg,#184473 60%, #3153dc 100%)';
              e.target.style.boxShadow = '0 6px 28px 0 rgba(36,101,232,.17)';
            }
          }}
          onMouseLeave={(e) => {
            if (formData.role) {
              e.target.style.background = 'linear-gradient(90deg,#2465e8 60%, #3153dc 100%)';
              e.target.style.boxShadow = '0 2px 11px 0 rgba(36,101,232,.10)';
            }
          }}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );

  const renderPersonalInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 style={{
          textAlign: 'center',
          fontSize: '26px',
          marginBottom: '25px',
          color: '#2c3e50'
        }}>
          {formData.role === USER_ROLES.STUDENT && 'Student Information'}
          {formData.role === USER_ROLES.ALUMNI && 'Alumni Information'}
          {formData.role === USER_ROLES.INSTITUTION && 'Institution Information'}
        </h2>
        <p className="text-gray-600 text-lg">Please provide your details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Common Fields - Only for Student and Alumni */}
        {(formData.role === USER_ROLES.STUDENT || formData.role === USER_ROLES.ALUMNI) && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.firstName ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.firstName) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.lastName ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.lastName) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>
        )}

        {/* Role-specific fields */}
        {formData.role === USER_ROLES.STUDENT && (
          <>
            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                Register Number *
              </label>
              <input
                type="text"
                name="registerNumber"
                value={formData.registerNumber}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.registerNumber ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.registerNumber) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="STU2024001"
              />
              {errors.registerNumber && <p className="text-red-600 text-sm mt-1">{errors.registerNumber}</p>}
            </div>

            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                Institutional Email * (e.g., student@skcet.ac.in)
              </label>
              <input
                type="email"
                name="institutionalEmail"
                value={formData.institutionalEmail}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.institutionalEmail ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.institutionalEmail) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="student@skcet.ac.in"
              />
              {errors.institutionalEmail && <p className="text-red-600 text-sm mt-1">{errors.institutionalEmail}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Must be from an educational institution (.edu, .ac.in, etc.)
              </p>
            </div>

            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.state ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.state) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
            </div>

            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                College Name *
              </label>
              <select
                name="collegeName"
                value={formData.collegeName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.collegeName ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.collegeName) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                disabled={!selectedState}
              >
                <option value="">Select your college</option>
                {filteredColleges.map((college, index) => (
                  <option key={index} value={college}>
                    {college}
                  </option>
                ))}
                <option value="other">Other (Not listed)</option>
              </select>
              {errors.collegeName && <p className="text-red-600 text-sm mt-1">{errors.collegeName}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label style={{
                  fontWeight: '500',
                  display: 'block',
                  marginBottom: '12px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    marginBottom: '18px',
                    border: errors.department ? '1px solid #ef4444' : '1px solid #ccc',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    height: '48px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4a90e2';
                    e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                  }}
                  onBlur={(e) => {
                    if (!errors.department) {
                      e.target.style.borderColor = '#ccc';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  <option value="" style={{ padding: '8px' }}>Select Department</option>
                  {indianDepartments.map((dept, index) => (
                    <option key={index} value={dept} style={{ padding: '8px' }}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <label style={{
                  fontWeight: '500',
                  display: 'block',
                  marginBottom: '12px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Passing Out Year *
                </label>
                <select
                  name="passingOutYear"
                  value={formData.passingOutYear}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    marginBottom: '18px',
                    border: errors.passingOutYear ? '1px solid #ef4444' : '1px solid #ccc',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    height: '48px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4a90e2';
                    e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                  }}
                  onBlur={(e) => {
                    if (!errors.passingOutYear) {
                      e.target.style.borderColor = '#ccc';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  <option value="" style={{ padding: '8px' }}>Select Year</option>
                  {generateIndianYears().map((year) => (
                    <option key={year} value={year} style={{ padding: '8px' }}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.passingOutYear && <p className="text-red-600 text-sm mt-1">{errors.passingOutYear}</p>}
              </div>

              <div>
                <label style={{
                  fontWeight: '500',
                  display: 'block',
                  marginBottom: '12px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Year of Admission *
                </label>
                <select
                  name="yearOfAdmission"
                  value={formData.yearOfAdmission}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    marginBottom: '18px',
                    border: errors.yearOfAdmission ? '1px solid #ef4444' : '1px solid #ccc',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    height: '48px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4a90e2';
                    e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                  }}
                  onBlur={(e) => {
                    if (!errors.yearOfAdmission) {
                      e.target.style.borderColor = '#ccc';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  <option value="" style={{ padding: '8px' }}>Select Year</option>
                  {generateIndianYears().filter(year => year <= new Date().getFullYear()).map((year) => (
                    <option key={year} value={year} style={{ padding: '8px' }}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.yearOfAdmission && <p className="text-red-600 text-sm mt-1">{errors.yearOfAdmission}</p>}
              </div>
            </div>
          </>
        )}

        {formData.role === USER_ROLES.ALUMNI && (
          <>
            {/* Personal Email ID */}
            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                Personal Email ID *
              </label>
              <input
                type="email"
                name="personalEmail"
                value={formData.personalEmail}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.personalEmail ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.personalEmail) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="personal@email.com"
              />
              {errors.personalEmail && <p className="text-red-600 text-sm mt-1">{errors.personalEmail}</p>}
            </div>

            {/* State & Institution Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution Name *
                </label>
                <select
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.institutionName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={!formData.state}
                >
                  <option value="">Select Institution</option>
                  {filteredColleges.map((college, index) => (
                    <option key={index} value={college}>
                      {college}
                    </option>
                  ))}
                  <option value="other">Other (Not listed)</option>
                </select>
                {errors.institutionName && <p className="text-red-600 text-sm mt-1">{errors.institutionName}</p>}
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Department</option>
                {indianDepartments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
            </div>

            {/* Passed-out Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passed-out Year *
              </label>
              <select
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.graduationYear ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Graduation Year</option>
                {generateIndianYears().filter(year => year <= new Date().getFullYear()).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.graduationYear && <p className="text-red-600 text-sm mt-1">{errors.graduationYear}</p>}
            </div>

            {/* Upload Proof */}
            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                Upload Proof * (Degree Certificate preferred, or Last Semester Marksheet if degree not issued yet)
              </label>
              <input
                type="file"
                name="proofDocument"
                onChange={handleInputChange}
                accept=".pdf,.jpg,.jpeg,.png"
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '18px',
                  background: '#f9f9f9',
                  border: '2px dashed #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.proofDocument) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.proofDocument && <p className="text-red-600 text-sm mt-1">{errors.proofDocument}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: PDF, JPG, JPEG, PNG (Max 10MB)
              </p>
            </div>

            {/* Mobile Number */}
            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.mobileNumber ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.mobileNumber) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="+91 9876543210"
                pattern="[+]?[0-9]{10,15}"
              />
              {errors.mobileNumber && <p className="text-red-600 text-sm mt-1">{errors.mobileNumber}</p>}
            </div>

            {/* Roll Number / Register Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number / Register Number *
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.rollNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ALU2020001 or REG123456"
              />
              {errors.rollNumber && <p className="text-red-600 text-sm mt-1">{errors.rollNumber}</p>}
            </div>

            {/* Current Company Details */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Current Company Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Google Inc."
                  />
                  {errors.companyName && <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Location
                  </label>
                  <input
                    type="text"
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.companyLocation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Bangalore, India"
                  />
                  {errors.companyLocation && <p className="text-red-600 text-sm mt-1">{errors.companyLocation}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Code
                  </label>
                  <input
                    type="text"
                    name="companyCode"
                    value={formData.companyCode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.companyCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="GOOGL or internal code"
                  />
                  {errors.companyCode && <p className="text-red-600 text-sm mt-1">{errors.companyCode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role in Company
                  </label>
                  <select
                    name="roleInCompany"
                    value={formData.roleInCompany}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.roleInCompany ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Role</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Senior Software Engineer">Senior Software Engineer</option>
                    <option value="Tech Lead">Tech Lead</option>
                    <option value="Engineering Manager">Engineering Manager</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="Business Analyst">Business Analyst</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Designer">Designer</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                    <option value="Sales Representative">Sales Representative</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Finance Manager">Finance Manager</option>
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.roleInCompany && <p className="text-red-600 text-sm mt-1">{errors.roleInCompany}</p>}
                </div>
              </div>
            </div>
          </>
        )}

        {formData.role === USER_ROLES.INSTITUTION && (
          <>
            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                Institution Name (as per official records) *
              </label>
              <input
                type="text"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.institutionName ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.institutionName) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="Enter exact name as per official records"
              />
              {errors.institutionName && <p className="text-red-600 text-sm mt-1">{errors.institutionName}</p>}
            </div>

            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                Institution Email *
              </label>
              <input
                type="email"
                name="institutionalEmail"
                value={formData.institutionalEmail}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.institutionalEmail ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.institutionalEmail) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="admin@institution.edu"
              />
              {errors.institutionalEmail && <p className="text-red-600 text-sm mt-1">{errors.institutionalEmail}</p>}
              
            </div>

            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                Institution Type *
              </label>
              <select
                name="institutionType"
                value={formData.institutionType}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.institutionType ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.institutionType) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                <option value="">Select Institution Type</option>
                <option value="University">University</option>
                <option value="College">College</option>
                <option value="School">School</option>
                <option value="Polytechnic">Polytechnic</option>
                <option value="Institute">Institute</option>
                <option value="Research Institute">Research Institute</option>
                <option value="Technical Institute">Technical Institute</option>
                <option value="Other">Other</option>
              </select>
              {errors.institutionType && <p className="text-red-600 text-sm mt-1">{errors.institutionType}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year of Establishment *
                </label>
                <input
                  type="number"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.establishedYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1950"
                />
                {errors.establishedYear && <p className="text-red-600 text-sm mt-1">{errors.establishedYear}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution Code
                </label>
                <input
                  type="text"
                  name="institutionCode"
                  value={formData.institutionCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="University/Government assigned code"
                />
                <p className="text-xs text-gray-500 mt-1">
                  If assigned by affiliating university or government body
                </p>
              </div>
            </div>

            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                Institution Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.address ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  resize: 'vertical'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.address) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="Include full address with city, state, pincode, and country"
              />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                website Url *
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.website ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.website) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="https://www.institution.edu"
              />
              {errors.website && <p className="text-red-600 text-sm mt-1">{errors.website}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Landline Number *
              </label>
              <input
                type="tel"
                name="landlineNumber"
                value={formData.landlineNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.landlineNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0XX-XXXXXXXX"
              />
              {errors.landlineNumber && <p className="text-red-600 text-sm mt-1">{errors.landlineNumber}</p>}
            </div>

            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                Upload Official Documents *
              </label>
              <input
                type="file"
                name="institutionDocuments"
                onChange={handleInputChange}
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '18px',
                  background: '#f9f9f9',
                  border: '2px dashed #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.institutionDocuments) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.institutionDocuments && <p className="text-red-600 text-sm mt-1">{errors.institutionDocuments}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Upload digitally signed or watermarked documents for authenticity verification<br/>
                (Registration certificate, Affiliation documents, etc. - Max 10MB each)
              </p>
            </div>
          </>
        )}

        {/* Password Fields - Moved to the end */}
        <div className="pt-4 border-t border-gray-200">
          <div className="password-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                Password * (8-12 characters)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    marginBottom: '18px',
                    border: errors.password ? '1px solid #ef4444' : '1px solid #ccc',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    paddingRight: '40px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4a90e2';
                    e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                  }}
                  onBlur={(e) => {
                    if (!errors.password) {
                      e.target.style.borderColor = '#ccc';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                  placeholder="Create a strong password"
                  maxLength={12}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Password Strength:</span>
                  <span className={`text-xs font-medium ${passwordValidation.getStrengthColor(passwordStrength.strength)}`}>
                    {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordValidation.getStrengthBgColor(passwordStrength.strength)}`}
                    style={{ width: `${passwordValidation.getStrengthPercentage(passwordStrength.strength)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

            <div>
              <label style={{
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
                color: '#333'
              }}>
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '18px',
                  border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid #ccc',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                  e.target.style.boxShadow = '0 0 8px rgba(74, 144, 226, 0.4)';
                }}
                onBlur={(e) => {
                  if (!errors.confirmPassword) {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
            {errors.submit}
          </div>
        )}

        <div className="flex justify-end pt-4">
