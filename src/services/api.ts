
import axios from 'axios';
import { Project, Client, TeamMember } from '../types';
import { mockProjects, mockClients, mockTeamMembers } from './mockData';

// Create axios instance that will be used when connecting to real backend
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const fetchProjects = async (filters?: any): Promise<Project[]> => {
  // In real implementation, this would call the API
  // return api.get('/projects', { params: filters }).then(res => res.data);
  
  // For now, return mock data
  console.log('Fetching projects with filters:', filters);
  let filteredProjects = [...mockProjects];
  
  // Apply filters (this is just an example implementation)
  if (filters?.timeframe === 'this-month') {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    filteredProjects = filteredProjects.filter(project => {
      const dueDate = new Date(project.dueDate);
      return dueDate >= startOfMonth && dueDate <= endOfMonth;
    });
  }
  
  return Promise.resolve(filteredProjects);
};

export const getProject = async (id: string): Promise<Project | null> => {
  // return api.get(`/projects/${id}`).then(res => res.data);
  return Promise.resolve(mockProjects.find(p => p.id === id) || null);
};

export const createProject = async (project: Omit<Project, 'id' | 'lastEdited'>): Promise<Project> => {
  // return api.post('/projects', project).then(res => res.data);
  const newProject: Project = {
    id: `proj-${Math.floor(Math.random() * 1000)}`,
    ...project,
    lastEdited: new Date().toISOString()
  };
  mockProjects.push(newProject);
  return Promise.resolve(newProject);
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
  // return api.put(`/projects/${id}`, project).then(res => res.data);
  const index = mockProjects.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Project not found');
  
  mockProjects[index] = { ...mockProjects[index], ...project, lastEdited: new Date().toISOString() };
  return Promise.resolve(mockProjects[index]);
};

export const deleteProject = async (id: string): Promise<void> => {
  // return api.delete(`/projects/${id}`).then(() => {});
  const index = mockProjects.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Project not found');
  
  mockProjects.splice(index, 1);
  return Promise.resolve();
};

// Clients API
export const fetchClients = async (): Promise<Client[]> => {
  // return api.get('/clients').then(res => res.data);
  return Promise.resolve(mockClients);
};

export const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  // return api.post('/clients', client).then(res => res.data);
  const newClient: Client = {
    id: `client-${Math.floor(Math.random() * 1000)}`,
    ...client
  };
  mockClients.push(newClient);
  return Promise.resolve(newClient);
};

// Team Members API
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  // return api.get('/team-members').then(res => res.data);
  return Promise.resolve(mockTeamMembers);
};

export default api;
