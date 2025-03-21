
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
  CreateClientFormData,
  Comment,
  TemplateTask,
  FilterOptions
} from '@/types';
import { mockData } from './mockData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchProjects = async (filter?: FilterOptions): Promise<Project[]> => {
  await delay(500);
  // In a real implementation, we would filter the projects based on the filter options
  // For now, just return all projects
  return mockData.projects;
};

export const fetchProject = async (projectId: string): Promise<Project | undefined> => {
  await delay(500);
  return mockData.projects.find(project => project.id === projectId);
};

// Alias for fetchProject to maintain compatibility
export const getProject = fetchProject;

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

export const createTask = async (projectId: string, data: CreateTaskFormData): Promise<Task> => {
  await delay(800);
  const newTask: Task = {
    id: uuidv4(),
    projectId: projectId,
    name: data.name,
    description: data.description,
    assigneeId: data.assigneeId,
    status: 'Not Started',
    position: mockData.tasks.filter(task => task.projectId === projectId).length + 1,
    dueDate: data.dueDate,
    lastEdited: new Date().toISOString(),
  };
  mockData.tasks.push(newTask);
  return newTask;
};

export const updateTask = async (projectId: string, taskId: string, data: Partial<Task>): Promise<Task> => {
  await delay(800);
  const taskIndex = mockData.tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) throw new Error('Task not found');

  mockData.tasks[taskIndex] = {
    ...mockData.tasks[taskIndex],
    ...data,
    lastEdited: new Date().toISOString(),
  };
  return mockData.tasks[taskIndex];
};

// Added for task list reordering
export const reorderTasks = async (projectId: string, taskIds: string[]): Promise<Task[]> => {
  await delay(500);
  const tasks = mockData.tasks.filter(task => task.projectId === projectId);
  
  taskIds.forEach((taskId, index) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.position = index + 1;
    }
  });
  
  return tasks.sort((a, b) => a.position - b.position);
};

export const fetchTemplates = async (): Promise<Template[]> => {
  await delay(500);
  return mockData.templates;
};

export const fetchTemplate = async (templateId: string): Promise<Template | undefined> => {
  await delay(500);
  return mockData.templates.find(template => template.id === templateId);
};

// Alias for fetchTemplate to maintain compatibility
export const getTemplate = fetchTemplate;

export const createTemplate = async (data: CreateTemplateFormData): Promise<Template> => {
  await delay(800);
  const newTemplate: Template = {
    id: uuidv4(),
    ...data,
    tasks: [],
    lastEdited: new Date().toISOString(),
    clientIds: [],
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

// Add template task functions
export const createTemplateTask = async (templateId: string, taskData: Omit<TemplateTask, 'id' | 'templateId' | 'position'>): Promise<TemplateTask> => {
  await delay(800);
  const template = mockData.templates.find(t => t.id === templateId);
  if (!template) throw new Error('Template not found');
  
  const newTask: TemplateTask = {
    id: uuidv4(),
    templateId,
    position: template.tasks.length + 1,
    name: taskData.name,
    description: taskData.description,
    assigneeId: taskData.assigneeId,
    relativeDueDate: taskData.relativeDueDate,
    timeEstimate: taskData.timeEstimate
  };
  
  template.tasks.push(newTask);
  return newTask;
};

export const updateTemplateTask = async (templateId: string, taskId: string, data: Partial<TemplateTask>): Promise<TemplateTask> => {
  await delay(800);
  const template = mockData.templates.find(t => t.id === templateId);
  if (!template) throw new Error('Template not found');
  
  const taskIndex = template.tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) throw new Error('Task not found');
  
  template.tasks[taskIndex] = {
    ...template.tasks[taskIndex],
    ...data,
  };
  
  return template.tasks[taskIndex];
};

export const deleteTemplateTask = async (templateId: string, taskId: string): Promise<void> => {
  await delay(500);
  const template = mockData.templates.find(t => t.id === templateId);
  if (!template) throw new Error('Template not found');
  
  const taskIndex = template.tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) throw new Error('Task not found');
  
  template.tasks.splice(taskIndex, 1);
  
  // Update positions for remaining tasks
  template.tasks.forEach((task, index) => {
    task.position = index + 1;
  });
};

export const reorderTemplateTasks = async (templateId: string, taskIds: string[]): Promise<TemplateTask[]> => {
  await delay(500);
  const template = mockData.templates.find(t => t.id === templateId);
  if (!template) throw new Error('Template not found');
  
  taskIds.forEach((taskId, index) => {
    const taskIndex = template.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      template.tasks[taskIndex].position = index + 1;
    }
  });
  
  return [...template.tasks].sort((a, b) => a.position - b.position);
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

// Add mock comments functionality
export const fetchComments = async (projectId: string): Promise<Comment[]> => {
  await delay(500);
  // Mock data for comments
  const mockComments: Comment[] = [
    {
      id: '1',
      projectId,
      authorId: 'user-1',
      content: 'Initial client call completed. They need this by end of month.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      projectId,
      authorId: 'user-2',
      content: 'I\'ve started working on the first few tasks. Will update progress tomorrow.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  return mockComments.filter(comment => comment.projectId === projectId);
};

export const createComment = async (projectId: string, content: string): Promise<Comment> => {
  await delay(800);
  
  // Mock creating a new comment
  const newComment: Comment = {
    id: uuidv4(),
    projectId,
    authorId: 'user-1', // Hardcoded current user for now
    content,
    createdAt: new Date().toISOString()
  };
  
  return newComment;
};
