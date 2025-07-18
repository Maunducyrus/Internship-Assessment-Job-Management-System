import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  BuildingOfficeIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { jobsAPI } from '../services/api';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await jobsAPI.getJob(id);
      setJob(response.data.data);
    } catch (err) {
      setError('Failed to fetch job details. Please try again.');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!window.confirm('Are you sure you want to deactivate this job?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await jobsAPI.deactivateJob(job.id);
      navigate('/', { 
        state: { 
          message: 'Job deactivated successfully',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error deactivating job:', error);
      setError('Failed to deactivate job. Please try again.');
    } finally {
      setIsDeleting(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading job details..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert
          type="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Jobs</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
        <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 btn-primary"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to Jobs</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to Jobs</span>
        </Link>
      </div>

      {/* Job Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {job.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                <span className="text-lg">{job.company_name}</span>
              </div>
            </div>
            
            {/* Status Badge */}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              job.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {job.status}
            </span>
          </div>

          {/* Job Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600">
              <CurrencyDollarIcon className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-medium text-green-600">{formatSalary(job.salary)}</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Posted</p>
                <p className="font-medium">{formatDate(job.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-8">
            <Link
              to={`/jobs/${job.id}/edit`}
              className="btn-primary flex items-center space-x-2"
            >
              <PencilIcon className="h-4 w-4" />
              <span>Edit Job</span>
            </Link>
            
            <button
              onClick={handleSoftDelete}
              disabled={isDeleting}
              className="btn-danger flex items-center space-x-2 disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4" />
              <span>{isDeleting ? 'Deactivating...' : 'Deactivate Job'}</span>
            </button>
          </div>

          {/* Job Description */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Job Description
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          </div>

          {/* Job Timestamps */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Created:</span> {formatDate(job.created_at)}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {formatDate(job.updated_at)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;