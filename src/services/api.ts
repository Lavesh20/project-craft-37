import axios from 'axios';
import { Project, Task, Template, TemplateTask, Client, TeamMember, Contact, CreateContactFormData, Series, CreateTaskFormData, CreateProjectFormData, CreateTemplateFormData, CreateClientFormData, Comment, CreateTemplateTaskFormData, FilterOptions, TableColumn, MyWorkTask, TasksByStatus, TasksByProject } from '@/types';
import { mockData } from './mock';

const apiCallWithFallback = <T>(fn: () => T): T => {
  try {
    return fn();
  } catch (error) {
    console.error("Fallback function failed:", error);
    throw error;
  }
};

// Projects API
export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get('/api/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return apiCallWithFallback(() => mockData.projects);
  }
};

export const getProject = async (id: string): Promise<Project> => {
  try {
    const response = await axios.get(`/api/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project with id ${id}:`, error);
    const project = mockData.projects.find((p) => p.id === id);
    if (project) {
      return project;
    }
    throw error;
  }
};

export const createProject = async (data: CreateProjectFormData): Promise<Project> => {
  try {
    const response = await axios.post('/api/projects', data);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    return apiCallWithFallback(() => {
      const newProject: Project = {
        id: Math.random().toString(36).substring(2, 15),
        name: data.name,
        description: data.description,
        clientId: data.clientId,
        assigneeId: data.assigneeId,
        teamMemberIds: data.teamMemberIds,
        status: data.status,
        dueDate: data.dueDate,
        lastEdited: new Date().toISOString(),
        templateId: data.templateId,
        repeating: data.repeating,
        frequency: data.frequency,
      };
      mockData.projects.push(newProject);
      return newProject;
    });
  }
};

export const updateProject = async (id: string, data: Project): Promise<Project> => {
  try {
    const response = await axios.put(`/api/projects/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating project with id ${id}:`, error);
    return apiCallWithFallback(() => {
      const index = mockData.projects.findIndex((p) => p.id === id);
      if (index !== -1) {
        mockData.projects[index] = { ...mockData.projects[index], ...data };
        return mockData.projects[index];
      }
      throw new Error(`Project with id ${id} not found in mock data`);
    });
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/projects/${id}`);
  } catch (error) {
    console.error(`Error deleting project with id ${id}:`, error);
    apiCallWithFallback(() => {
      mockData.projects = mockData.projects.filter((p) => p.id !== id);
    });
  }
};

// Tasks API
export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get('/api/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return apiCallWithFallback(() => mockData.tasks);
  }
};

export const getTask = async (id: string): Promise<Task> => {
  try {
    const response = await axios.get(`/api/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with id ${id}:`, error);
    const task = mockData.tasks.find((t) => t.id === id);
    if (task) {
      return task;
    }
    throw error;
  }
};

export const createTask = async (data: CreateTaskFormData): Promise<Task> => {
  try {
    const response = await axios.post('/api/tasks', data);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    return apiCallWithFallback(() => {
      const newTask: Task = {
        id: Math.random().toString(36).substring(2, 15),
        projectId: 'mock-project-id', // Replace with actual project ID if needed
        name: data.name,
        description: data.description,
        assigneeId: data.assigneeId,
        status: 'Not Started',
        dueDate: data.dueDate,
        position: mockData.tasks.length,
        lastEdited: new Date().toISOString(),
      };
      mockData.tasks.push(newTask);
      return newTask;
    });
  }
};

export const updateTask = async (id: string, data: Task): Promise<Task> => {
  try {
    const response = await axios.put(`/api/tasks/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating task with id ${id}:`, error);
    return apiCallWithFallback(() => {
      const index = mockData.tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        mockData.tasks[index] = { ...mockData.tasks[index], ...data };
        return mockData.tasks[index];
      }
      throw new Error(`Task with id ${id} not found in mock data`);
    });
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/tasks/${id}`);
  } catch (error) {
    console.error(`Error deleting task with id ${id}:`, error);
    apiCallWithFallback(() => {
      mockData.tasks = mockData.tasks.filter((t) => t.id !== id);
    });
  }
};

// Templates API
export const getTemplates = async (): Promise<Template[]> => {
  try {
    const response = await axios.get('/api/templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    return apiCallWithFallback(() => mockData.templates);
  }
};

export const getTemplate = async (id: string): Promise<Template> => {
  try {
    const response = await axios.get(`/api/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching template with id ${id}:`, error);
    const template = mockData.templates.find((t) => t.id === id);
    if (template) {
      return template;
    }
    throw error;
  }
};

export const createTemplate = async (data: CreateTemplateFormData): Promise<Template> => {
  try {
    const response = await axios.post('/api/templates', data);
    return response.data;
  } catch (error) {
    console.error('Error creating template:', error);
    return apiCallWithFallback(() => {
      const newTemplate: Template = {
        id: Math.random().toString(36).substring(2, 15),
        name: data.name,
        description: data.description,
        teamMemberIds: data.teamMemberIds,
        clientIds: [],
        tasks: [],
        lastEdited: new Date().toISOString(),
      };
      mockData.templates.push(newTemplate);
      return newTemplate;
    });
  }
};

export const updateTemplate = async (id: string, data: Template): Promise<Template> => {
  try {
    const response = await axios.put(`/api/templates/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating template with id ${id}:`, error);
    return apiCallWithFallback(() => {
      const index = mockData.templates.findIndex((t) => t.id === id);
      if (index !== -1) {
        mockData.templates[index] = { ...mockData.templates[index], ...data };
        return mockData.templates[index];
      }
      throw new Error(`Template with id ${id} not found in mock data`);
    });
  }
};

export const deleteTemplate = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/templates/${id}`);
  } catch (error) {
    console.error(`Error deleting template with id ${id}:`, error);
    apiCallWithFallback(() => {
      mockData.templates = mockData.templates.filter((t) => t.id !== id);
    });
  }
};

// Template Tasks API
export const createTemplateTask = async (templateId: string, data: CreateTemplateTaskFormData): Promise<TemplateTask> => {
  try {
    const response = await axios.post(`/api/templates/${templateId}/tasks`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating template task:', error);
    return apiCallWithFallback(() => {
      const newTemplateTask: TemplateTask = {
        id: Math.random().toString(36).substring(2, 15),
        templateId: templateId,
        name: data.name,
        description: data.description,
        position: mockData.templates[0].tasks.length,
        relativeDueDate: data.relativeDueDate,
        timeEstimate: data.timeEstimate,
        assigneeId: data.assigneeId,
      };
      mockData.templates[0].tasks.push(newTemplateTask);
      return newTemplateTask;
    });
  }
};

export const updateTemplateTask = async (templateId: string, taskId: string, data: TemplateTask): Promise<TemplateTask> => {
  try {
    const response = await axios.put(`/api/templates/${templateId}/tasks/${taskId}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating template task with id ${taskId}:`, error);
    return apiCallWithFallback(() => {
      const template = mockData.templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error(`Template with id ${templateId} not found in mock data`);
      }
      const index = template.tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        template.tasks[index] = { ...template.tasks[index], ...data };
        return template.tasks[index];
      }
      throw new Error(`Template task with id ${taskId} not found in mock data`);
    });
  }
};

export const deleteTemplateTask = async (templateId: string, taskId: string): Promise<void> => {
  try {
    await axios.delete(`/api/templates/${templateId}/tasks/${taskId}`);
  } catch (error) {
    console.error(`Error deleting template task with id ${taskId}:`, error);
    apiCallWithFallback(() => {
      const template = mockData.templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error(`Template with id ${templateId} not found in mock data`);
      }
      template.tasks = template.tasks.filter(task => task.id !== taskId);
    });
  }
};

// Clients API
export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await axios.get('/api/clients');
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    return apiCallWithFallback(() => mockData.clients);
  }
};

export const getClient = async (id: string): Promise<Client> => {
  try {
    const response = await axios.get(`/api/clients/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching client with id ${id}:`, error);
    const client = mockData.clients.find((c) => c.id === id);
    if (client) {
      return client;
    }
    throw error;
  }
};

export const createClient = async (data: CreateClientFormData): Promise<Client> => {
  try {
    const response = await axios.post('/api/clients', data);
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    return apiCallWithFallback(() => {
      const newClient: Client = {
        id: Math.random().toString(36).substring(2, 15),
        name: data.name,
        description: data.description,
        primaryContactName: data.primaryContactName,
        location: data.location,
        website: data.website,
        assigneeId: data.assigneeId,
        priority: data.priority,
        services: data.services,
        isActive: data.isActive,
        lastEdited: new Date().toISOString(),
      };
      mockData.clients.push(newClient);
      return newClient;
    });
  }
};

export const updateClient = async (id: string, data: Client): Promise<Client> => {
  try {
    const response = await axios.put(`/api/clients/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating client with id ${id}:`, error);
    return apiCallWithFallback(() => {
      const index = mockData.clients.findIndex((c) => c.id === id);
      if (index !== -1) {
        mockData.clients[index] = { ...mockData.clients[index], ...data };
        return mockData.clients[index];
      }
      throw new Error(`Client with id ${id} not found in mock data`);
    });
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/clients/${id}`);
  } catch (error) {
    console.error(`Error deleting client with id ${id}:`, error);
    apiCallWithFallback(() => {
      mockData.clients = mockData.clients.filter((c) => c.id !== id);
    });
  }
};

// Team Members API
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const response = await axios.get('/api/team-members');
    return response.data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return apiCallWithFallback(() => mockData.teamMembers);
  }
};

export const getTeamMember = async (id: string): Promise<TeamMember> => {
  try {
    const response = await axios.get(`/api/team-members/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching team member with id ${id}:`, error);
    const teamMember = mockData.teamMembers.find((tm) => tm.id === id);
    if (teamMember) {
      return teamMember;
    }
    throw error;
  }
};

// Contacts API
export const getContacts = async (): Promise<Contact[]> => {
  try {
    const response = await axios.get('/api/contacts');
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return apiCallWithFallback(() => mockData.contacts);
  }
};

export const getContact = async (id: string): Promise<Contact> => {
  try {
    const response = await axios.get(`/api/contacts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching contact with id ${id}:`, error);
    const contact = mockData.contacts.find((c) => c.id === id);
    if (contact) {
      return contact;
    }
    throw error;
  }
};

export const createContact = async (data: CreateContactFormData): Promise<Contact> => {
  try {
    const response = await axios.post('/api/contacts', data);
    return response.data;
  } catch (error) {
    console.error('Error creating contact:', error);
    return apiCallWithFallback(() => {
      const newContact: Contact = {
        id: Math.random().toString(36).substring(2, 15),
        name: data.name,
        email: data.email,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        clientId: data.clientId,
        isPrimaryContact: data.isPrimaryContact,
        lastEdited: new Date().toISOString(),
      };
      mockData.contacts.push(newContact);
      return newContact;
    });
  }
};

export const updateContact = async (id: string, data: Contact): Promise<Contact> => {
  try {
    const response = await axios.put(`/api/contacts/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating contact with id ${id}:`, error);
    return apiCallWithFallback(() => {
      const index = mockData.contacts.findIndex((c) => c.id === id);
      if (index !== -1) {
        mockData.contacts[index] = { ...mockData.contacts[index], ...data };
        return mockData.contacts[index];
      }
      throw new Error(`Contact with id ${id} not found in mock data`);
    });
  }
};

export const deleteContact = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/contacts/${id}`);
  } catch (error) {
    console.error(`Error deleting contact with id ${id}:`, error);
    apiCallWithFallback(() => {
      mockData.contacts = mockData.contacts.filter((c) => c.id !== id);
    });
  }
};

// Series API
export const getSeries = async (): Promise<Series[]> => {
  try {
    const response = await axios.get('/api/series');
    return response.data;
  } catch (error) {
    console.error('Error fetching series:', error);
    return apiCallWithFallback(() => mockData.series);
  }
};

export const getSeriesItem = async (id: string): Promise<Series> => {
  try {
    const response = await axios.get(`/api/series/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching series with id ${id}:`, error);
    const series = mockData.series.find((s) => s.id === id);
    if (series) {
      return series;
    }
    throw error;
  }
};

// Comments API
export const getComments = async (projectId: string): Promise<Comment[]> => {
    try {
      const response = await axios.get(`/api/projects/${projectId}/comments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for project with id ${projectId}:`, error);
      return apiCallWithFallback(() => mockData.comments.filter(comment => comment.projectId === projectId));
    }
  };
  
  export const createComment = async (projectId: string, content: string): Promise<Comment> => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/comments`, { content });
      return response.data;
    } catch (error) {
      console.error(`Error creating comment for project with id ${projectId}:`, error);
      return apiCallWithFallback(() => {
        const newComment: Comment = {
          id: Math.random().toString(36).substring(2, 15),
          projectId: projectId,
          authorId: 'mock-user-id', // Replace with actual user ID if needed
          content: content,
          createdAt: new Date().toISOString(),
        };
        mockData.comments.push(newComment);
        return newComment;
      });
    }
  };
  
  export const deleteComment = async (projectId: string, commentId: string): Promise<void> => {
    try {
      await axios.delete(`/api/projects/${projectId}/comments/${commentId}`);
    } catch (error) {
      console.error(`Error deleting comment with id ${commentId} for project with id ${projectId}:`, error);
      apiCallWithFallback(() => {
        mockData.comments = mockData.comments.filter(comment => comment.id !== commentId);
      });
    }
  };

// My Work APIs
export const getMyOverdueTasks = async (): Promise<MyWorkTask[]> => {
  try {
    const response = await axios.get('/api/my-work/overdue');
    return response.data;
  } catch (error) {
    console.error('Error fetching overdue tasks:', error);
    // Fallback to mock data if API fails
    return apiCallWithFallback(() => getMockOverdueTasks());
  }
};

export const getMyTasksByStatus = async (date: string): Promise<TasksByStatus> => {
  try {
    const response = await axios.get(`/api/my-work/status?date=${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    // Fallback to mock data if API fails
    return apiCallWithFallback(() => getMockTasksByStatus());
  }
};

export const getMyTasksByProject = async (date: string): Promise<TasksByProject> => {
  try {
    const response = await axios.get(`/api/my-work/project?date=${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks by project:', error);
    // Fallback to mock data if API fails
    return apiCallWithFallback(() => getMockTasksByProject());
  }
};

// Mock data functions for My Work
const getMockOverdueTasks = (): MyWorkTask[] => {
  // Filter tasks that are overdue based on the current date
  const today = new Date();
  const overdueTasks = mockData.tasks
    .filter(task => new Date(task.dueDate) < today)
    .map(task => {
      const project = mockData.projects.find(p => p.id === task.projectId);
      const client = project?.clientId 
        ? mockData.clients.find(c => c.id === project.clientId)
        : undefined;
      
      return {
        ...task,
        projectName: project?.name,
        clientName: client?.name
      };
    });

  return overdueTasks;
};

const getMockTasksByStatus = (): TasksByStatus => {
  const statuses = ['Not Started', 'In Progress', 'Complete'];
  const result: TasksByStatus = {};
  
  statuses.forEach(status => {
    const tasksWithStatus = mockData.tasks
      .filter(task => task.status === status)
      .map(task => {
        const project = mockData.projects.find(p => p.id === task.projectId);
        const client = project?.clientId 
          ? mockData.clients.find(c => c.id === project.clientId)
          : undefined;
        
        return {
          ...task,
          projectName: project?.name,
          clientName: client?.name
        };
      });
    
    result[status] = tasksWithStatus;
  });
  
  return result;
};

const getMockTasksByProject = (): TasksByProject => {
  const result: TasksByProject = {};
  
  // Group tasks by project
  mockData.projects.forEach(project => {
    const client = project.clientId 
      ? mockData.clients.find(c => c.id === project.clientId)
      : undefined;
    
    const projectTasks = mockData.tasks
      .filter(task => task.projectId === project.id)
      .map(task => ({
        ...task,
        projectName: project.name,
        clientName: client?.name
      }));
    
    if (projectTasks.length > 0) {
      result[project.id] = {
        projectName: project.name,
        clientName: client?.name,
        tasks: projectTasks
      };
    }
  });
  
  return result;
};
