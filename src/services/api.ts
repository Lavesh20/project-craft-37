import { mockData } from './mockData';
import { 
  Project, Task, Template, Client, TeamMember, Contact, 
  CreateProjectFormData, CreateTemplateFormData, CreateContactFormData, 
  CreateTaskFormData, Comment, CreateClientFormData, CreateTemplateTaskFormData,
  TemplateTask
} from '@/types';

// Function to fetch all projects
export const fetchProjects = async (filter?: any): Promise<Project[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredProjects = [...mockData.projects];
  
  if (filter) {
    // Filter by timeframe
    if (filter.timeframe && filter.timeframe !== 'all') {
      // Implement timeframe filtering logic here
    }
    
    // Filter by status
    if (filter.status && filter.status !== 'all') {
      filteredProjects = filteredProjects.filter(project => 
        project.status.toLowerCase().replace(' ', '-') === filter.status
      );
    }
    
    // Filter by client
    if (filter.client && filter.client !== 'all') {
      filteredProjects = filteredProjects.filter(project => 
        project.clientId === filter.client
      );
    }
  }
  
  return filteredProjects;
};

// Function to fetch a single project by ID
export const fetchProject = async (id: string): Promise<Project | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData.projects.find(project => project.id === id);
};

// Function to create a new project
export const createProject = async (projectData: CreateProjectFormData): Promise<Project> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const newProject: Project = {
    id: `project-${Date.now()}`, // Generate a unique ID
    ...projectData,
    teamMemberIds: projectData.teamMemberIds || [],
    status: projectData.status || 'Not Started',
    lastEdited: new Date().toISOString(),
    repeating: projectData.repeating || false,
    labels: [],
  };

  mockData.projects.push(newProject);
  return newProject;
};

// Function to update a project
export const updateProject = async (id: string, updatedData: Partial<Project>): Promise<Project> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const index = mockData.projects.findIndex(project => project.id === id);
  if (index !== -1) {
    mockData.projects[index] = { 
      ...mockData.projects[index], 
      ...updatedData, 
      lastEdited: new Date().toISOString() 
    };
    return mockData.projects[index];
  } else {
    throw new Error('Project not found');
  }
};

// Function to fetch all tasks for a project
export const fetchTasks = async (projectId: string): Promise<Task[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData.tasks.filter(task => task.projectId === projectId);
};

// Function to create a new task
export const createTask = async (projectId: string, taskData: CreateTaskFormData): Promise<Task> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find the project to get the last position
  const projectTasks = mockData.tasks.filter(task => task.projectId === projectId);
  const position = projectTasks.length > 0 
    ? Math.max(...projectTasks.map(task => task.position)) + 1 
    : 0;

  const newTask: Task = {
    id: `task-${Date.now()}`, // Generate a unique ID
    projectId,
    name: taskData.name,
    description: taskData.description || '',
    assigneeId: taskData.assigneeId,
    status: 'Not Started',
    dueDate: taskData.dueDate,
    position,
    lastEdited: new Date().toISOString(),
  };

  mockData.tasks.push(newTask);
  
  // Update the project's tasks array if it exists
  const projectIndex = mockData.projects.findIndex(p => p.id === projectId);
  if (projectIndex !== -1) {
    if (!mockData.projects[projectIndex].tasks) {
      mockData.projects[projectIndex].tasks = [];
    }
    mockData.projects[projectIndex].tasks?.push(newTask);
    mockData.projects[projectIndex].lastEdited = new Date().toISOString();
  }
  
  return newTask;
};

// Function to update a task
export const updateTask = async (projectId: string, taskId: string, updates: Partial<Task>): Promise<Task> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const taskIndex = mockData.tasks.findIndex(task => task.id === taskId && task.projectId === projectId);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }

  // Update the task
  mockData.tasks[taskIndex] = {
    ...mockData.tasks[taskIndex],
    ...updates,
    lastEdited: new Date().toISOString(),
  };

  // Update the task in the project's tasks array if it exists
  const projectIndex = mockData.projects.findIndex(p => p.id === projectId);
  if (projectIndex !== -1 && mockData.projects[projectIndex].tasks) {
    const projectTaskIndex = mockData.projects[projectIndex].tasks!.findIndex(t => t.id === taskId);
    if (projectTaskIndex !== -1) {
      mockData.projects[projectIndex].tasks![projectTaskIndex] = {
        ...mockData.projects[projectIndex].tasks![projectTaskIndex],
        ...updates,
        lastEdited: new Date().toISOString(),
      };
    }
    mockData.projects[projectIndex].lastEdited = new Date().toISOString();
  }

  return mockData.tasks[taskIndex];
};

// Function to reorder tasks
export const reorderTasks = async (projectId: string, taskIds: string[]): Promise<Task[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Update positions for all tasks in the order
  taskIds.forEach((taskId, index) => {
    const taskIndex = mockData.tasks.findIndex(task => task.id === taskId && task.projectId === projectId);
    if (taskIndex !== -1) {
      mockData.tasks[taskIndex].position = index;
    }
  });

  // Return tasks in new order
  return mockData.tasks
    .filter(task => task.projectId === projectId)
    .sort((a, b) => a.position - b.position);
};

// Function to fetch all templates
export const fetchTemplates = async (): Promise<Template[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData.templates;
};

// Function to fetch a single template by ID
export const fetchTemplate = async (id: string): Promise<Template | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData.templates.find(template => template.id === id);
};

// Function to create a new template
export const createTemplate = async (templateData: CreateTemplateFormData): Promise<Template> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const newTemplate: Template = {
    id: `template-${Date.now()}`, // Generate a unique ID
    name: templateData.name,
    description: templateData.description,
    teamMemberIds: templateData.teamMemberIds || [],
    clientIds: [],
    tasks: [],
    lastEdited: new Date().toISOString(),
  };

  mockData.templates.push(newTemplate);
  return newTemplate;
};

// Function to update a template
export const updateTemplate = async (id: string, updatedData: Partial<Template>): Promise<Template> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const index = mockData.templates.findIndex(template => template.id === id);
  if (index === -1) {
    throw new Error('Template not found');
  }

  mockData.templates[index] = {
    ...mockData.templates[index],
    ...updatedData,
    lastEdited: new Date().toISOString()
  };

  return mockData.templates[index];
};

// Function to create a template task
export const createTemplateTask = async (
  templateId: string, 
  taskData: CreateTemplateTaskFormData
): Promise<TemplateTask> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const template = mockData.templates.find(t => t.id === templateId);
  if (!template) {
    throw new Error('Template not found');
  }

  const position = template.tasks.length;
  const newTask: TemplateTask = {
    id: `template-task-${Date.now()}`,
    templateId,
    position,
    name: taskData.name,
    description: taskData.description,
    relativeDueDate: taskData.relativeDueDate,
    timeEstimate: taskData.timeEstimate,
    assigneeId: taskData.assigneeId
  };

  template.tasks.push(newTask);
  template.lastEdited = new Date().toISOString();

  return newTask;
};

// Function to update a template task
export const updateTemplateTask = async (
  templateId: string,
  taskId: string,
  updates: Partial<TemplateTask>
): Promise<TemplateTask> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const templateIndex = mockData.templates.findIndex(t => t.id === templateId);
  if (templateIndex === -1) {
    throw new Error('Template not found');
  }

  const taskIndex = mockData.templates[templateIndex].tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }

  mockData.templates[templateIndex].tasks[taskIndex] = {
    ...mockData.templates[templateIndex].tasks[taskIndex],
    ...updates
  };

  mockData.templates[templateIndex].lastEdited = new Date().toISOString();

  return mockData.templates[templateIndex].tasks[taskIndex];
};

// Function to delete a template task
export const deleteTemplateTask = async (templateId: string, taskId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const templateIndex = mockData.templates.findIndex(t => t.id === templateId);
  if (templateIndex === -1) {
    throw new Error('Template not found');
  }

  const taskIndex = mockData.templates[templateIndex].tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }

  mockData.templates[templateIndex].tasks.splice(taskIndex, 1);
  
  // Reposition remaining tasks
  mockData.templates[templateIndex].tasks.forEach((task, idx) => {
    task.position = idx;
  });

  mockData.templates[templateIndex].lastEdited = new Date().toISOString();
};

// Function to reorder template tasks
export const reorderTemplateTasks = async (
  templateId: string,
  taskIds: string[]
): Promise<TemplateTask[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const templateIndex = mockData.templates.findIndex(t => t.id === templateId);
  if (templateIndex === -1) {
    throw new Error('Template not found');
  }

  const template = mockData.templates[templateIndex];
  
  // Create a new array of tasks in the specified order
  const reorderedTasks = taskIds.map((taskId, index) => {
    const task = template.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }
    return { ...task, position: index };
  });

  // Update template tasks
  template.tasks = reorderedTasks;
  template.lastEdited = new Date().toISOString();

  return reorderedTasks;
};

// Function to fetch all clients
export const fetchClients = async (): Promise<Client[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData.clients;
};

// Function to fetch a single client by ID
export const fetchClient = async (id: string): Promise<Client | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData.clients.find(client => client.id === id);
};

// Function to create a client
export const createClient = async (clientData: CreateClientFormData): Promise<Client> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const newClient: Client = {
    id: `client-${Date.now()}`,
    ...clientData,
    lastEdited: new Date().toISOString()
  };

  mockData.clients.push(newClient);
  return newClient;
};

// Function to fetch all team members
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData.teamMembers;
};

// Function to get client projects
export const getClientProjects = async (clientId: string): Promise<Project[]> => {
   // Simulate API delay
   await new Promise(resolve => setTimeout(resolve, 500));
   return mockData.projects.filter(project => project.clientId === clientId);
};

// Function to get client templates
export const getClientTemplates = async (clientId: string): Promise<Template[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData.templates.filter(template => template.clientIds?.includes(clientId));
};

// Function to create a new contact
export const createContact = async (contactData: CreateContactFormData): Promise<Contact> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const newContact: Contact = {
    id: `contact-${Date.now()}`, // Generate a unique ID
    ...contactData,
    lastEdited: new Date().toISOString(),
  };

  mockData.contacts.push(newContact);
  return newContact;
};

// Function to fetch all contacts
export const fetchContacts = async (): Promise<Contact[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData.contacts;
};

// Function to fetch client contacts
export const fetchClientContacts = async (clientId: string): Promise<Contact[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockData.contacts.filter(contact => contact.clientId === clientId);
};

// Function to associate a contact with a client
export const associateContactWithClient = async ({ contactId, clientId }: { contactId: string, clientId: string }): Promise<Contact> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const contactIndex = mockData.contacts.findIndex(contact => contact.id === contactId);
  if (contactIndex === -1) {
    throw new Error('Contact not found');
  }
  
  // Update the contact with the client ID
  mockData.contacts[contactIndex] = {
    ...mockData.contacts[contactIndex],
    clientId,
  };
  
  return mockData.contacts[contactIndex];
};

// Function to remove a contact from a client
export const removeContactFromClient = async ({ contactId, clientId }: { contactId: string, clientId: string }): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const contactIndex = mockData.contacts.findIndex(contact => contact.id === contactId);
  if (contactIndex === -1) {
    throw new Error('Contact not found');
  }
  
  // Make sure the contact belongs to this client
  if (mockData.contacts[contactIndex].clientId !== clientId) {
    throw new Error('Contact does not belong to this client');
  }
  
  // Remove the client association
  mockData.contacts[contactIndex] = {
    ...mockData.contacts[contactIndex],
    clientId: undefined,
    isPrimaryContact: false,
  };
};

// Function to update a client
export const updateClient = async (client: Client): Promise<Client> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const clientIndex = mockData.clients.findIndex(c => c.id === client.id);
  if (clientIndex === -1) {
    throw new Error('Client not found');
  }
  
  // Update the client
  mockData.clients[clientIndex] = {
    ...mockData.clients[clientIndex],
    ...client,
    lastEdited: new Date().toISOString(),
  };
  
  return mockData.clients[clientIndex];
};

// Mock function to get client series (empty for now)
export const getClientSeries = async (clientId: string): Promise<any[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // This is a mock function that would typically fetch series for a client
  // For now, we'll return an empty array since the series feature is not fully implemented
  return [];
};

// Function to fetch comments for a project
export const fetchComments = async (projectId: string): Promise<Comment[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get comments for the project
  const comments = mockData.comments.filter(comment => comment.projectId === projectId) || [];
  return comments;
};

// Function to create a comment
export const createComment = async (projectId: string, content: string): Promise<Comment> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For simplicity, we'll assume the current user is user-1
  const authorId = 'user-1';
  
  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    projectId,
    authorId,
    content,
    createdAt: new Date().toISOString()
  };
  
  mockData.comments.push(newComment);
  return newComment;
};

// Function to fetch a single contact by ID
export const fetchContact = async (id: string): Promise<Contact | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData.contacts.find(contact => contact.id === id);
};
