
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AccountContent from '@/components/account/AccountContent';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Account = () => {
  const { user, loading } = useAuth();
  
  // If not authenticated and not loading, redirect to login
  if (!loading && !user) {
    return <Navigate to="/auth/login" />;
  }
  
  return (
    <MainLayout>
      <AccountContent />
    </MainLayout>
  );
};

export default Account;
