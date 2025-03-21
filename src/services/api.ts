import { v4 as uuidv4 } from 'uuid';
import { 
  Project, 
  Task, 
  Template, 
  Client, 
  TeamMember,
  CreateProjectFormData,
  CreateTaskFormData,
  CreateTemplateFormData,
  CreateTemplateTaskFormData,
  CreateClientFormData
} from '@/types';
import { mockData } from './mockData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchProjects = async (): Promise<Project[]> => {
  await delay(500);
  return mockData.projects;
};

export const fetchProject = async (projectId: string): Promise<Project | undefined> => {
  await delay(500);
  return mockData.projects.find(project => project.id === projectId);
};

export const createProject = async (data: CreateProjectFormData): Promise<Project> => {
  await delay(800);
  const newProject: Project = {
    id: uuidv4(),
    ...data,
    status: 'Not Started',
    lastEdited: new Date().toISOString(),
    teamMemberIds: data.teamMemberIds || [],
  };
  mockData.projects.push(newProject);
  return newProject;
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
  await delay(800);
  const projectIndex = mockData.projects.findIndex(project => project.id === id);
  if (projectIndex === -1) throw new Error('Project not found');

  mockData.projects[projectIndex] = {
    ...mockData.projects[projectIndex],
    ...data,
    lastEdited: new Date().toISOString(),
  };
  return mockData.projects[projectIndex];
};

export const deleteTask = async (id: string): Promise<void> => {
  await delay(500);
  const taskIndex = mockData.tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) throw new Error('Task not found');

  mockData.tasks.splice(taskIndex, 1);
};

export const fetchTasks = async (): Promise<Task[]> => {
  await delay(500);
  return mockData.tasks;
};

export const createTask = async (data: CreateTaskFormData, projectId: string): Promise<Task> => {
  await delay(800);
  const newTask: Task = {
    id: uuidv4(),
    projectId: projectId,
    ...data,
    status: 'Not Started',
    position: mockData.tasks.length + 1,
    lastEdited: new Date().toISOString(),
  };
  mockData.tasks.push(newTask);
  return newTask;
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
  await delay(800);
  const taskIndex = mockData.tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) throw new Error('Task not found');

  mockData.tasks[taskIndex] = {
    ...mockData.tasks[taskIndex],
    ...data,
    lastEdited: new Date().toISOString(),
  };
  return mockData.tasks[taskIndex];
};

export const fetchTemplates = async (): Promise<Template[]> => {
  await delay(500);
  return mockData.templates;
};

export const fetchTemplate = async (templateId: string): Promise<Template | undefined> => {
  await delay(500);
  return mockData.templates.find(template => template.id === templateId);
};

export const createTemplate = async (data: CreateTemplateFormData): Promise<Template> => {
  await delay(800);
  const newTemplate: Template = {
    id: uuidv4(),
    ...data,
    tasks: [],
    lastEdited: new Date().toISOString(),
  };
  mockData.templates.push(newTemplate);
  return newTemplate;
};

export const updateTemplate = async (id: string, data: Partial<Template>): Promise<Template> => {
  await delay(800);
  const templateIndex = mockData.templates.findIndex(template => template.id === id);
  if (templateIndex === -1) throw new Error('Template not found');

  mockData.templates[templateIndex] = {
    ...mockData.templates[templateIndex],
    ...data,
    lastEdited: new Date().toISOString(),
  };
  return mockData.templates[templateIndex];
};

export const fetchClients = async (): Promise<Client[]> => {
  await delay(500);
  return mockData.clients;
};

export const fetchClient = async (clientId: string): Promise<Client> => {
  await delay(500);
  const client = mockData.clients.find(c => c.id === clientId);
  if (!client) throw new Error('Client not found');
  return client;
};

export const createClient = async (data: CreateClientFormData): Promise<Client> => {
  await delay(800);
  const newClient: Client = {
    id: uuidv4(),
    ...data,
    isActive: data.isActive ?? true,
    services: data.services || [],
  };
  
  mockData.clients.push(newClient);
  return newClient;
};

export const updateClient = async (id: string, data: Partial<Client>): Promise<Client> => {
  await delay(800);
  const index = mockData.clients.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Client not found');
  
  mockData.clients[index] = {
    ...mockData.clients[index],
    ...data,
    lastEdited: new Date().toISOString(),
  };
  
  return mockData.clients[index];
};

export const deleteClient = async (id: string): Promise<void> => {
  await delay(500);
  const index = mockData.clients.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Client not found');
  
  mockData.clients.splice(index, 1);
};

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  await delay(500);
  return mockData.teamMembers;
};
