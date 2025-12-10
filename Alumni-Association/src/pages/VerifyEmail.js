import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      // Get token and email from URL query parameters
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const email = params.get('email');

      if (!token || !email) {
        setError('Invalid verification link. Token and email are required.');
        setLoading(false);
        return;
      }

      try {
        // Call backend API to verify email
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5003/api'}/auth/verify-email?token=${token}&email=${email}`);
        const data = await res.json();

        if (data.success) {
          // ✅ Auto-login after successful verification
          if (data.token && data.data) {
            // Convert backend 'admin' userType to frontend 'institution' role
            const userRole = data.data.userType === 'admin' ? 'institution' : data.data.userType;
            
            // Create frontend user object with correct role mapping
            const frontendUser = {
              ...data.data,
              role: userRole
            };
            
            // Save token and user data locally for login persistence
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(frontendUser));
            
            // Set user in context
            setUser(frontendUser);
            
            setSuccess(true);
            
            // Redirect based on user type after a short delay
            setTimeout(() => {
              if (data.data.userType === 'alumni') {
                // Check if alumni is pending approval
                if (data.data.status === 'pending') {
                  navigate('/pending-approval');
                } else {
                  navigate('/alumni-dashboard');
                }
              } else if (data.data.userType === 'student') {
                navigate('/studentpart/dashboard');
              } else if (data.data.userType === 'admin') {
                navigate('/institution-dashboard');
              } else {
                navigate('/'); // Default fallback
              }
            }, 2000);
          } else {
            setError('Verification successful but login failed. Please log in manually.');
          }
        } else {
          setError(data.message || 'Email verification failed.');
        }
      } catch (err) {
        console.error('Error verifying email:', err);
        setError('Something went wrong during verification. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [location, navigate, setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">Verifying your email...</h2>
              <p className="mt-2 text-gray-600">Please wait while we verify your account.</p>
            </>
          ) : error ? (
            <>
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-red-600">❌</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">Verification Failed</h2>
              <p className="mt-2 text-gray-600">{error}</p>
              <button
                onClick={() => navigate('/login')}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Go to Login
              </button>
            </>
          ) : success ? (
            <>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-green-600">✅</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">Email Verified Successfully!</h2>
              <p className="mt-2 text-gray-600">Redirecting you to your dashboard...</p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;