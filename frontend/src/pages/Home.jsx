import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  PlusIcon, 
  ChartBarIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import { jobsAPI } from '../services/api';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      // Fetch stats and recent jobs
      const [statsResponse, jobsResponse] = await Promise.all([
        jobsAPI.getStats(),
        jobsAPI.getJobs({ page: 1 })
      ]);
      
      setStats(statsResponse.data.data);
      
      // Handle both paginated and non-paginated responses
      const jobsData = jobsResponse.data;
      const allJobs = Array.isArray(jobsData) ? jobsData : (jobsData.results || []);
      setRecentJobs(allJobs.slice(0, 3));
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <BriefcaseIcon className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to JobBoard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your complete job management solution. Post jobs, manage applications, and find the perfect candidates.
          </p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="btn-primary flex items-center justify-center space-x-2 text-lg px-8 py-3"
            >
              <BriefcaseIcon className="h-5 w-5" />
              <span>View All Jobs</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            
            <Link
              to="/create"
              className="btn-secondary flex items-center justify-center space-x-2 text-lg px-8 py-3"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Post New Job</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50">
                <BriefcaseIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total_jobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-green-50">
                <BriefcaseIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-green-900">{stats.active_jobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-red-50">
                <BriefcaseIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Jobs</p>
                <p className="text-2xl font-bold text-red-900">{stats.inactive_jobs}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Jobs Preview */}
      {recentJobs.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Job Postings</h2>
            <Link
              to="/jobs"
              className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
            >
              <span>View all jobs</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{job.company_name}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {job.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{formatSalary(job.salary)}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {job.description.length > 100 
                    ? `${job.description.substring(0, 100)}...` 
                    : job.description
                  }
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/jobs"
            className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200 border border-gray-200"
          >
            <BriefcaseIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Jobs</h3>
            <p className="text-gray-600 text-sm">View, edit, and manage all your job listings</p>
          </Link>
          
          <Link
            to="/create"
            className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200 border border-gray-200"
          >
            <PlusIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Post New Job</h3>
            <p className="text-gray-600 text-sm">Create a new job listing to attract candidates</p>
          </Link>
          
          <Link
            to="/stats"
            className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200 border border-gray-200"
          >
            <ChartBarIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Statistics</h3>
            <p className="text-gray-600 text-sm">Track your job posting performance and metrics</p>
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      {stats && stats.total_jobs === 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-primary-900 mb-4">Get Started</h2>
          <p className="text-primary-700 mb-6">
            You haven't posted any jobs yet. Start by creating your first job listing!
          </p>
          <Link
            to="/create"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Post Your First Job</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;