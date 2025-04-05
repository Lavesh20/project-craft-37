
import axios from 'axios';

// Helper function for API calls with proper error handling
const apiRequest = async (method: string, url: string, data?: any, headers?: any) => {
  const token = localStorage.getItem('auth_token');
  
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...headers
      }
    };
    
    if (method === 'GET') {
      const response = await axios.get(url, config);
      return response.data;
    } else if (method === 'POST') {
      const response = await axios.post(url, data, config);
      return response.data;
    } else if (method === 'PUT') {
      const response = await axios.put(url, data, config);
      return response.data;
    } else if (method === 'DELETE') {
      const response = await axios.delete(url, config);
      return response.data;
    } else if (method === 'PATCH') {
      const response = await axios.patch(url, data, config);
      return response.data;
    }
    
    throw new Error(`Unsupported method: ${method}`);
  } catch (error) {
    console.error(`API request error (${method} ${url}):`, error);
    throw error;
  }
};

// Client related API functions
export const fetchClients = () => apiRequest('GET', '/api/clients');
export const fetchClient = (id: string) => apiRequest('GET', `/api/clients/${id}`);
export const createClient = (clientData: any) => apiRequest('POST', '/api/clients', clientData);
export const updateClient = (id: string, data: any) => apiRequest('PUT', `/api/clients/${id}`, data);
export const deleteClient = (id: string) => apiRequest('DELETE', `/api/clients/${id}`);
export const getClientContacts = (clientId: string) => apiRequest('GET', `/api/clients/${clientId}/contacts`);
export const getClientProjects = (clientId: string) => apiRequest('GET', `/api/clients/${clientId}/projects`);
export const getClientSeries = (clientId: string) => apiRequest('GET', `/api/clients/${clientId}/series`);
export const getClientTemplates = (clientId: string) => apiRequest('GET', `/api/clients/${clientId}/templates`);

// Project related API functions
export const fetchProjects = () => apiRequest('GET', '/api/projects');
export const getProject = (id: string) => apiRequest('GET', `/api/projects/${id}`);
export const createProject = (projectData: any) => apiRequest('POST', '/api/projects', projectData);
export const updateProject = (id: string, data: any) => apiRequest('PUT', `/api/projects/${id}`, data);
export const deleteProject = (id: string) => apiRequest('DELETE', `/api/projects/${id}`);

// Task related API functions
export const createTask = (taskData: any) => apiRequest('POST', '/api/tasks', taskData);
export const updateTask = (id: string, data: any) => apiRequest('PUT', `/api/tasks/${id}`, data);
export const deleteTask = (id: string) => apiRequest('DELETE', `/api/tasks/${id}`);

// Template related API functions
export const fetchTemplates = () => apiRequest('GET', '/api/templates');
export const getTemplate = (id: string) => apiRequest('GET', `/api/templates/${id}`);
export const createTemplate = (templateData: any) => apiRequest('POST', '/api/templates', templateData);
export const updateTemplate = (id: string, data: any) => apiRequest('PUT', `/api/templates/${id}`, data);
export const deleteTemplate = (id: string) => apiRequest('DELETE', `/api/templates/${id}`);

// Contact related API functions
export const fetchContacts = () => apiRequest('GET', '/api/contacts');
export const fetchContact = (id: string) => apiRequest('GET', `/api/contacts/${id}`);
export const createContact = (contactData: any) => apiRequest('POST', '/api/contacts', contactData);
export const updateContact = (id: string, data: any) => apiRequest('PUT', `/api/contacts/${id}`, data);
export const deleteContact = (id: string) => apiRequest('DELETE', `/api/contacts/${id}`);

// Team member related API functions
export const fetchTeamMembers = () => apiRequest('GET', '/api/team-members');
export const getTeamMember = (id: string) => apiRequest('GET', `/api/team-members/${id}`);

// My Work related API functions
export const getMyOverdueTasks = () => apiRequest('GET', '/api/my-work/overdue-tasks');
export const getMyTasksByStatus = (date: string) => apiRequest('GET', `/api/my-work/tasks-by-status?date=${date}`);
export const getMyTasksByProject = (date: string) => apiRequest('GET', `/api/my-work/tasks-by-project?date=${date}`);

// Comments related API functions
export const getProjectComments = (projectId: string) => apiRequest('GET', `/api/projects/${projectId}/comments`);
export const createComment = (projectId: string, content: string) => 
  apiRequest('POST', `/api/projects/${projectId}/comments`, { content });

// Notification related API functions
export const fetchNotifications = (userId: string) => apiRequest('GET', `/api/notifications/${userId}`);
export const markNotificationAsRead = (notificationId: string) => apiRequest('PUT', `/api/notifications/${notificationId}/read`);
export const markAllNotificationsAsRead = (userId: string) => apiRequest('PUT', `/api/notifications/${userId}/read-all`);
