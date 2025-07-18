import { useState, useEffect } from 'react';
import { 
  BriefcaseIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { jobsAPI } from '../services/api';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await jobsAPI.getStats();
      setStats(response.data.data);
    } catch (err) {
      setError('Failed to fetch statistics. Please try again.');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading statistics..." />;
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
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats?.total_jobs || 0,
      icon: BriefcaseIcon,
      color: 'blue',
      description: 'All jobs in the system'
    },
    {
      title: 'Active Jobs',
      value: stats?.active_jobs || 0,
      icon: CheckCircleIcon,
      color: 'green',
      description: 'Currently available positions'
    },
    {
      title: 'Inactive Jobs',
      value: stats?.inactive_jobs || 0,
      icon: XCircleIcon,
      color: 'red',
      description: 'Deactivated or closed positions'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        text: 'text-blue-900'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        text: 'text-green-900'
      },
      red: {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        text: 'text-red-900'
      }
    };
    return colors[color];
  };

  const activePercentage = stats?.total_jobs > 0 
    ? Math.round((stats.active_jobs / stats.total_jobs) * 100) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <ChartBarIcon className="h-12 w-12 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Job Statistics
        </h1>
        <p className="text-lg text-gray-600">
          Overview of job listings in the system
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          
          return (
            <div key={stat.title} className="card">
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${colors.bg}`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${colors.text}`}>
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Overview */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Job Activity Overview
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Active Jobs</span>
                  <span className="font-medium">{activePercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${activePercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Inactive Jobs</span>
                  <span className="font-medium">{100 - activePercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${100 - activePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={fetchStats}
                className="w-full btn-secondary text-left"
              >
                <div className="flex items-center justify-between">
                  <span>Refresh Statistics</span>
                  <ChartBarIcon className="h-4 w-4" />
                </div>
              </button>
              
              <a
                href="/"
                className="block w-full btn-primary text-center"
              >
                View All Jobs
              </a>
              
              <a
                href="/create"
                className="block w-full btn-secondary text-center"
              >
                Post New Job
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {stats && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 border border-primary-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              System Summary
            </h3>
            <p className="text-primary-700">
              {stats.total_jobs === 0 
                ? "No jobs have been posted yet. Start by creating your first job listing!"
                : `You have ${stats.active_jobs} active job${stats.active_jobs !== 1 ? 's' : ''} 
                   out of ${stats.total_jobs} total job${stats.total_jobs !== 1 ? 's' : ''} in the system.`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;