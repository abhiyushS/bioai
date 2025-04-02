import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Database, Search, Info, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Header: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await api.healthCheck();
        setApiStatus(response.status);
      } catch (error) {
        console.error('Health check failed:', error);
        setApiStatus('offline');
      }
    };

    // Initial check
    checkApiStatus();

    // Set up periodic health checks
    const interval = setInterval(checkApiStatus, 10000); // Check every 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Database className="h-8 w-8" />
            <span className="text-xl font-bold">BioTarget AI</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {apiStatus !== 'loading' && (
              <div className="flex items-center mr-4">
                <div className={`h-2 w-2 rounded-full mr-2 ${
                  apiStatus === 'online' ? 'bg-green-400' : 'bg-red-500'
                }`}></div>
                <span className="text-xs text-gray-200">
                  API {apiStatus === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            )}
            
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="flex items-center hover:text-indigo-200 transition-colors">
                    <Search className="h-5 w-5 mr-1" />
                    <span>Search</span>
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="flex items-center hover:text-indigo-200 transition-colors">
                    <Info className="h-5 w-5 mr-1" />
                    <span>About</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      
      {apiStatus === 'offline' && (
        <div className="bg-red-600 text-white py-1 px-4 text-sm flex items-center justify-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>API server is offline. Please start the server with <code className="bg-red-700 px-1 rounded">npm run server</code></span>
        </div>
      )}
    </header>
  );
};

export default Header;