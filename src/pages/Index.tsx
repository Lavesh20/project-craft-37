
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is already logged in, redirect to dashboard
        navigate('/dashboard');
      } else {
        // If user is not logged in, redirect to login page
        navigate('/auth/login');
      }
    }
  }, [user, loading, navigate]);

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-gray-200 rounded w-36 mx-auto"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-gray-500">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
