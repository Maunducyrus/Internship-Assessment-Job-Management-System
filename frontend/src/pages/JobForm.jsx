import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { jobsAPI } from '../services/api';

const JobForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_name: '',
    location: '',
    salary: '',
    status: 'active'
  });

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      fetchJob();
    }
  }, [id, isEditing]);

  const fetchJob = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await jobsAPI.getJob(id);
      const job = response.data.data;
      setFormData({
        title: job.title,
        description: job.description,
        company_name: job.company_name,
        location: job.location,
        salary: job.salary.toString(),
        status: job.status
      });
    } catch (err) {
      setError('Failed to fetch job details. Please try again.');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Job title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Job description is required';
    }
    
    if (!formData.company_name.trim()) {
      errors.company_name = 'Company name is required';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!formData.salary || isNaN(formData.salary) || parseInt(formData.salary) <= 0) {
      errors.salary = 'Please enter a valid salary amount';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const jobData = {
        ...formData,
        salary: parseInt(formData.salary)
      };

      if (isEditing) {
        await jobsAPI.updateJob(id, jobData);
        setSuccess('Job updated successfully!');
        setTimeout(() => {
          navigate(`/jobs/${id}`);
        }, 1500);
      } else {
        const response = await jobsAPI.createJob(jobData);
        setSuccess('Job created successfully!');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      } else {
        setError(isEditing ? 'Failed to update job. Please try again.' : 'Failed to create job. Please try again.');
      }
      console.error('Error submitting job:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading job details..." />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to={isEditing ? `/jobs/${id}` : '/'}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </div>

      {/* Form Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Job' : 'Post a New Job'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isEditing 
            ? 'Update the job details below.' 
            : 'Fill out the form below to create a new job listing.'
          }
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {success && (
        <Alert
          type="success"
          title="Success"
          message={success}
          className="mb-6"
        />
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Senior Software Engineer"
              className={`input-field ${validationErrors.title ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              placeholder="e.g., Google Inc."
              className={`input-field ${validationErrors.company_name ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {validationErrors.company_name && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.company_name}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., New York, NY or Remote"
              className={`input-field ${validationErrors.location ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {validationErrors.location && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
            )}
          </div>

          {/* Salary */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
              Annual Salary (USD) *
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="e.g., 75000"
              min="1"
              className={`input-field ${validationErrors.salary ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {validationErrors.salary && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.salary}</p>
            )}
          </div>

          {/* Status (only show when editing) */}
          {isEditing && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}

          {/* Job Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={8}
              placeholder="Provide a detailed description of the job role, responsibilities, requirements, and benefits..."
              className={`input-field resize-none ${validationErrors.description ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              to={isEditing ? `/jobs/${id}` : '/'}
              className="btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLoading 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Job' : 'Create Job')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;