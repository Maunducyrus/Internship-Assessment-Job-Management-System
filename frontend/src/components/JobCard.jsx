import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  BuildingOfficeIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { jobsAPI } from '../services/api';

const JobCard = ({ job, onJobUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSoftDelete = async () => {
    if (!window.confirm('Are you sure you want to deactivate this job?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await jobsAPI.deactivateJob(job.id);
      onJobUpdate(); // Refresh the job list
    } catch (error) {
      console.error('Error deactivating job:', error);
      alert('Failed to deactivate job. Please try again.');
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
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
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
          
          {/* Status Badge */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            job.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {job.status}
          </span>
        </div>

        {/* Job Details */}
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

        {/* Description Preview */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {job.description.length > 150 
            ? `${job.description.substring(0, 150)}...` 
            : job.description
          }
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Posted {formatDate(job.created_at)}
          </span>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Link
              to={`/jobs/${job.id}`}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors duration-200"
            >
              <EyeIcon className="h-3 w-3 mr-1" />
              View
            </Link>
            
            <Link
              to={`/jobs/${job.id}/edit`}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              <PencilIcon className="h-3 w-3 mr-1" />
              Edit
            </Link>
            
            <button
              onClick={handleSoftDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrashIcon className="h-3 w-3 mr-1" />
              {isDeleting ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;