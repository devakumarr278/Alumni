import React, { useState, useRef, useEffect } from 'react';

const SimpleTest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Dropdown Test</h1>
      
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle Dropdown
        </button>
        
        {isOpen && (
          <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
              Option 1
            </div>
            <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
              Option 2
            </div>
            <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
              Option 3
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-white rounded shadow">
        <p>Dropdown State: {isOpen ? 'OPEN' : 'CLOSED'}</p>
        <button 
          onClick={() => setIsOpen(true)}
          className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm mr-2"
        >
          Force Open
        </button>
        <button 
          onClick={() => setIsOpen(false)}
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Force Close
        </button>
      </div>
    </div>
  );
};

export default SimpleTest;