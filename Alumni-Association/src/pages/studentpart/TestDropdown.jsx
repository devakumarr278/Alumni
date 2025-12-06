import React, { useState, useRef, useEffect } from 'react';

const TestDropdown = () => {
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dropdown Test</h2>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Toggle Dropdown
        </button>
        
        {isOpen && (
          <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
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
    </div>
  );
};

export default TestDropdown;