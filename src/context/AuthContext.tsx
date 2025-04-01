
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/account';

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
    if (storedToken) {
      setToken(storedToken);
      
      // Set auth header for all future axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      // Get current user data
      fetchUserData(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Function to fetch user data
  const fetchUserData = async (authToken: string) => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      // Convert backend response to our User type
      const userData: User = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        planStatus: response.data.planStatus,
        trialDays: response.data.trialDays,
        avatar: response.data.avatar,
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Clear token if invalid
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('auth_token', token);
      setToken(token);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
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
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('auth_token', token);
      setToken(token);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
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
    delete axios.defaults.headers.common['Authorization'];
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Update profile function
  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await axios.put('http://localhost:5000/api/auth/profile', {
        name,
        email
      });
      
      // Update user data
      setUser(response.data);
      
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
