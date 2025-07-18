import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchAndFilter = ({ onFilterChange, totalJobs, filters }) => {
  const [localFilters, setLocalFilters] = useState({
    search: '',
    location: '',
    company: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Initialize local filters from props
  useEffect(() => {
    if (filters) {
      setLocalFilters(filters);
    }
  }, [filters]);

  // Debounce filter changes
  useEffect(() => {
    // Don't trigger on initial mount if all filters are empty
    if (!localFilters.search && !localFilters.location && !localFilters.company) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      console.log('Applying filters:', localFilters); // Debug log
      onFilterChange(localFilters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localFilters, onFilterChange]);

  const handleInputChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      location: '',
      company: '',
    };
    setLocalFilters(clearedFilters);
  };

  const hasActiveFilters = localFilters.search || localFilters.location || localFilters.company;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs by title, company, or description..."
            value={localFilters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
            showFilters || hasActiveFilters
              ? 'bg-primary-50 border-primary-200 text-primary-700'
              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <FunnelIcon className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {Object.values(localFilters).filter(val => val && val.trim()).length}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., New York, Remote"
                value={localFilters.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                placeholder="e.g., Google, Microsoft"
                value={localFilters.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Clear all filters</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-600">
        {totalJobs !== null && totalJobs !== undefined && (
          <span>
            {totalJobs} job{totalJobs !== 1 ? 's' : ''} found
            {hasActiveFilters && ' with current filters'}
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;