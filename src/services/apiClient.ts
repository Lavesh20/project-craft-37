
import axios from 'axios';

// Auth related API functions
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  try {
    const response = await axios.get('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('auth_token');
};

// Project related API functions
export const fetchProjects = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get('/api/projects', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return response.data || [];
  } catch (error) {
    console.error('Fetch projects error:', error);
    return [];
  }
};

// Client related API functions
export const fetchClients = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get('/api/clients', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return response.data || [];
  } catch (error) {
    console.error('Fetch clients error:', error);
    return [];
  }
};

// Notification related API functions
export const fetchNotifications = async (userId: string) => {
  const token = localStorage.getItem('auth_token');
  if (!token) return [];
  
  try {
    const response = await axios.get(`/api/notifications/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Fetch notifications error:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  try {
    const response = await axios.put(`/api/notifications/${notificationId}/read`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  try {
    const response = await axios.put(`/api/notifications/${userId}/read-all`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    throw error;
  }
};
