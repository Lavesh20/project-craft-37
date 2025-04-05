
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AccountContent from '@/components/account/AccountContent';
import { useAuth } from '@/context/AuthContext';

const Account = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login');
    }
  }, [loading, user, navigate]);
  
  // If loading, show a loading indicator
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading account details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // If not authenticated and not loading, content will handle redirect
  return (
    <MainLayout>
      {user && <AccountContent user={user} />}
    </MainLayout>
  );
};

export default Account;
