import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth, USER_ROLES } from '../context/AuthContext';
import Button from '../components/common/Button';

const Login = () => {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const loginType = searchParams.get('type'); // Get login type from URL params
  
  // Get success message and role from registration
  const locationState = location.state;
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: locationState?.role || '' // Pre-select role if provided from registration
  });
  
  const [loginState, setLoginState] = useState({
    loading: false,
    error: locationState?.message || '', // Show success message from registration
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);

  // Clear location state after using it
  useEffect(() => {
    if (locationState) {
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [locationState]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      redirectToRoleDashboard(user);
    }
  }, [user, loading, navigate]);

  // Handle account lockout
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsLocked(true);
      const lockoutEnd = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      setLockoutTime(lockoutEnd);
      
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
        setLockoutTime(null);
      }, 15 * 60 * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  const redirectToRoleDashboard = (user) => {
    console.log('Redirecting user:', user);
    
    // Get user role from either role or userType property
    // Convert backend 'admin' userType to frontend 'institution' role
    let userRole = user.role || user.userType;
    if (userRole === 'admin') {
      userRole = 'institution';
    }
    
    // Check if alumni is pending approval
    if (userRole === 'alumni' && user.status === 'pending') {
      console.log('Alumni pending approval, redirecting to pending page');
      navigate('/pending-approval', { replace: true });
      return;
    }
    
    // Normal role-based redirection for approved users
    switch (userRole) {
      case 'student':
        console.log('Navigating to student dashboard');
        navigate('/studentpart/dashboard', { replace: true });
        break;
      case 'alumni':
        console.log('Navigating to alumni dashboard');
        // Use the new route structure
        navigate('/alumni/dashboard', { replace: true });
        break;
      case 'institution':
        console.log('Navigating to institution dashboard');
        // Use the new route structure
        navigate('/institution/dashboard', { replace: true });
        break;
      default:
        console.log('Unknown role, navigating to home');
        navigate('/', { replace: true });
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setLoginState(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when user starts typing
      if (loginState.error) {
        setLoginState(prev => ({ ...prev, error: '' }));
      }
    }
  }, [loginState.error]);

  const validateForm = () => {
    if (!formData.email.trim()) {
      setLoginState(prev => ({ ...prev, error: 'Email is required' }));
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLoginState(prev => ({ ...prev, error: 'Please enter a valid email address' }));
      return false;
    }
    
    if (!formData.password.trim()) {
      setLoginState(prev => ({ ...prev, error: 'Password is required' }));
      return false;
    }
    
    return true;
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setLoginState(prev => ({ 
        ...prev, 
        error: `Account locked. Try again after ${lockoutTime.toLocaleTimeString()}` 
      }));
      return;
    }
    
    if (!validateForm()) return;
    
    setLoginState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      if (result.success) {
        console.log('Login successful, user:', result.user);
        
        // Reset login attempts on successful login
        setLoginAttempts(0);
        
        // Handle remember me
        if (loginState.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userEmail', formData.email);
        }
        
        // Small delay to ensure state is properly updated
        setTimeout(() => {
          // Redirect based on user data (not just role)
          redirectToRoleDashboard(result.user);
        }, 150);
      } else {
        // Increment failed login attempts
        setLoginAttempts(prev => prev + 1);
        setLoginState(prev => ({ 
          ...prev, 
          error: result.error || 'Invalid credentials',
          loading: false 
        }));
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginAttempts(prev => prev + 1);
      setLoginState(prev => ({ 
        ...prev, 
        error: 'Login failed. Please try again.',
        loading: false 
      }));
    }
  }, [formData, loginState.rememberMe, login, isLocked, lockoutTime]);

  const getRemainingLockoutTime = () => {
    if (!lockoutTime) return '';
    const remaining = Math.ceil((lockoutTime - new Date()) / 1000 / 60);
    return `${remaining} minutes`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {loginType === 'student' ? '🎓 Student Login' : 
             loginType === 'alumni' ? '👥 Alumni Login' : 
             'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {loginType === 'student' ? 'Access your student portal for events and opportunities' :
             loginType === 'alumni' ? 'Welcome back! Access your alumni network' :
             'Or'}{' '}
            {(!loginType) && (
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                create a new account
              </Link>
            )}
          </p>
        </div>
        
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Your Role
              </label>
              <div className="flex justify-between gap-3">
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
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div 
                        className="transition-all duration-300 text-center flex flex-col items-center gap-2 relative transform"
                        style={{
                          background: isSelected 
                            ? 'linear-gradient(120deg, #e7f7fc 0%, #c8e2ff 100%)'
                            : 'linear-gradient(110deg, #f1f9fd 0%, #eef1fb 100%)',
                          borderRadius: '12px',
                          boxShadow: isSelected
                            ? '0 12px 24px 0 rgba(36, 101, 232, .15)'
                            : '0 2px 12px rgba(60,90,180,.08)',
                          padding: '20px 8px 16px',
                          border: isSelected 
                            ? '2px solid #2465e8'
                            : '2px solid #e3eafe',
                          transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                        }}
                      >
                        <span 
                          className="text-2xl mb-1"
                          style={{
                            filter: isSelected 
                              ? 'drop-shadow(0 3px 4px #aac4ee)'
                              : 'drop-shadow(0 1px 2px #ccd8ee)'
                          }}
                        >
                          {role.icon}
                        </span>
                        <span 
                          className="font-semibold text-sm block"
                          style={{
                            color: isSelected ? '#2465e8' : '#243368'
                          }}
                        >
                          {role.label}
                        </span>
                        <span 
                          className="text-xs font-normal"
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
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLocked}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                  isLocked ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLocked}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                    isLocked ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLocked}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {loginState.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm text-center bg-red-50 p-3 rounded"
            >
              {loginState.error}
              {loginAttempts > 0 && !isLocked && (
                <div className="text-xs mt-1">
                  Attempts: {loginAttempts}/5
                </div>
              )}
            </motion.div>
          )}

          {/* Lockout Warning */}
          {isLocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-orange-600 text-sm text-center bg-orange-50 p-3 rounded border border-orange-200"
            >
              🔒 Account temporarily locked due to multiple failed attempts.<br />
              <strong>Time remaining: {getRemainingLockoutTime()}</strong>
            </motion.div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={loginState.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loginState.loading || isLocked}
          >
            {loginState.loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : isLocked ? (
              `Locked (${getRemainingLockoutTime()} remaining)`
            ) : (
              'Sign in'
            )}
          </Button>
        </motion.form>
        

      </motion.div>
    </div>
  );
};

export default Login;