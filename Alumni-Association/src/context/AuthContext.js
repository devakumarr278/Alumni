import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  ALUMNI: 'alumni',
  INSTITUTION: 'institution'
};

// User status
export const USER_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  SUSPENDED: 'suspended'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [pendingRegistration, setPendingRegistration] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    console.log('AuthProvider: Loading user from localStorage');
    const savedUser = localStorage.getItem('user');
    const savedPendingReg = localStorage.getItem('pendingRegistration');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('AuthProvider: Found saved user data:', userData);
        // Convert backend 'admin' userType to frontend 'institution' role
        // This ensures consistency between backend and frontend role naming
        if (userData.userType === 'admin') {
          userData.role = 'institution';
        } else {
          userData.role = userData.userType;
        }
        console.log('AuthProvider: Mapped user data:', userData);
        setUser(userData);
      } catch (error) {
        console.error('AuthProvider: Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    
    if (savedPendingReg) {
      try {
        setPendingRegistration(JSON.parse(savedPendingReg));
      } catch (error) {
        console.error('AuthProvider: Error parsing pending registration:', error);
        localStorage.removeItem('pendingRegistration');
      }
    }
    
    setLoading(false);
    console.log('AuthProvider: Finished loading, user state:', user);
  }, []);

  // Login function with role validation
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Actual API call for login
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          role: credentials.role
        })
      });
      
      console.log('Login response object:', response);
      
      // Check if response is ok before parsing
      if (!response.ok) {
        console.error('Login response not ok:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('Login parsed data:', data);
      
      // Check if data exists
      if (!data) {
        console.error('Login data is undefined or null');
        throw new Error('No data received from server');
      }
      
      if (data.success) {
        // Check if user exists in data
        if (!data.data) {
          console.error('Login data.data is undefined or null:', data);
          throw new Error('User data not received from server');
        }
        
        // Map backend user data to frontend format
        // Convert backend 'admin' userType to frontend 'institution' role
        // Fix: The backend sends token and user directly, not nested in data property
        const userRole = data.data.userType === 'admin' ? 'institution' : data.data.userType;
        
        const userData = {
          ...data.data,
          role: userRole, // Map userType to role for consistency
          loginTime: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Store token if provided
        // Fix: The backend sends token directly, not nested in data property
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        return { success: true, user: userData };
      } else {
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function with email verification
  const register = async (registrationData) => {
    try {
      setLoading(true);
      console.log('Starting registration process with data:', registrationData);
      
      // Clear any existing user session before registering new user
      // This fixes the "same account reused after re-registration" issue
      localStorage.removeItem('user');
      setUser(null);
      
      // Validate registration data
      const validation = validateRegistrationData(registrationData);
      if (!validation.isValid) {
        console.log('Validation failed:', validation.errors);
        throw new Error(validation.errors.join(', '));
      }
      
      // Map frontend form data to backend expected format
      let backendData = {
        firstName: registrationData.firstName?.trim(),
        lastName: registrationData.lastName?.trim(),
        email: registrationData.email?.toLowerCase().trim() || 
               (registrationData.role === USER_ROLES.ALUMNI 
                 ? registrationData.personalEmail?.toLowerCase().trim()
                 : registrationData.institutionalEmail?.toLowerCase().trim()),
        password: registrationData.password,
        // Map frontend roles to backend user types
        userType: registrationData.role === USER_ROLES.INSTITUTION ? 'admin' : registrationData.role,
        collegeName: registrationData.collegeName?.trim() || registrationData.institutionName?.trim(),
        // Add institution-specific fields
        institutionType: registrationData.institutionType?.trim(),
        establishedYear: registrationData.establishedYear,
        address: registrationData.address?.trim(),
        website: registrationData.website?.trim(),
        institutionCode: registrationData.institutionCode?.trim()
      };
      
      // Add role-specific fields
      if (registrationData.role === USER_ROLES.STUDENT) {
        backendData.rollNumber = registrationData.rollNumber?.trim(); // Already mapped in Register_new.js
        backendData.department = registrationData.department?.trim();
        backendData.currentYear = parseInt(registrationData.currentYear); // Already mapped in Register_new.js
        backendData.graduationYear = parseInt(registrationData.graduationYear); // Already mapped in Register_new.js
        backendData.phone = registrationData.phone?.trim(); // Already mapped in Register_new.js
      } else if (registrationData.role === USER_ROLES.ALUMNI) {
        backendData.rollNumber = registrationData.rollNumber?.trim();
        backendData.department = registrationData.department?.trim();
        backendData.graduationYear = parseInt(registrationData.graduationYear);
        backendData.currentPosition = registrationData.currentPosition?.trim(); // Already mapped in Register_new.js
        backendData.company = registrationData.company?.trim(); // Already mapped in Register_new.js
        backendData.location = registrationData.location?.trim(); // Already mapped in Register_new.js
        backendData.phone = registrationData.phone?.trim(); // Already mapped in Register_new.js
      } else if (registrationData.role === USER_ROLES.INSTITUTION) {
        backendData.establishedYear = parseInt(registrationData.establishedYear);
        backendData.institutionType = registrationData.institutionType?.trim();
        backendData.address = registrationData.address?.trim();
        backendData.website = registrationData.website?.trim();
        backendData.phone = registrationData.phone?.trim(); // Already mapped in Register_new.js
        backendData.institutionCode = registrationData.institutionCode?.trim();
        // Ensure collegeName is set for institutions
        if (!backendData.collegeName && registrationData.institutionName) {
          backendData.collegeName = registrationData.institutionName?.trim();
        }
      }
      
      console.log('Mapped backend data:', backendData);
      
      // Call the actual backend API for registration
      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register`;
      console.log('Making request to:', apiUrl);
      console.log('Request data:', JSON.stringify(backendData, null, 2));
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });
      
      console.log('=== RESPONSE DETAILS ===');
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      console.log('Response ok:', response.ok);
      
      // Check if this is the rate limiting error
      if (response.status === 429) {
        console.log('RATE LIMITING ERROR DETECTED');
        throw new Error('Too many registration attempts. Please try again later.');
      }
      
      // Try to get response text first to see what we're getting
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Failed to parse server response: ${responseText}`);
      }
      
      // Check if response is OK
      if (!response.ok) {
        console.error('Response not OK. Status:', response.status, 'Data:', data);
        // Log specific validation errors if they exist
        if (data.errors && Array.isArray(data.errors)) {
          console.error('Validation errors details:', data.errors);
          const errorMessages = data.errors.map(err => err.msg || err.message || JSON.stringify(err));
          throw new Error(`Validation errors: ${errorMessages.join(', ')}`);
        }
        // If there's a message but no specific errors array
        if (data.message) {
          throw new Error(data.message);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('Registration response:', data);
      
      if (data.success) {
        // Store pending registration for email verification
        setPendingRegistration(backendData);
        localStorage.setItem('pendingRegistration', JSON.stringify(backendData));
        return { success: true, message: data.message || 'Registration successful! Please check your email for verification.' };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // Verify email and complete registration (updated to support OTP)
  const verifyEmail = async (verificationCode) => {
    try {
      setLoading(true);
      
      if (!pendingRegistration) {
        throw new Error('No pending registration found');
      }
      
      // Check if the verificationCode is a 6-digit number (OTP) or a token (link)
      if (/^\d{6}$/.test(verificationCode)) {
        // It's an OTP code, use the new OTP verification endpoint
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/verify-email-code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            code: verificationCode,
            email: pendingRegistration.email || 
                  (pendingRegistration.role === USER_ROLES.ALUMNI 
                    ? pendingRegistration.personalEmail 
                    : pendingRegistration.institutionalEmail)
          }),
        });
        
        const data = await response.json();
        console.log('OTP verification response:', data);
        
        if (data.success) {
          // ✅ Auto-login after successful verification
          if (data.token && data.user) {
            // Map backend user data to frontend format
            // Convert backend 'admin' userType to frontend 'institution' role
            const userRole = data.user.userType === 'admin' ? 'institution' : data.user.userType;
            
            const frontendUser = {
              ...data.user,
              role: userRole, // Map userType to role
              loginTime: new Date().toISOString()
            };
            
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(frontendUser));
            setUser(frontendUser);
            
            // Clear pending registration
            setPendingRegistration(null);
            localStorage.removeItem('pendingRegistration');
            
            // Check if alumni is pending approval
            if (frontendUser.userType === 'alumni' && frontendUser.status === 'pending') {
              return { 
                success: true, 
                message: 'Email verified successfully! Your account is pending approval from your institution.',
                user: frontendUser,
                autoLogin: true,
                pendingApproval: true
              };
            } else {
              return { 
                success: true, 
                message: 'Email verified successfully! Redirecting to your dashboard...',
                user: frontendUser,
                autoLogin: true
              };
            }
          } else {
            // Clear pending registration
            setPendingRegistration(null);
            localStorage.removeItem('pendingRegistration');
            
            // For verified users, they'll need to log in normally
            // Alumni will be redirected to pending approval page after login
            return { 
              success: true, 
              message: 'Email verified successfully! Please log in to continue.',
              autoLogin: false
            };
          }
        } else {
          throw new Error(data.message || 'Email verification failed');
        }
      } else {
        // It's a token/link verification, use the existing endpoint
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/verify-email?token=${verificationCode}&email=${pendingRegistration.email}`);
        
        const data = await response.json();
        console.log('Email verification response:', data);
        
        if (data.success) {
          // ✅ Auto-login after successful verification
          if (data.token && data.data) {
            // Map backend user data to frontend format
            // Convert backend 'admin' userType to frontend 'institution' role
            const userRole = data.data.userType === 'admin' ? 'institution' : data.data.userType;
            
            const frontendUser = {
              ...data.data,
              role: userRole, // Map userType to role
              loginTime: new Date().toISOString()
            };
            
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(frontendUser));
            setUser(frontendUser);
            
            // Clear pending registration
            setPendingRegistration(null);
            localStorage.removeItem('pendingRegistration');
            
            // Check if alumni is pending approval
            if (frontendUser.userType === 'alumni' && frontendUser.status === 'pending') {
              return { 
                success: true, 
                message: 'Email verified successfully! Your account is pending approval from your institution.',
                user: frontendUser,
                autoLogin: true,
                pendingApproval: true
              };
            } else {
              return { 
                success: true, 
                message: 'Email verified successfully! Redirecting to your dashboard...',
                user: frontendUser,
                autoLogin: true
              };
            }
          } else {
            // Clear pending registration
            setPendingRegistration(null);
            localStorage.removeItem('pendingRegistration');
            
            // For verified users, they'll need to log in normally
            // Alumni will be redirected to pending approval page after login
            return { 
              success: true, 
              message: 'Email verified successfully! Please log in to continue.',
              autoLogin: false
            };
          }
        } else {
          throw new Error(data.message || 'Email verification failed');
        }
      }
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: error.message || 'Email verification failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('pendingRegistration');
    setPendingRegistration(null);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user is verified
  const isVerified = () => {
    return user && user.status === USER_STATUS.VERIFIED;
  };

  // Resend verification email
  const resendVerificationEmail = async () => {
    if (!pendingRegistration) {
      return { success: false, error: 'No pending registration found' };
    }
    
    // Get email from pending registration
    let emailToSend = pendingRegistration.email;
    
    // If email is not directly available, check role-specific fields
    if (!emailToSend) {
      if (pendingRegistration.role === USER_ROLES.ALUMNI) {
        emailToSend = pendingRegistration.personalEmail;
      } else {
        emailToSend = pendingRegistration.institutionalEmail;
      }
    }
    
    // If still no email, try to get from the user object
    if (!emailToSend && user && user.email) {
      emailToSend = user.email;
    }
    
    if (!emailToSend) {
      return { success: false, error: 'No email address found for verification' };
    }
    
    try {
      // Call the actual backend API to resend verification email
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: emailToSend
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return { success: true, message: 'Verification email resent successfully! Please check your inbox.' };
      } else {
        throw new Error(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    registrationStep,
    pendingRegistration,
    login,
    register,
    verifyEmail,
    logout,
    hasRole,
    isVerified,
    resendVerificationEmail,
    setRegistrationStep
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper functions (mock implementations)
// These functions are no longer used as we're using actual API calls in login, register, and verifyEmail functions
// Keeping them for reference but they're not called in the current implementation
async function validateLogin(credentials) {
  // This function is no longer used - we're using actual API calls
  console.log('validateLogin is deprecated - using actual API');
  throw new Error('validateLogin is deprecated');
}

// Auto-detect user role based on email patterns
function autoDetectUserRole(email) {
  const emailLower = email.toLowerCase();
  
  // Educational institution domains (students/institutions)
  const eduDomains = ['.edu', '.ac.in', '.edu.in', '.ernet.in'];
  const isEduDomain = eduDomains.some(domain => emailLower.includes(domain));
  
  if (isEduDomain) {
    // Check for admin/institution patterns
    const institutionPatterns = ['admin', 'office', 'principal', 'dean', 'registrar', 'admission'];
    const isInstitution = institutionPatterns.some(pattern => emailLower.includes(pattern));
    
    if (isInstitution) {
      return USER_ROLES.INSTITUTION;
    } else {
      return USER_ROLES.STUDENT;
    }
  } else {
    // Personal email domains suggest alumni
    const personalDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const isPersonalDomain = personalDomains.some(domain => emailLower.includes(domain));
    
    if (isPersonalDomain) {
      return USER_ROLES.ALUMNI;
    }
  }
  
  return null; // Could not auto-detect
}

function validateRegistrationData(data) {
  const errors = [];
  
  // Common validations
  if (!data.password || data.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!data.role || !Object.values(USER_ROLES).includes(data.role)) {
    errors.push('Valid role is required');
  }
  
  // Email validation - check the email field (which is mapped correctly in handleSubmit)
  if (!data.email) {
    if (data.role === USER_ROLES.STUDENT) {
      errors.push('Institutional email is required for students');
    } else if (data.role === USER_ROLES.ALUMNI) {
      errors.push('Personal email is required for alumni');
    } else if (data.role === USER_ROLES.INSTITUTION) {
      errors.push('Institutional email is required');
    }
  } else {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Please enter a valid email address');
    }
  }
  
  // Role-specific validations
  if (data.role === USER_ROLES.STUDENT) {
    if (!data.department) errors.push('Department is required for students');
    if (!data.currentYear) errors.push('Year of admission is required for students');
    if (!data.collegeName) errors.push('College name is required for students');
    // For students, check rollNumber (which was mapped from registerNumber in handleSubmit)
    if (!data.rollNumber) errors.push('Register number is required for students');
  }
  
  if (data.role === USER_ROLES.ALUMNI) {
    if (!data.graduationYear) errors.push('Graduation year is required for alumni');
    if (!data.department) errors.push('Department is required for alumni');
    if (!data.rollNumber) errors.push('Roll number is required for alumni');
    if (!data.phone) errors.push('Mobile number is required for alumni');
  }
  
  if (data.role === USER_ROLES.INSTITUTION) {
    if (!data.collegeName) errors.push('Institution name is required');
    if (!data.institutionType) errors.push('Institution type is required');
    if (!data.establishedYear) errors.push('Established year is required');
    if (!data.address) errors.push('Address is required for institutions');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

async function sendVerificationEmail(email) {
  // Mock email sending - replace with actual email service
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Verification email sent to ${email}`);
      resolve(true);
    }, 1000);
  });
}

async function sendApprovalNotificationToInstitution(userData) {
  // Mock function to send approval notification to institution
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Approval notification sent to institution for alumni: ${userData.firstName} ${userData.lastName}`);
      console.log(`Institution: ${userData.institutionName}`);
      console.log(`User Data:`, {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        graduationYear: userData.graduationYear,
        department: userData.department,
        rollNumber: userData.rollNumber,
        proofDocument: userData.proofDocument ? 'Uploaded' : 'Not provided'
      });
      
      // In a real application, you would:
      // 1. Find the institution admin email based on institutionName
      // 2. Send email with alumni details and approval link
      // 3. Store the approval request in database
      
      resolve(true);
    }, 1000);
  });
}

async function validateVerificationCode(email, code) {
  // Mock code validation - replace with actual verification
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo, accept '123456' as valid code
      resolve(code === '123456');
    }, 1000);
  });
}

async function saveUserToDatabase(user) {
  // Mock database save - replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('User saved to database:', user);
      resolve(true);
    }, 1000);
  });
}

function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}