import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BriefcaseIcon, PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BriefcaseIcon },
    { name: 'All Jobs', href: '/jobs', icon: BriefcaseIcon },
    { name: 'Post Job', href: '/create', icon: PlusIcon },
    { name: 'Statistics', href: '/stats', icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <BriefcaseIcon className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">JobBoard</span>
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center space-x-4 sm:space-x-6 md:space-x-8 mt-2 sm:mt-0">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;