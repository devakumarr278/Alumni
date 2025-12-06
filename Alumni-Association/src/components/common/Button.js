import React from 'react';
import { motion } from 'framer-motion';

const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className = '',
      as: Component = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200';

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3 text-lg',
    };

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
      outline:
        'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50',
      secondary: 'bg-gray-800 text-white hover:bg-gray-700 shadow-sm',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    };

    return (
      <motion.div whileTap={{ scale: 0.95 }}>
        <Component
          ref={ref}
          className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
          {...props}
        >
          {children}
        </Component>
      </motion.div>
    );
  }
);

Button.displayName = 'Button';

export default Button;