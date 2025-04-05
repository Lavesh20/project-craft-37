
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AccountContent from '@/components/account/AccountContent';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          navigate('/auth/login');
          return;
        }
        
        const response = await axios.get('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
        // If authentication fails, redirect to login
        navigate('/auth/login');
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
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
      <AccountContent user={user} />
    </MainLayout>
  );
};

export default Account;
