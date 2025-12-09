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
      'inline-flex items-center justify-center font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 relative overflow-hidden';

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const variantClasses = {
      primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl',
      outline:
        'bg-transparent border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm',
      secondary: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black shadow-lg hover:shadow-xl',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl',
    };

    // Add ripple effect for primary buttons
    const handleClick = (e) => {
      if (props.onClick) {
        props.onClick(e);
      }
      
      if (variant === 'primary' || variant === 'secondary') {
        const button = e.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add("ripple");
        
        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) {
          ripple.remove();
        }
        
        button.appendChild(circle);
      }
    };

    return (
      <motion.div 
        whileTap={{ scale: 0.95 }}
        whileHover={{ y: -2 }}
      >
        <Component
          ref={ref}
          className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} relative`}
          {...props}
          onClick={handleClick}
        >
          {/* Ripple effect for primary buttons */}
          {(variant === 'primary' || variant === 'secondary') && (
            <style jsx>{`
              .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
              }
              
              @keyframes ripple {
                to {
                  transform: scale(4);
                  opacity: 0;
                }
              }
            `}</style>
          )}
          
          {/* Shine effect for gradient buttons */}
          {(variant === 'primary' || variant === 'secondary') && (
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </span>
          )}
          
          <span className="relative z-10">{children}</span>
        </Component>
      </motion.div>
    );
  }
);

Button.displayName = 'Button';

export default Button;