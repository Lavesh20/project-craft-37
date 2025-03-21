
import axios from 'axios';
import { Project, Client, TeamMember, Task, Comment, CreateTaskFormData, Template, TemplateTask, CreateTemplateFormData } from '../types';
import { mockProjects, mockClients, mockTeamMembers, mockTasks, mockComments, mockTemplates } from './mockData';

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
  
  // Find the project in mock data
  const project = mockProjects.find(p => p.id === id);
  
  if (!project) return Promise.resolve(null);
  
  // Get tasks for this project
  const tasks = mockTasks.filter(t => t.projectId === id);
  
  // Return project with tasks
  return Promise.resolve({
    ...project,
    tasks
  });
};

export const createProject = async (project: Omit<Project, 'id' | 'lastEdited'>): Promise<Project> => {
  // return api.post('/projects', project).then(res => res.data);
  const newProject: Project = {
    id: `proj-${Math.floor(Math.random() * 1000)}`,
    ...project,
    lastEdited: new Date().toISOString(),
    tasks: []
  };
  mockProjects.push(newProject);
  return Promise.resolve(newProject);
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
  // return api.put(`/projects/${id}`, project).then(res => res.data);
  const index = mockProjects.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Project not found');
  
  mockProjects[index] = { 
    ...mockProjects[index], 
    ...project, 
    lastEdited: new Date().toISOString(),
    lastEditedBy: 'user-1' // Assuming current user
  };
  
  // Check if all tasks are complete
  const projectTasks = mockTasks.filter(t => t.projectId === id);
  if (projectTasks.length > 0 && projectTasks.every(t => t.status === 'Complete')) {
    mockProjects[index].status = 'Complete';
  }
  
  return Promise.resolve(mockProjects[index]);
};

export const deleteProject = async (id: string): Promise<void> => {
  // return api.delete(`/projects/${id}`).then(() => {});
  const index = mockProjects.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Project not found');
  
  mockProjects.splice(index, 1);
  
  // Also delete related tasks and comments
  const taskIndices = mockTasks.reduce((acc, task, idx) => {
    if (task.projectId === id) acc.push(idx);
    return acc;
  }, [] as number[]);
  
  // Remove from highest index to lowest to avoid shifting issues
  for (let i = taskIndices.length - 1; i >= 0; i--) {
    mockTasks.splice(taskIndices[i], 1);
  }
  
  // Delete comments
  const commentIndices = mockComments.reduce((acc, comment, idx) => {
    if (comment.projectId === id) acc.push(idx);
    return acc;
  }, [] as number[]);
  
  for (let i = commentIndices.length - 1; i >= 0; i--) {
    mockComments.splice(commentIndices[i], 1);
  }
  
  return Promise.resolve();
};

// Tasks API
export const fetchTasks = async (projectId: string): Promise<Task[]> => {
  // return api.get(`/projects/${projectId}/tasks`).then(res => res.data);
  return Promise.resolve(mockTasks.filter(t => t.projectId === projectId));
};

export const getTask = async (projectId: string, taskId: string): Promise<Task | null> => {
  // return api.get(`/projects/${projectId}/tasks/${taskId}`).then(res => res.data);
  return Promise.resolve(mockTasks.find(t => t.projectId === projectId && t.id === taskId) || null);
};

export const createTask = async (projectId: string, task: CreateTaskFormData): Promise<Task> => {
  // return api.post(`/projects/${projectId}/tasks`, task).then(res => res.data);
  
  // Get max position from existing tasks
  const projectTasks = mockTasks.filter(t => t.projectId === projectId);
  const maxPosition = projectTasks.length > 0 
    ? Math.max(...projectTasks.map(t => t.position)) 
    : -1;
  
  const newTask: Task = {
    id: `task-${Math.floor(Math.random() * 1000)}`,
    projectId,
    name: task.name,
    description: task.description,
    assigneeId: task.assigneeId,
    status: 'Not Started',
    dueDate: task.dueDate,
    position: maxPosition + 1,
    lastEdited: new Date().toISOString()
  };
  
  mockTasks.push(newTask);
  
  // Update project's lastEdited
  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  if (projectIndex !== -1) {
    mockProjects[projectIndex].lastEdited = new Date().toISOString();
    mockProjects[projectIndex].lastEditedBy = 'user-1'; // Assuming current user
  }
  
  return Promise.resolve(newTask);
};

export const updateTask = async (projectId: string, taskId: string, task: Partial<Task>): Promise<Task> => {
  // return api.put(`/projects/${projectId}/tasks/${taskId}`, task).then(res => res.data);
  const index = mockTasks.findIndex(t => t.id === taskId && t.projectId === projectId);
  if (index === -1) throw new Error('Task not found');
  
  mockTasks[index] = { 
    ...mockTasks[index], 
    ...task, 
    lastEdited: new Date().toISOString() 
  };
  
  // Update project's lastEdited
  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  if (projectIndex !== -1) {
    mockProjects[projectIndex].lastEdited = new Date().toISOString();
    mockProjects[projectIndex].lastEditedBy = 'user-1'; // Assuming current user
    
    // Check if all tasks are complete and update project status
    const projectTasks = mockTasks.filter(t => t.projectId === projectId);
    if (projectTasks.length > 0 && projectTasks.every(t => t.status === 'Complete')) {
      mockProjects[projectIndex].status = 'Complete';
    } else if (projectTasks.some(t => t.status === 'In Progress')) {
      mockProjects[projectIndex].status = 'In Progress';
    } else {
      mockProjects[projectIndex].status = 'Not Started';
    }
  }
  
  return Promise.resolve(mockTasks[index]);
};

export const deleteTask = async (projectId: string, taskId: string): Promise<void> => {
  // return api.delete(`/projects/${projectId}/tasks/${taskId}`).then(() => {});
  const index = mockTasks.findIndex(t => t.id === taskId && t.projectId === projectId);
  if (index === -1) throw new Error('Task not found');
  
  mockTasks.splice(index, 1);
  
  // Update project's lastEdited
  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  if (projectIndex !== -1) {
    mockProjects[projectIndex].lastEdited = new Date().toISOString();
    mockProjects[projectIndex].lastEditedBy = 'user-1'; // Assuming current user
  }
  
  return Promise.resolve();
};

export const reorderTasks = async (projectId: string, taskIds: string[]): Promise<Task[]> => {
  // return api.post(`/projects/${projectId}/tasks/reorder`, { taskIds }).then(res => res.data);
  
  // Update positions based on new order
  taskIds.forEach((taskId, index) => {
    const taskIndex = mockTasks.findIndex(t => t.id === taskId && t.projectId === projectId);
    if (taskIndex !== -1) {
      mockTasks[taskIndex].position = index;
    }
  });
  
  // Sort to reflect new order
  mockTasks.sort((a, b) => {
    if (a.projectId === b.projectId && a.projectId === projectId) {
      return a.position - b.position;
    }
    return 0;
  });
  
  // Update project's lastEdited
  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  if (projectIndex !== -1) {
    mockProjects[projectIndex].lastEdited = new Date().toISOString();
    mockProjects[projectIndex].lastEditedBy = 'user-1'; // Assuming current user
  }
  
  return Promise.resolve(mockTasks.filter(t => t.projectId === projectId));
};

// Comments API
export const fetchComments = async (projectId: string): Promise<Comment[]> => {
  // return api.get(`/projects/${projectId}/comments`).then(res => res.data);
  return Promise.resolve(mockComments.filter(c => c.projectId === projectId));
};

export const createComment = async (projectId: string, content: string): Promise<Comment> => {
  // return api.post(`/projects/${projectId}/comments`, { content }).then(res => res.data);
  const newComment: Comment = {
    id: `comment-${Math.floor(Math.random() * 1000)}`,
    projectId,
    authorId: 'user-1', // Assuming current user
    content,
    createdAt: new Date().toISOString()
  };
  
  mockComments.push(newComment);
  
  // Update project's lastEdited
  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  if (projectIndex !== -1) {
    mockProjects[projectIndex].lastEdited = new Date().toISOString();
    mockProjects[projectIndex].lastEditedBy = 'user-1'; // Assuming current user
  }
  
  return Promise.resolve(newComment);
};

export const deleteComment = async (projectId: string, commentId: string): Promise<void> => {
  // return api.delete(`/projects/${projectId}/comments/${commentId}`).then(() => {});
  const index = mockComments.findIndex(c => c.id === commentId && c.projectId === projectId);
  if (index === -1) throw new Error('Comment not found');
  
  mockComments.splice(index, 1);
  
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

// Templates API
export const fetchTemplates = async (): Promise<Template[]> => {
  // return api.get('/templates').then(res => res.data);
  return Promise.resolve(mockTemplates);
};

export const getTemplate = async (id: string): Promise<Template | null> => {
  // return api.get(`/templates/${id}`).then(res => res.data);
  const template = mockTemplates.find(t => t.id === id);
  if (!template) return Promise.resolve(null);
  return Promise.resolve(template);
};

export const createTemplate = async (template: CreateTemplateFormData): Promise<Template> => {
  // return api.post('/templates', template).then(res => res.data);
  const newTemplate: Template = {
    id: `template-${Math.floor(Math.random() * 1000)}`,
    name: template.name,
    description: template.description,
    teamMemberIds: template.teamMemberIds,
    clientIds: [],
    tasks: [],
    lastEdited: new Date().toISOString(),
    lastEditedBy: 'user-1' // Assuming current user
  };
  mockTemplates.push(newTemplate);
  return Promise.resolve(newTemplate);
};

export const updateTemplate = async (id: string, template: Partial<Template>): Promise<Template> => {
  // return api.put(`/templates/${id}`, template).then(res => res.data);
  const index = mockTemplates.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Template not found');
  
  mockTemplates[index] = {
    ...mockTemplates[index],
    ...template,
    lastEdited: new Date().toISOString(),
    lastEditedBy: 'user-1' // Assuming current user
  };
  
  return Promise.resolve(mockTemplates[index]);
};

export const deleteTemplate = async (id: string): Promise<void> => {
  // return api.delete(`/templates/${id}`).then(() => {});
  const index = mockTemplates.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Template not found');
  
  mockTemplates.splice(index, 1);
  
  return Promise.resolve();
};

export const createTemplateTask = async (templateId: string, task: Omit<TemplateTask, 'id' | 'templateId' | 'position'>): Promise<TemplateTask> => {
  // return api.post(`/templates/${templateId}/tasks`, task).then(res => res.data);
  
  const templateIndex = mockTemplates.findIndex(t => t.id === templateId);
  if (templateIndex === -1) throw new Error('Template not found');
  
  // Get max position
  const tasks = mockTemplates[templateIndex].tasks;
  const maxPosition = tasks.length > 0 ? Math.max(...tasks.map(t => t.position)) : -1;
  
  const newTask: TemplateTask = {
    id: `template-task-${Math.floor(Math.random() * 1000)}`,
    templateId,
    position: maxPosition + 1,
    ...task
  };
  
  mockTemplates[templateIndex].tasks.push(newTask);
  mockTemplates[templateIndex].lastEdited = new Date().toISOString();
  mockTemplates[templateIndex].lastEditedBy = 'user-1'; // Assuming current user
  
  return Promise.resolve(newTask);
};

export const updateTemplateTask = async (templateId: string, taskId: string, task: Partial<TemplateTask>): Promise<TemplateTask> => {
  // return api.put(`/templates/${templateId}/tasks/${taskId}`, task).then(res => res.data);
  
  const templateIndex = mockTemplates.findIndex(t => t.id === templateId);
  if (templateIndex === -1) throw new Error('Template not found');
  
  const taskIndex = mockTemplates[templateIndex].tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) throw new Error('Task not found');
  
  mockTemplates[templateIndex].tasks[taskIndex] = {
    ...mockTemplates[templateIndex].tasks[taskIndex],
    ...task
  };
  
  mockTemplates[templateIndex].lastEdited = new Date().toISOString();
  mockTemplates[templateIndex].lastEditedBy = 'user-1'; // Assuming current user
  
  return Promise.resolve(mockTemplates[templateIndex].tasks[taskIndex]);
};

export const deleteTemplateTask = async (templateId: string, taskId: string): Promise<void> => {
  // return api.delete(`/templates/${templateId}/tasks/${taskId}`).then(() => {});
  
  const templateIndex = mockTemplates.findIndex(t => t.id === templateId);
  if (templateIndex === -1) throw new Error('Template not found');
  
  const taskIndex = mockTemplates[templateIndex].tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) throw new Error('Task not found');
  
  mockTemplates[templateIndex].tasks.splice(taskIndex, 1);
  mockTemplates[templateIndex].lastEdited = new Date().toISOString();
  mockTemplates[templateIndex].lastEditedBy = 'user-1'; // Assuming current user
  
  return Promise.resolve();
};

export const reorderTemplateTasks = async (templateId: string, taskIds: string[]): Promise<TemplateTask[]> => {
  // return api.post(`/templates/${templateId}/tasks/reorder`, { taskIds }).then(res => res.data);
  
  const templateIndex = mockTemplates.findIndex(t => t.id === templateId);
  if (templateIndex === -1) throw new Error('Template not found');
  
  // Update positions
  taskIds.forEach((taskId, index) => {
    const taskIndex = mockTemplates[templateIndex].tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      mockTemplates[templateIndex].tasks[taskIndex].position = index;
    }
  });
  
  // Sort to reflect new order
  mockTemplates[templateIndex].tasks.sort((a, b) => a.position - b.position);
  
  mockTemplates[templateIndex].lastEdited = new Date().toISOString();
  mockTemplates[templateIndex].lastEditedBy = 'user-1'; // Assuming current user
  
  return Promise.resolve(mockTemplates[templateIndex].tasks);
};

export default api;
