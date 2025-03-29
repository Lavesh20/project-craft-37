import { v4 as uuidv4 } from 'uuid';
import { 
  Project, 
  Client, 
  Contact, 
  Task, 
  Template, 
  Comment, 
  TeamMember,
  CreateClientFormData,
  CreateContactFormData,
  CreateTaskFormData,
  TasksByStatus,
  TasksByProject,
  Series,
  MyWorkTask
} from '@/types';

// Mock data storage
let projects: Project[] = [
  {
    id: 'project-1',
    name: 'Annual Tax Filing',
    description: 'Complete annual tax filing for client',
    clientId: 'client-1',
    status: 'In Progress',
    dueDate: '2023-12-15',
    startDate: '2023-11-01',
    assigneeId: 'user-1',
    teamMemberIds: ['user-1', 'user-2'],
    tasks: [
      {
        id: 'task-1',
        name: 'Gather tax documents',
        description: 'Collect all relevant tax documents from client',
        status: 'Complete',
        dueDate: '2023-11-15',
        projectId: 'project-1',
        clientId: 'client-1',
      },
      {
        id: 'task-2',
        name: 'Review financial statements',
        description: 'Analyze financial statements for discrepancies',
        status: 'In Progress',
        dueDate: '2023-11-25',
        projectId: 'project-1',
        clientId: 'client-1',
      },
      {
        id: 'task-3',
        name: 'Prepare tax return',
        description: 'Complete and file tax return',
        status: 'Not Started',
        dueDate: '2023-12-10',
        projectId: 'project-1',
        clientId: 'client-1',
      }
    ],
    lastEdited: '2023-11-10T14:30:00Z',
    lastEditedBy: 'user-1',
  },
  {
    id: 'project-2',
    name: 'Quarterly Bookkeeping',
    description: 'Q4 bookkeeping for client',
    clientId: 'client-2',
    status: 'Not Started',
    dueDate: '2023-12-20',
    assigneeId: 'user-2',
    teamMemberIds: ['user-2'],
    tasks: [
      {
        id: 'task-4',
        name: 'Reconcile accounts',
        description: 'Reconcile all accounts for Q4',
        status: 'Not Started',
        dueDate: '2023-12-15',
        projectId: 'project-2',
        clientId: 'client-2',
      }
    ],
    lastEdited: '2023-11-08T09:15:00Z',
    lastEditedBy: 'user-2',
  },
  {
    id: 'project-3',
    name: 'Financial Audit',
    description: 'Complete financial audit for client',
    clientId: 'client-3',
    status: 'Complete',
    dueDate: '2023-11-10',
    startDate: '2023-10-01',
    assigneeId: 'user-3',
    teamMemberIds: ['user-1', 'user-3'],
    tasks: [
      {
        id: 'task-5',
        name: 'Complete audit checklist',
        description: 'Go through all audit checklist items',
        status: 'Complete',
        dueDate: '2023-10-25',
        projectId: 'project-3',
        clientId: 'client-3',
      }
    ],
    templateId: 'template-1',
    lastEdited: '2023-11-10T10:45:00Z',
    lastEditedBy: 'user-3',
  }
];

let clients: Client[] = [
  {
    id: 'client-1',
    name: 'Acme Corporation',
    description: 'Technology company focused on innovative solutions',
    location: 'New York, NY',
    website: 'https://www.acmecorp.com',
    assigneeId: 'user-1',
    priority: 'High',
    services: ['tax-preparation', 'bookkeeping'],
    isActive: true,
    createdAt: '2023-01-15T10:30:00Z',
    lastEdited: '2023-10-20T14:15:00Z',
  },
  {
    id: 'client-2',
    name: 'Global Enterprises',
    description: 'International trading and logistics company',
    location: 'Chicago, IL',
    website: 'https://www.globalenterprises.com',
    assigneeId: 'user-2',
    priority: 'Medium',
    services: ['bookkeeping', 'payroll'],
    isActive: true,
    createdAt: '2023-03-22T09:45:00Z',
    lastEdited: '2023-09-15T11:30:00Z',
  },
  {
    id: 'client-3',
    name: 'Smith & Associates',
    description: 'Legal consulting firm',
    location: 'Los Angeles, CA',
    website: 'https://www.smithassociates.com',
    assigneeId: 'user-3',
    priority: 'Low',
    services: ['financial-planning', 'tax-preparation'],
    isActive: true,
    createdAt: '2023-05-10T15:20:00Z',
    lastEdited: '2023-10-05T16:45:00Z',
  }
];

let contacts: Contact[] = [
  {
    id: 'contact-1',
    name: 'John Smith',
    email: 'john.smith@acmecorp.com',
    phone: '(212) 555-1234',
    street: '123 Broadway',
    city: 'New York',
    state: 'NY',
    postalCode: '10007',
    clientId: 'client-1',
    isPrimaryContact: true,
    createdAt: '2023-01-15T11:00:00Z',
  },
  {
    id: 'contact-2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@globalenterprises.com',
    phone: '(312) 555-6789',
    street: '456 Michigan Ave',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60611',
    clientId: 'client-2',
    isPrimaryContact: true,
    createdAt: '2023-03-22T10:15:00Z',
  },
  {
    id: 'contact-3',
    name: 'Michael Williams',
    email: 'michael.williams@smithassociates.com',
    phone: '(323) 555-4321',
    street: '789 Wilshire Blvd',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90017',
    clientId: 'client-3',
    isPrimaryContact: true,
    createdAt: '2023-05-10T16:00:00Z',
  },
  {
    id: 'contact-4',
    name: 'Emily Davis',
    email: 'emily.davis@acmecorp.com',
    phone: '(212) 555-5678',
    clientId: 'client-1',
    isPrimaryContact: false,
    createdAt: '2023-02-10T14:30:00Z',
  }
];

let templates: Template[] = [
  {
    id: 'template-1',
    name: 'Annual Audit',
    description: 'Template for conducting annual financial audits',
    tasks: [
      {
        id: 'temp-task-1',
        name: 'Initial client meeting',
        description: 'Set up initial meeting to discuss audit scope and expectations',
        relativeDueDate: 0,
      },
      {
        id: 'temp-task-2',
        name: 'Document collection',
        description: 'Gather all necessary financial documents',
        relativeDueDate: 7,
      },
      {
        id: 'temp-task-3',
        name: 'Financial analysis',
        description: 'Analyze financial statements and records',
        relativeDueDate: 14,
      },
      {
        id: 'temp-task-4',
        name: 'Prepare audit report',
        description: 'Compile findings into comprehensive audit report',
        relativeDueDate: 21,
      },
      {
        id: 'temp-task-5',
        name: 'Client review meeting',
        description: 'Review audit findings with client',
        relativeDueDate: 28,
      }
    ],
    category: 'Audit',
    createdAt: '2023-01-05T09:00:00Z',
    lastEdited: '2023-09-20T11:15:00Z',
  },
  {
    id: 'template-2',
    name: 'Tax Return Preparation',
    description: 'Template for personal and business tax return preparation',
    tasks: [
      {
        id: 'temp-task-6',
        name: 'Client intake',
        description: 'Collect client information and tax documents',
        relativeDueDate: 0,
      },
      {
        id: 'temp-task-7',
        name: 'Document review',
        description: 'Review tax documents for completeness',
        relativeDueDate: 3,
      },
      {
        id: 'temp-task-8',
        name: 'Tax return preparation',
        description: 'Prepare tax return forms',
        relativeDueDate: 7,
      },
      {
        id: 'temp-task-9',
        name: 'Quality review',
        description: 'Perform quality check on completed tax return',
        relativeDueDate: 10,
      },
      {
        id: 'temp-task-10',
        name: 'Client review and filing',
        description: 'Review return with client and file',
        relativeDueDate: 14,
      }
    ],
    category: 'Tax',
    createdAt: '2023-02-10T14:30:00Z',
    lastEdited: '2023-10-15T16:45:00Z',
  }
];

let teamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Jane Doe',
    email: 'jane.doe@jetpackworkflow.com',
    role: 'Senior Accountant',
  },
  {
    id: 'user-2',
    name: 'John Smith',
    email: 'john.smith@jetpackworkflow.com',
    role: 'Tax Specialist',
  },
  {
    id: 'user-3',
    name: 'Vyas',
    email: 'vyas@jetpackworkflow.com',
    role: 'Audit Manager',
  }
];

let comments: Comment[] = [
  {
    id: 'comment-1',
    projectId: 'project-1',
    authorId: 'user-1',
    content: 'Client has requested an extension for submitting their tax documents. We\'ll need to adjust our timeline.',
    createdAt: '2023-11-05T10:30:00Z',
  },
  {
    id: 'comment-2',
    projectId: 'project-1',
    authorId: 'user-2',
    content: 'I\'ve reviewed the initial documents. There are some discrepancies in the Q3 financials that we need to address.',
    createdAt: '2023-11-07T14:15:00Z',
  },
  {
    id: 'comment-3',
    projectId: 'project-3',
    authorId: 'user-3',
    content: 'Audit completed successfully. Client has approved all findings and recommendations.',
    createdAt: '2023-11-08T16:45:00Z',
  }
];

// Introduce a delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Helper Functions
export const fetchProjects = async (): Promise<Project[]> => {
  await delay(500);
  return [...projects];
};

export const fetchProject = async (id: string): Promise<Project> => {
  await delay(500);
  const project = projects.find(p => p.id === id);
  if (!project) {
    throw new Error(`Project with ID ${id} not found`);
  }
  return { ...project };
};

export const createProject = async (projectData: Partial<Project>): Promise<Project> => {
  await delay(500);
  const newProject: Project = {
    id: uuidv4(),
    name: projectData.name || 'New Project',
    description: projectData.description || '',
    clientId: projectData.clientId || '',
    status: projectData.status || 'Not Started',
    dueDate: projectData.dueDate || new Date().toISOString(),
    startDate: projectData.startDate,
    assigneeId: projectData.assigneeId,
    teamMemberIds: projectData.teamMemberIds || [],
    tasks: projectData.tasks || [],
    templateId: projectData.templateId,
    lastEdited: new Date().toISOString(),
    lastEditedBy: 'user-1', // Assuming current user
  };
  
  projects.push(newProject);
  return { ...newProject };
};

export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
  await delay(500);
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Project with ID ${id} not found`);
  }
  
  const updatedProject = {
    ...projects[index],
    ...projectData,
    lastEdited: new Date().toISOString(),
  };
  
  projects[index] = updatedProject;
  return { ...updatedProject };
};

export const deleteProject = async (id: string): Promise<void> => {
  await delay(500);
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Project with ID ${id} not found`);
  }
  
  projects.splice(index, 1);
};

export const fetchClients = async (): Promise<Client[]> => {
  await delay(500);
  return [...clients];
};

export const fetchClient = async (id: string): Promise<Client> => {
  await delay(500);
  const client = clients.find(c => c.id === id);
  if (!client) {
    throw new Error(`Client with ID ${id} not found`);
  }
  return { ...client };
};

export const createClient = async (clientData: CreateClientFormData): Promise<Client> => {
  await delay(500);
  const newClient: Client = {
    id: uuidv4(),
    name: clientData.name,
    description: clientData.description || '',
    location: clientData.location || '',
    website: clientData.website || '',
    assigneeId: clientData.assigneeId,
    priority: clientData.priority || 'None',
    services: clientData.services || [],
    isActive: clientData.isActive !== undefined ? clientData.isActive : true,
    createdAt: new Date().toISOString(),
    lastEdited: new Date().toISOString(),
  };
  
  clients.push(newClient);
  
  // If primaryContactName is provided, create a contact
  if (clientData.primaryContactName) {
    const newContact: Contact = {
      id: uuidv4(),
      name: clientData.primaryContactName,
      email: `${clientData.primaryContactName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      clientId: newClient.id,
      isPrimaryContact: true,
      createdAt: new Date().toISOString(),
    };
    
    contacts.push(newContact);
  }
  
  return { ...newClient };
};

export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
  await delay(500);
  const index = clients.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Client with ID ${id} not found`);
  }
  
  const updatedClient = {
    ...clients[index],
    ...clientData,
    lastEdited: new Date().toISOString(),
  };
  
  clients[index] = updatedClient;
  return { ...updatedClient };
};

export const deleteClient = async (id: string): Promise<void> => {
  await delay(500);
  const index = clients.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Client with ID ${id} not found`);
  }
  
  clients.splice(index, 1);
  
  // Remove associated contacts
  contacts = contacts.filter(contact => contact.clientId !== id);
  
  // Remove or update associated projects
  projects = projects.filter(project => project.clientId !== id);
};

export const fetchContacts = async (): Promise<Contact[]> => {
  await delay(500);
  return [...contacts];
};

export const fetchContact = async (id: string): Promise<Contact> => {
  await delay(500);
  const contact = contacts.find(c => c.id === id);
  if (!contact) {
    throw new Error(`Contact with ID ${id} not found`);
  }
  return { ...contact };
};

export const createContact = async (contactData: CreateContactFormData): Promise<Contact> => {
  await delay(500);
  
  // If this is a primary contact for a client, update existing contacts
  if (contactData.clientId && contactData.isPrimaryContact) {
    contacts = contacts.map(contact => {
      if (contact.clientId === contactData.clientId && contact.isPrimaryContact) {
        return { ...contact, isPrimaryContact: false };
      }
      return contact;
    });
  }
  
  const newContact: Contact = {
    id: uuidv4(),
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone || '',
    street: contactData.street || '',
    city: contactData.city || '',
    state: contactData.state || '',
    postalCode: contactData.postalCode || '',
    clientId: contactData.clientId,
    isPrimaryContact: contactData.isPrimaryContact || false,
    createdAt: new Date().toISOString(),
  };
  
  contacts.push(newContact);
  return { ...newContact };
};

export const updateContact = async (id: string, contactData: Partial<Contact>): Promise<Contact> => {
  await delay(500);
  const index = contacts.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Contact with ID ${id} not found`);
  }
  
  // If updating to primary contact, update other contacts
  if (contactData.clientId && contactData.isPrimaryContact) {
    contacts = contacts.map(contact => {
      if (contact.id !== id && contact.clientId === contactData.clientId && contact.isPrimaryContact) {
        return { ...contact, isPrimaryContact: false };
      }
      return contact;
    });
  }
  
  const updatedContact = {
    ...contacts[index],
    ...contactData,
  };
  
  contacts[index] = updatedContact;
  return { ...updatedContact };
};

export const deleteContact = async (id: string): Promise<void> => {
  await delay(500);
  const index = contacts.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Contact with ID ${id} not found`);
  }
  
  contacts.splice(index, 1);
};

export const fetchClientContacts = async (clientId: string): Promise<Contact[]> => {
  await delay(500);
  return contacts.filter(contact => contact.clientId === clientId);
};

export const associateContactWithClient = async ({ contactId, clientId }: { contactId: string; clientId: string }): Promise<void> => {
  await delay(500);
  const contactIndex = contacts.findIndex(c => c.id === contactId);
  if (contactIndex === -1) {
    throw new Error(`Contact with ID ${contactId} not found`);
  }
  
  contacts[contactIndex] = {
    ...contacts[contactIndex],
    clientId,
  };
};

export const removeContactFromClient = async ({ contactId, clientId }: { contactId: string; clientId: string }): Promise<void> => {
  await delay(500);
  const contactIndex = contacts.findIndex(c => c.id === contactId && c.clientId === clientId);
  if (contactIndex === -1) {
    throw new Error(`Contact with ID ${contactId} not associated with client ${clientId}`);
  }
  
  contacts[contactIndex] = {
    ...contacts[contactIndex],
    clientId: undefined,
    isPrimaryContact: false,
  };
};

export const fetchTemplates = async (): Promise<Template[]> => {
  await delay(500);
  return [...templates];
};

export const fetchTemplate = async (id: string): Promise<Template> => {
  await delay(500);
  const template = templates.find(t => t.id === id);
  if (!template) {
    throw new Error(`Template with ID ${id} not found`);
  }
  return { ...template };
};

export const createTemplate = async (templateData: Partial<Template>): Promise<Template> => {
  await delay(500);
  const newTemplate: Template = {
    id: uuidv4(),
    name: templateData.name || 'New Template',
    description: templateData.description || '',
    tasks: templateData.tasks || [],
    category: templateData.category,
    createdAt: new Date().toISOString(),
    lastEdited: new Date().toISOString(),
  };
  
  templates.push(newTemplate);
  return { ...newTemplate };
};

export const updateTemplate = async (id: string, templateData: Partial<Template>): Promise<Template> => {
  await delay(500);
  const index = templates.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error(`Template with ID ${id} not found`);
  }
  
  const updatedTemplate = {
    ...templates[index],
    ...templateData,
    lastEdited: new Date().toISOString(),
  };
  
  templates[index] = updatedTemplate;
  return { ...updatedTemplate };
};

export const deleteTemplate = async (id: string): Promise<void> => {
  await delay(500);
  const index = templates.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error(`Template with ID ${id} not found`);
  }
  
  templates.splice(index, 1);
};

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  await delay(500);
  return [...teamMembers];
};

export const fetchComments = async (projectId: string): Promise<Comment[]> => {
  await delay(500);
  return comments.filter(comment => comment.projectId === projectId);
};

export const createComment = async (projectId: string, content: string): Promise<Comment> => {
  await delay(500);
  const newComment: Comment = {
    id: uuidv4(),
    projectId,
    authorId: 'user-1', // Assuming current user
    content,
    createdAt: new Date().toISOString(),
  };
  
  comments.push(newComment);
  return { ...newComment };
};

export const getClientProjects = async (clientId: string): Promise<Project[]> => {
  await delay(500);
  return projects.filter(project => project.clientId === clientId);
};

export const getClientSeries = async (clientId: string): Promise<Series[]> => {
  await delay(500);
  // Typically this would fetch from an API, but we'll mock some data
  return [
    {
      id: 'series-1',
      name: 'Monthly Bookkeeping',
      frequency: 'Monthly',
      templateId: 'template-2',
      templateName: 'Bookkeeping Template',
    },
    {
      id: 'series-2',
      name: 'Quarterly Tax Filing',
      frequency: 'Quarterly',
      templateId: 'template-1',
      templateName: 'Tax Filing Template',
    },
  ];
};

export const getMyOverdueTasks = async (): Promise<MyWorkTask[]> => {
  await delay(500);
  const today = new Date();
  const overdueTasks: MyWorkTask[] = [];

  // Collect tasks from all projects that are overdue
  projects.forEach(project => {
    const clientName = clients.find(c => c.id === project.clientId)?.name;
    
    project.tasks?.forEach(task => {
      const taskDueDate = new Date(task.dueDate);
      
      if (taskDueDate < today && task.status !== 'Complete') {
        overdueTasks.push({
          ...task,
          projectName: project.name,
          clientName,
        });
      }
    });
  });

  return overdueTasks;
};

export const getMyTasksByStatus = async (dateStr: string): Promise<TasksByStatus> => {
  await delay(500);
  const tasksByStatus: TasksByStatus = {
    'Not Started': [],
    'In Progress': [],
    'Complete': [],
  };

  projects.forEach(project => {
    const clientName = clients.find(c => c.id === project.clientId)?.name;
    
    project.tasks?.forEach(task => {
      tasksByStatus[task.status].push({
        ...task,
        projectName: project.name,
        clientName,
      });
    });
  });

  return tasksByStatus;
};

export const getMyTasksByProject = async (dateStr: string): Promise<TasksByProject> => {
  await delay(500);
  const tasksByProject: TasksByProject = {};

  projects.forEach(project => {
    const clientName = clients.find(c => c.id === project.clientId)?.name;
    
    if (project.tasks && project.tasks.length > 0) {
      tasksByProject[project.id] = {
        projectId: project.id,
        projectName: project.name,
        clientName,
        tasks: project.tasks.map(task => ({
          ...task,
          projectName: project.name,
          clientName,
        })),
      };
    }
  });

  return tasksByProject;
};

export const createTask = async (taskData: CreateTaskFormData): Promise<Task> => {
  await delay(500);
  const newTask: Task = {
    id: uuidv4(),
    name: taskData.name,
    description: taskData.description || '',
    status: 'Not Started',
    assigneeId: taskData.assigneeId,
    dueDate: taskData.dueDate,
    projectId: taskData.projectId || '',
    position: Math.max(0, ...projects.flatMap(p => p.tasks?.map(t => t.position) || [0])) + 1,
    lastEdited: new Date().toISOString()
  };
  
  // Find project and add task
  const projectIndex = projects.findIndex(p => p.id === taskData.projectId);
  if (projectIndex !== -1) {
    if (!projects[projectIndex].tasks) {
      projects[projectIndex].tasks = [];
    }
    projects[projectIndex].tasks?.push(newTask);
  }
  
  return { ...newTask };
};

export const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
  await delay(500);
  let updatedTask: Task | undefined;
  
  // Find the task in all projects
  for (let i = 0; i < projects.length; i++) {
    if (!projects[i].tasks) continue;
    
    const taskIndex = projects[i].tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      updatedTask = {
        ...projects[i].tasks[taskIndex],
        ...taskData,
        lastEdited: new Date().toISOString()
      };
      
      projects[i].tasks[taskIndex] = updatedTask;
      break;
    }
  }
  
  if (!updatedTask) {
    throw new Error(`Task with ID ${id} not found`);
  }
  
  return { ...updatedTask };
};

export const deleteTask = async (id: string): Promise<void> => {
  await delay(500);
  let found = false;
  
  // Find and remove the task from its project
  for (let i = 0; i < projects.length; i++) {
    if (!projects[i].tasks) continue;
    
    const taskIndex = projects[i].tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      projects[i].tasks.splice(taskIndex, 1);
      found = true;
      break;
    }
  }
  
  if (!found) {
    throw new Error(`Task with ID ${id} not found`);
  }
};

export const getTasks = async (): Promise<Task[]> => {
  await delay(500);
  return projects.flatMap(project => project.tasks || []);
};

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  await delay(500);
  return fetchTeamMembers();
};

export const getClientTemplates = async (clientId: string): Promise<Template[]> => {
  await delay(500);
  return templates.filter(template => 
    template.clientId === clientId || 
    (template.clientIds && template.clientIds.includes(clientId))
  );
};
