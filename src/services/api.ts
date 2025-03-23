import { mockData } from './mockData';
import { Project, Task, Template, Client, TeamMember, Contact, CreateProjectFormData, CreateTemplateFormData, CreateContactFormData } from '@/types';

// Function to fetch all projects
export const fetchProjects = async (): Promise<Project[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData.projects;
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
    teamMemberIds: [],
    status: 'Not Started',
    lastEdited: new Date().toISOString(),
    repeating: false,
    labels: [],
  };

  mockData.projects.push(newProject);
  return newProject;
};

// Function to update a project
export const updateProject = async (updatedProject: Project): Promise<Project> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const index = mockData.projects.findIndex(project => project.id === updatedProject.id);
  if (index !== -1) {
    mockData.projects[index] = { ...updatedProject, lastEdited: new Date().toISOString() };
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
    teamMemberIds: [],
    clientIds: [],
    tasks: [],
    lastEdited: new Date().toISOString(),
  };

  mockData.templates.push(newTemplate);
  return newTemplate;
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

// New function to fetch client contacts
export const fetchClientContacts = async (clientId: string): Promise<Contact[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockData.contacts.filter(contact => contact.clientId === clientId);
};

// New function to associate a contact with a client
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

// New function to remove a contact from a client
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

// New function to update a client
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
