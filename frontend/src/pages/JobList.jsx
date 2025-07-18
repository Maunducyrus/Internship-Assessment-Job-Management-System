import { useState, useEffect, useCallback } from 'react';
import JobCard from '../components/JobCard';
import SearchAndFilter from '../components/SearchAndFilter';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { jobsAPI } from '../services/api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    company: ''
  });

  const fetchJobs = useCallback(async (page = 1, filterParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        ...filterParams
      };
      
      // Remove empty filter values
      Object.keys(params).forEach(key => {
        if (!params[key] || params[key].toString().trim() === '') {
          delete params[key];
        }
      });
      
      console.log('API Request params:', params); // Debug log
      
      const response = await jobsAPI.getJobs(params);
      console.log('API Response:', response.data); // Debug log
      const data = response.data;
      
      // Handle both paginated and non-paginated responses
      if (Array.isArray(data)) {
        // Direct array response (non-paginated)
        setJobs(data);
        setTotalPages(1);
        setTotalJobs(data.length);
      } else {
        // Paginated response
        setJobs(data.results || []);
        setTotalPages(Math.ceil(data.count / 20));
        setTotalJobs(data.count || 0);
      }
      setCurrentPage(page);
    } catch (err) {
      console.error('API Error:', err); // Debug log
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchJobs(1, filters);
  }, []); // Only run on mount

  // Handle filter changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchJobs(1, filters);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters, fetchJobs]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    fetchJobs(page, filters);
  }, [filters, fetchJobs]);

  const handleJobUpdate = useCallback(() => {
    fetchJobs(currentPage, filters);
  }, [currentPage, filters, fetchJobs]);

  if (loading && jobs.length === 0) {
    return <LoadingSpinner size="large" text="Loading jobs..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Job Listings
        </h1>
        <p className="text-lg text-gray-600">
          {totalJobs > 0 ? `${totalJobs} job${totalJobs !== 1 ? 's' : ''} available` : 'Manage your job listings'}
        </p>
        
        {/* Quick Actions */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="btn-secondary flex items-center space-x-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>{showSearch ? 'Hide Search' : 'Search Jobs'}</span>
          </button>
          
          <a href="/create" className="btn-primary flex items-center space-x-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Post New Job</span>
          </a>
        </div>
      </div>

      {/* Search and Filters */}
      {showSearch && (
        <SearchAndFilter 
          onFilterChange={handleFilterChange}
          totalJobs={totalJobs}
          filters={filters}
        />
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* Jobs Grid */}
      {jobs.length > 0 ? (
        <>
          {/* Results Summary */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {Object.values(filters).some(val => val && val.trim()) 
                ? `Search Results (${jobs.length})` 
                : `All Jobs (${totalJobs})`
              }
            </h2>
            
            {Object.values(filters).some(val => val && val.trim()) && (
              <button
                onClick={() => {
                  setFilters({ search: '', location: '', company: '' });
                  setShowSearch(false);
                }}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear filters & show all jobs
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onJobUpdate={handleJobUpdate}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : !loading ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            {Object.values(filters).some(val => val && val.trim()) 
              ? 'Try adjusting your search criteria or filters.'
              : 'There are no active job listings at the moment.'
            }
          </p>
          <a href="/create" className="btn-primary">
            Post Your First Job
          </a>
        </div>
      ) : null}

      {/* Loading overlay for pagination */}
      {loading && jobs.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <LoadingSpinner size="medium" text="Loading..." />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;