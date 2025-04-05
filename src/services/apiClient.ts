
import axios from 'axios';
import { mockData } from './mock';
import { useToast } from '@/hooks/use-toast';

// Configure API URL based on environment
const apiBaseUrl = '/api'; // We're using the proxy defined in vite.config.ts

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
      try {
        const { toast } = useToast();
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your connection or try again later.",
          variant: "destructive"
        });
      } catch (e) {
        console.error('Could not show toast notification');
      }
    } else {
      // Error in setting up the request
      console.error('[Request Setup Error]:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Project endpoints
export const fetchProjects = async () => {
  try {
    console.log('Fetching projects from API...');
    const response = await api.get('/projects');
    const projectsData = Array.isArray(response.data) ? response.data : [];
    console.log(`Successfully fetched ${projectsData.length} projects from API`);
    return projectsData;
  } catch (error) {
    console.error('Error fetching projects:', error);
    console.log('Using mock project data as fallback');
    return mockData.projects || [];
  }
};

export const fetchProjectById = async (id: string) => {
  try {
    console.log(`Fetching project ${id} from API...`);
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    // Look up the project in mock data
    const mockProject = mockData.projects?.find(p => p.id === id);
    if (mockProject) {
      console.log(`Using mock data for project ${id}`);
      return mockProject;
    }
    throw error;
  }
};

export const createProject = async (projectData: any) => {
  try {
    console.log('Creating project with data:', projectData);
    const response = await api.post('/projects', projectData);
    console.log('Project created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (id: string, projectData: any) => {
  try {
    const response = await api.patch(`/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  try {
    await api.delete(`/projects/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw error;
  }
};

// Template endpoints
export const fetchTemplates = async () => {
  try {
    console.log('Fetching templates from API...');
    const response = await api.get('/templates');
    const templatesData = Array.isArray(response.data) ? response.data : [];
    console.log(`Successfully fetched ${templatesData.length} templates from API`);
    return templatesData;
  } catch (error) {
    console.error('Error fetching templates:', error);
    console.log('Using mock template data as fallback');
    return mockData.templates || [];
  }
};

export const fetchTemplateById = async (id: string) => {
  try {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching template ${id}:`, error);
    // Look up the template in mock data
    const mockTemplate = mockData.templates.find(t => t.id === id);
    if (mockTemplate) {
      console.log(`Using mock data for template ${id}`);
      return mockTemplate;
    }
    throw error;
  }
};

// Client endpoints
export const fetchClients = async () => {
  try {
    console.log('Fetching clients from API...');
    const response = await api.get('/clients');
    const clientsData = Array.isArray(response.data) ? response.data : [];
    console.log(`Successfully fetched ${clientsData.length} clients from API`);
    return clientsData;
  } catch (error) {
    console.error('Error fetching clients:', error);
    console.log('Using mock client data as fallback');
    return mockData.clients || [];
  }
};

export const createClient = async (clientData: any) => {
  try {
    console.log('Creating client with data:', clientData);
    const response = await api.post('/clients', clientData);
    console.log('Client created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const fetchClientById = async (id: string) => {
  try {
    console.log(`Fetching client ${id} from API...`);
    const response = await api.get(`/clients/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching client ${id}:`, error);
    // Look up client in mock data
    const mockClient = mockData.clients?.find(c => c.id === id);
    if (mockClient) {
      console.log(`Using mock data for client ${id}`);
      return mockClient;
    }
    throw error;
  }
};

// Authentication endpoints
export const loginUser = async (email: string, password: string) => {
  try {
    console.log('Attempting to login with:', { email });
    const response = await api.post('/auth/login', { email, password });
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
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

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
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

export const getCurrentUser = async () => {
  try {
    console.log('Fetching current user data from API...');
    const response = await api.get('/auth/me');
    console.log('Successfully fetched user data:', response.data);
    return response.data;
  } catch (error) {
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

export const updateUserProfile = async (userData: any) => {
  try {
    console.log('Updating user profile with data:', userData);
    const response = await api.put('/auth/profile', userData);
    console.log('Profile updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Other endpoints remain but use the api instance
export const createTemplate = async (templateData: any) => {
  try {
    console.log('Creating template with data:', templateData);
    const response = await api.post('/templates', templateData);
    console.log('Template created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

export const updateTemplate = async (id: string, templateData: any) => {
  try {
    const response = await api.patch(`/templates/${id}`, templateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating template ${id}:`, error);
    throw error;
  }
};

export const deleteTemplate = async (id: string) => {
  try {
    await api.delete(`/templates/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting template ${id}:`, error);
    throw error;
  }
};

// Contact endpoints
export const createContact = async (contactData: any) => {
  try {
    console.log('Creating contact with data:', contactData);
    const response = await api.post('/contacts', contactData);
    console.log('Contact created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

export const fetchContacts = async () => {
  try {
    console.log('Fetching contacts from API...');
    const response = await api.get('/contacts');
    console.log('Contacts fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return mockData.contacts || [];
  }
};

// Notification endpoints
export const fetchNotifications = async (userId: string) => {
  try {
    const response = await api.get(`/notifications/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const response = await api.put(`/notifications/mark-all-read/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const createNotification = async (notificationData: any) => {
  try {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Export the axios instance for direct use when needed
export default api;
