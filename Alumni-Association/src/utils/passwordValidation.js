// Password validation utilities
export const passwordValidation = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 12,
  
  validatePassword: (password) => {
    const errors = [];
    let score = 0;
    
    if (!password) {
      return { isValid: false, errors: ['Password is required'], strength: 'weak' };
    }
    
    // Length check (8-12 characters)
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else if (password.length > 12) {
      errors.push('Password must not exceed 12 characters');
    } else {
      score += 1;
    }
    
    // Required character checks
    if (!/[a-z]/.test(password)) {
      errors.push('Must contain at least one lowercase letter (a-z)');
    } else score += 1;
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Must contain at least one uppercase letter (A-Z)');
    } else score += 1;
    
    if (!/\d/.test(password)) {
      errors.push('Must contain at least one digit (0-9)');
    } else score += 1;
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Must contain at least one special character (!@#$%^&*)');
    } else score += 1;
    
    // Check for common weak patterns
    const weakPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /(.)\\1{2,}/ // Repeated characters like 'aaa' or '111'
    ];
    
    weakPatterns.forEach(pattern => {
      if (pattern.test(password)) {
        errors.push('Avoid common patterns like "123456", "password", or repeated characters');
        score -= 1;
      }
    });
    
    // Determine strength
    let strength = 'weak';
    if (score >= 5) strength = 'strong';
    else if (score >= 3) strength = 'medium';
    
    return {
      isValid: errors.length === 0,
      errors: [...new Set(errors)], // Remove duplicates
      strength,
      score: Math.max(0, score)
    };
  },
  
  getStrengthColor: (strength) => {
    const colors = {
      weak: 'text-red-500',
      medium: 'text-yellow-500', 
      strong: 'text-green-500'
    };
    return colors[strength] || 'text-gray-500';
  },
  
  getStrengthBgColor: (strength) => {
    const colors = {
      weak: 'bg-red-500',
      medium: 'bg-yellow-500', 
      strong: 'bg-green-500'
    };
    return colors[strength] || 'bg-gray-300';
  },
  
  getStrengthPercentage: (strength) => {
    const percentages = {
      weak: 33,
      medium: 66,
      strong: 100
    };
    return percentages[strength] || 0;
  }
};

export default passwordValidation;