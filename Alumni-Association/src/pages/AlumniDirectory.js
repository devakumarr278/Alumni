import React, { useState } from 'react';
import SearchBar from '../components/ui/SearchBar';
import RealAlumniFilter from '../components/sections/RealAlumniFilter';
import RealAlumniGrid from '../components/sections/RealAlumniGrid';

const AlumniDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    graduationYear: '',
    department: '',
    location: '',
    company: '',
    search: ''
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Alumni Directory</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with fellow alumni from our network. Search by name, profession, college, or use advanced filters.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <RealAlumniFilter onFilter={setFilters} />
          </div>
          <div className="lg:w-2/3">
            <div className="mb-6">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <RealAlumniGrid 
              searchQuery={searchQuery} 
              filters={filters} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDirectory;