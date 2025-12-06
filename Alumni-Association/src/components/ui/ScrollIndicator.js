import React from 'react';

const ScrollIndicator = () => {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="animate-bounce w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
        <div className="w-1 h-3 bg-white rounded-full" />
      </div>
    </div>
  );
};

export default ScrollIndicator;