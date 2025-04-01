
import axios from 'axios';
import { mockData } from './mock';

// Determine the base URL based on environment
const isProduction = window.location.hostname !== 'localhost';
const apiBaseUrl = isProduction 
  ? (import.meta.env.VITE_API_URL || 'https://1fa22f85-447a-4ac4-baf3-1c30d8f930e8.lovableproject.com/api')
  : 'http://localhost:5000/api';

// Set base URL from environment
axios.defaults.baseURL = apiBaseUrl;
axios.defaults.withCredentials = true; // Enable cookies for cross-origin requests if needed

// Add interceptors for error handling
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    // Return a rejected promise to be handled by the caller
    return Promise.reject(error);
  }
);

// Project endpoints
export const fetchProjects = async () => {
  try {
    const response = await axios.get('/projects');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Return mock data instead of throwing
    console.log('Using mock project data as fallback');
    return mockData.projects || [];
  }
};

export const fetchProjectById = async (id: string) => {
  try {
    const response = await axios.get(`/projects/${id}`);
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
    const response = await axios.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (id: string, projectData: any) => {
  try {
    const response = await axios.patch(`/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  try {
    await axios.delete(`/projects/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw error;
  }
};

// Template endpoints
export const fetchTemplates = async () => {
  try {
    const response = await axios.get('/templates');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching templates:', error);
    // Return mock data instead of throwing
    console.log('Using mock template data as fallback');
    return mockData.templates;
  }
};

export const fetchTemplateById = async (id: string) => {
  try {
    const response = await axios.get(`/templates/${id}`);
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

export const createTemplate = async (templateData: any) => {
  try {
    const response = await axios.post('/templates', templateData);
    return response.data;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

export const updateTemplate = async (id: string, templateData: any) => {
  try {
    const response = await axios.patch(`/templates/${id}`, templateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating template ${id}:`, error);
    throw error;
  }
};

export const deleteTemplate = async (id: string) => {
  try {
    await axios.delete(`/templates/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting template ${id}:`, error);
    throw error;
  }
};

// Client endpoints
export const fetchClients = async () => {
  try {
    const response = await axios.get('/clients');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    // Return mock data instead of throwing
    console.log('Using mock client data as fallback');
    return mockData.clients;
  }
};

// Notification endpoints
export const fetchNotifications = async (userId: string) => {
  try {
    const response = await axios.get(`/notifications/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await axios.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const response = await axios.put(`/notifications/mark-all-read/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const createNotification = async (notificationData: any) => {
  try {
    const response = await axios.post('/notifications', notificationData);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};
