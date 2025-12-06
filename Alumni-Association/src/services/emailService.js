// Real email services connecting to backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const emailService = {
  // Send verification email (handled by backend during registration)
  sendVerificationEmail: async (email, userType) => {
    try {
      // This is now handled by the registration endpoint
      console.log(`Verification email will be sent to ${email} during registration`);
      return { success: true, message: 'Verification email will be sent during registration' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Resend verification email
  resendVerificationEmail: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification email');
      }
      
      return data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Verify email code (handled by backend with tokens)
  verifyEmailCode: async (token, email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email?token=${token}&email=${email}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Email verification failed');
      }
      
      return data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Validate email domain for institutional emails
  validateInstitutionalEmail: (email, allowedDomains = ['.edu', '.ac.in', '.edu.in']) => {
    if (!email) return false;
    return allowedDomains.some(domain => email.toLowerCase().includes(domain));
  },
  
  // Send admin approval notification (handled by backend)
  sendAdminApprovalNotification: async (adminEmail, userDetails) => {
    try {
      // This is handled automatically by the backend during registration
      console.log(`Admin approval notification will be sent to ${adminEmail}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Send contact form
  submitContactForm: async (contactData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit contact form');
      }
      
      return data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Send forgot password email
  sendForgotPasswordEmail: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send password reset email');
      }
      
      return data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Reset password with token
  resetPassword: async (token, email, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email, newPassword }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      
      return data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default emailService;