import axios from 'axios';
import { mockData } from './mock';

// Set base URL from environment
axios.defaults.baseURL = 'http://localhost:5000/api';

// Add interceptors for error handling
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    // Return a rejected promise to be handled by the caller
    return Promise.reject(error);
  }
);

// Template endpoints
export const fetchTemplates = async () => {
  try {
    const response = await axios.get('/templates');
    return response.data;
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
    return response.data;
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
