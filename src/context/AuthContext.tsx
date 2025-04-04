
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/account';
import {
  loginUser,
  registerUser,
  getCurrentUser,
  updateUserProfile
} from '@/services/apiClient';
import api from '@/services/apiClient';

// Define types for context
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<boolean>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: async () => false,
});

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    console.log('AuthProvider initialized, stored token:', storedToken ? 'exists' : 'none');
    
    if (storedToken) {
      setToken(storedToken);
      
      // Set auth header for all future axios requests
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      // Get current user data
      fetchUserData(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Function to fetch user data
  const fetchUserData = async (authToken: string) => {
    try {
      console.log('Fetching user data with token:', authToken);
      const userData = await getCurrentUser();
      console.log('User data received:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // For demo purposes, create demo user if token is the mock token
      if (authToken === 'mock-jwt-token-for-demo-account') {
        console.log('Creating demo user for mock token');
        setUser({
          id: 'demo-user-id',
          name: 'Demo User',
          email: 'demo@example.com',
          role: 'Admin',
          planStatus: 'Free trial',
          trialDays: 14
        });
      } else {
        // Clear token if invalid
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { token, user } = await loginUser(email, password);
      
      // Store token
      localStorage.setItem('auth_token', token);
      setToken(token);
      
      // Set axios default header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user data
      setUser(user);
      
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { token, user } = await registerUser(name, email, password);
      
      // Store token
      localStorage.setItem('auth_token', token);
      setToken(token);
      
      // Set axios default header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user data
      setUser(user);
      
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    // Remove axios auth header
    delete api.defaults.headers.common['Authorization'];
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Update profile function
  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    try {
      setLoading(true);
      const updatedUser = await updateUserProfile({ name, email });
      
      // Update user data
      setUser(updatedUser);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile update failed. Please try again.';
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth context
export const useAuth = () => useContext(AuthContext);
