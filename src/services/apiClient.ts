import axios from 'axios';
import { 
  Project, 
  Client, 
  Contact, 
  Task,
  Template, 
  CreateClientFormData,
  CreateContactFormData,
  CreateTaskFormData,
  CreateTemplateFormData,
  TasksByStatus,
  TasksByProject
} from '@/types';

// Create axios instance
const API_URL = 'http://localhost:5000/api';
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Templates
export const fetchTemplates = async (): Promise<Template[]> => {
  const response = await apiClient.get('/templates');
  return response.data;
};

export const fetchTemplate = async (id: string): Promise<Template> => {
  const response = await apiClient.get(`/templates/${id}`);
  return response.data;
};

export const createTemplate = async (templateData: CreateTemplateFormData): Promise<Template> => {
  const response = await apiClient.post('/templates', templateData);
  return response.data;
};

export const updateTemplate = async (id: string, templateData: Partial<Template>): Promise<Template> => {
  const response = await apiClient.patch(`/templates/${id}`, templateData);
  return response.data;
};

export const deleteTemplate = async (id: string): Promise<void> => {
  await apiClient.delete(`/templates/${id}`);
};

// Projects
export const fetchProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get('/projects');
  return response.data;
};

export const fetchProject = async (id: string): Promise<Project> => {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData: Partial<Project>): Promise<Project> => {
  const response = await apiClient.post('/projects', projectData);
  return response.data;
};

export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
  const response = await apiClient.patch(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await apiClient.delete(`/projects/${id}`);
};

export const getClientProjects = async (clientId: string): Promise<Project[]> => {
  const response = await apiClient.get(`/projects/client/${clientId}`);
  return response.data;
};

// Clients
export const fetchClients = async (): Promise<Client[]> => {
  const response = await apiClient.get('/clients');
  return response.data;
};

export const fetchClient = async (id: string): Promise<Client> => {
  const response = await apiClient.get(`/clients/${id}`);
  return response.data;
};

export const createClient = async (clientData: CreateClientFormData): Promise<Client> => {
  const response = await apiClient.post('/clients', clientData);
  return response.data;
};

export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
  const response = await apiClient.patch(`/clients/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id: string): Promise<void> => {
  await apiClient.delete(`/clients/${id}`);
};

// Contacts
export const fetchContacts = async (): Promise<Contact[]> => {
  const response = await apiClient.get('/contacts');
  return response.data;
};

export const fetchContact = async (id: string): Promise<Contact> => {
  const response = await apiClient.get(`/contacts/${id}`);
  return response.data;
};

export const createContact = async (contactData: CreateContactFormData): Promise<Contact> => {
  const response = await apiClient.post('/contacts', contactData);
  return response.data;
};

export const updateContact = async (id: string, contactData: Partial<Contact>): Promise<Contact> => {
  const response = await apiClient.patch(`/contacts/${id}`, contactData);
  return response.data;
};

export const deleteContact = async (id: string): Promise<void> => {
  await apiClient.delete(`/contacts/${id}`);
};

export const fetchClientContacts = async (clientId: string): Promise<Contact[]> => {
  const response = await apiClient.get(`/contacts/client/${clientId}`);
  return response.data;
};

// Tasks
export const createTask = async (projectId: string, taskData: CreateTaskFormData): Promise<Task> => {
  const response = await apiClient.post(`/tasks/${projectId}`, taskData);
  return response.data;
};

export const updateTask = async (projectId: string, taskId: string, taskData: Partial<Task>): Promise<Task> => {
  const response = await apiClient.patch(`/tasks/${projectId}/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (projectId: string, taskId: string): Promise<void> => {
  await apiClient.delete(`/tasks/${projectId}/${taskId}`);
};

export const getTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get('/tasks');
  return response.data;
};

// My Work tasks
export const getMyOverdueTasks = async (): Promise<Task[]> => {
  const tasks = await getTasks();
  const today = new Date();
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'Complete';
  });
};

export const getMyTasksByStatus = async (): Promise<TasksByStatus> => {
  const tasks = await getTasks();
  const tasksByStatus: TasksByStatus = {
    'Not Started': [],
    'In Progress': [],
    'Complete': [],
  };
  
  tasks.forEach(task => {
    if (tasksByStatus[task.status]) {
      tasksByStatus[task.status].push(task as any);
    }
  });
  
  return tasksByStatus;
};

export const getMyTasksByProject = async (): Promise<TasksByProject> => {
  const projects = await fetchProjects();
  const clients = await fetchClients();
  const tasksByProject: TasksByProject = {};
  
  projects.forEach(project => {
    if (project.tasks && project.tasks.length > 0) {
      // Get client name by ID if needed
      let clientName: string | undefined;
      if (project.clientId) {
        // Find the client by ID from the clients array
        const client = clients.find(c => c.id === project.clientId);
        clientName = client ? client.name : `Client: ${project.clientId}`;
      }
      
      tasksByProject[project.id] = {
        projectId: project.id,
        projectName: project.name,
        clientName: clientName,
        tasks: project.tasks.map(task => ({
          ...task,
          projectName: project.name,
          clientName: clientName,
        })),
      };
    }
  });
  
  return tasksByProject;
};

// Export the apiClient for any custom requests
export default apiClient;
