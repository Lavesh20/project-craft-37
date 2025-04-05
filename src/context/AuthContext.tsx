
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/account';
import axios from 'axios';
import { mockData } from '@/services/mock';

// Configure API URL based on environment
const apiBaseUrl = '/api'; // Using the proxy defined in vite.config.ts

// Configure axios defaults
const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Better request logging
    const method = config.method?.toUpperCase() || 'UNKNOWN';
    console.log(`[API Request] ${method} ${config.url}`, config.data ? config.data : '');
    console.log(`[API Headers]`, config.headers);
    
    return config;
  },
  error => {
    console.error('[API Request Error]:', error);
    return Promise.reject(error);
  }
);

// Add interceptors for error handling
api.interceptors.response.use(
  response => {
    console.log('[API Response]:', response.status, response.config.url, response.data);
    return response;
  },
  error => {
    if (error.response) {
      // Server responded with an error status code
      console.error('[API Error]:', error.response.status, error.response.config?.url, error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Clear token if it's invalid
        if (localStorage.getItem('auth_token')) {
          console.log('Authentication token expired or invalid');
          // Don't automatically log out here to avoid disrupting the user experience
        }
      }
    } else if (error.request) {
      // Request was made but no response received (server down or network issue)
      console.error('[Network Error] No response received:', error.config?.url);
    } else {
      // Error in setting up the request
      console.error('[Request Setup Error]:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Authentication functions
const loginUser = async (email: string, password: string) => {
  try {
    console.log('Attempting to login with:', { email });
    const response = await api.post('/auth/login', { email, password });
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Demo account fallback for development/testing
    if (email === 'demo@example.com' && password === 'password123') {
      console.log('Using mock data for demo login');
      
      // Create a mock token
      const mockToken = 'mock-jwt-token-for-demo-account';
      
      // Create mock user data
      const mockUser = {
        id: 'demo-user-id',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'Admin',
        planStatus: 'Free trial',
        trialDays: 14,
        avatar: null
      };
      
      return { user: mockUser, token: mockToken };
    }
    
    throw error;
  }
};

const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Demo account fallback for development/testing
    if (email === 'demo@example.com') {
      console.log('Using mock data for demo registration');
      
      // Create a mock token
      const mockToken = 'mock-jwt-token-for-demo-account';
      
      // Create mock user data
      const mockUser = {
        id: 'demo-user-id',
        name: name,
        email: email,
        role: 'Admin',
        planStatus: 'Free trial',
        trialDays: 14,
        avatar: null
      };
      
      return { user: mockUser, token: mockToken };
    }
    
    throw error;
  }
};

const getCurrentUser = async () => {
  try {
    console.log('Fetching current user data from API...');
    const response = await api.get('/auth/me');
    console.log('Successfully fetched user data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get current user error:', error);
    
    // Check if we have a mock token in local storage
    const token = localStorage.getItem('auth_token');
    if (token === 'mock-jwt-token-for-demo-account') {
      console.log('Using mock data for demo user');
      const mockUser = {
        id: 'demo-user-id',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'Admin',
        planStatus: 'Free trial',
        trialDays: 14,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      console.log('Returning mock user data:', mockUser);
      return mockUser;
    }
    
    throw error;
  }
};

const updateUserProfile = async (userData: any) => {
  try {
    console.log('Updating user profile with data:', userData);
    const response = await api.put('/auth/profile', userData);
    console.log('Profile updated successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update profile error:', error);
    throw error;
  }
};

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

// Export the axios instance for use in other components if needed
export { api };
