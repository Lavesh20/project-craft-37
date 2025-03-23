
import { Project, Task, Template, Client, TeamMember, Contact, Comment } from '@/types';

// Initialize empty arrays to hold our mock data
const projects: Project[] = [];
const tasks: Task[] = [];
const templates: Template[] = [];
const clients: Client[] = [];
const teamMembers: TeamMember[] = [];
const contacts: Contact[] = [];
const comments: Comment[] = [];

// Add some initial team members
teamMembers.push(
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Manager'
  },
  {
    id: 'user-3',
    name: 'Vyas',
    email: 'vyas@example.com',
    role: 'Accountant'
  }
);

// Add some initial clients
clients.push(
  {
    id: 'client-1',
    name: 'Acme Corporation',
    description: 'A leading widget manufacturer',
    primaryContactName: 'John Contact',
    location: 'New York, NY',
    website: 'https://acmecorp.example.com',
    assigneeId: 'user-1',
    priority: 'High',
    services: ['Accounting - Quarter-End Close', 'Accounting - Year-End Close'],
    isActive: true
  },
  {
    id: 'client-2',
    name: 'Smith & Co',
    description: 'Boutique consulting firm',
    primaryContactName: 'Jane Client',
    location: 'Chicago, IL',
    website: 'https://smithco.example.com',
    assigneeId: 'user-2',
    priority: 'Medium',
    services: ['Web Development', 'Web Design'],
    isActive: true
  },
  {
    id: 'client-3',
    name: 'Tech Innovations',
    description: 'Startup developing cutting-edge tech solutions',
    location: 'San Francisco, CA',
    website: 'https://techinnovations.example.com',
    assigneeId: 'user-3',
    priority: 'Low',
    services: ['Consulting', 'Mobile Apps'],
    isActive: false
  }
);

// Add some initial projects
projects.push(
  {
    id: 'project-1',
    name: 'Quarterly Financial Review',
    description: 'Comprehensive financial review for Q1 2023',
    clientId: 'client-1',
    assigneeId: 'user-1',
    teamMemberIds: ['user-1', 'user-3'],
    status: 'In Progress',
    dueDate: '2023-07-30',
    lastEdited: '2023-06-15T10:30:00Z',
    lastEditedBy: 'user-1',
    repeating: true,
    frequency: 'Quarterly',
    labels: ['Finance', 'Q1']
  },
  {
    id: 'project-2',
    name: 'Website Redesign',
    description: 'Complete overhaul of corporate website',
    clientId: 'client-2',
    assigneeId: 'user-2',
    teamMemberIds: ['user-2'],
    status: 'Not Started',
    dueDate: '2023-09-15',
    lastEdited: '2023-06-10T14:45:00Z',
    repeating: false,
    labels: ['Web Design', 'Marketing']
  },
  {
    id: 'project-3',
    name: 'Tax Preparation',
    description: 'Preparation of annual tax returns',
    clientId: 'client-3',
    assigneeId: 'user-3',
    teamMemberIds: ['user-1', 'user-3'],
    status: 'Complete',
    dueDate: '2023-04-15',
    lastEdited: '2023-04-10T09:15:00Z',
    repeating: true,
    frequency: 'Yearly',
    labels: ['Tax', '2023']
  }
);

// Add some initial tasks for projects
tasks.push(
  {
    id: 'task-1',
    projectId: 'project-1',
    name: 'Collect financial data',
    description: 'Gather all relevant financial statements and reports',
    assigneeId: 'user-1',
    status: 'Complete',
    dueDate: '2023-07-15',
    position: 0,
    lastEdited: '2023-07-10T11:30:00Z',
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    name: 'Analyze revenue trends',
    description: 'Review and analyze revenue patterns for Q1',
    assigneeId: 'user-3',
    status: 'In Progress',
    dueDate: '2023-07-20',
    position: 1,
    lastEdited: '2023-07-12T14:20:00Z',
  },
  {
    id: 'task-3',
    projectId: 'project-1',
    name: 'Prepare final report',
    description: 'Compile findings into comprehensive report',
    assigneeId: 'user-1',
    status: 'Not Started',
    dueDate: '2023-07-28',
    position: 2,
    lastEdited: '2023-07-05T09:45:00Z',
  },
  {
    id: 'task-4',
    projectId: 'project-2',
    name: 'Wireframe creation',
    description: 'Design initial wireframes for website',
    assigneeId: 'user-2',
    status: 'Not Started',
    dueDate: '2023-08-01',
    position: 0,
    lastEdited: '2023-06-25T10:15:00Z',
  }
);

// Add some initial templates
templates.push(
  {
    id: 'template-1',
    name: 'Quarterly Financial Review',
    description: 'Standard process for quarterly financial reviews',
    teamMemberIds: ['user-1', 'user-3'],
    clientIds: ['client-1'],
    tasks: [
      {
        id: 'template-task-1',
        templateId: 'template-1',
        name: 'Collect financial data',
        description: 'Gather all relevant financial statements and reports',
        position: 0,
        relativeDueDate: { value: 14, unit: 'days', position: 'before' },
        timeEstimate: { value: 4, unit: 'h' },
        assigneeId: 'user-1'
      },
      {
        id: 'template-task-2',
        templateId: 'template-1',
        name: 'Analyze revenue trends',
        description: 'Review and analyze revenue patterns',
        position: 1,
        relativeDueDate: { value: 7, unit: 'days', position: 'before' },
        timeEstimate: { value: 6, unit: 'h' },
        assigneeId: 'user-3'
      },
      {
        id: 'template-task-3',
        templateId: 'template-1',
        name: 'Prepare final report',
        description: 'Compile findings into comprehensive report',
        position: 2,
        relativeDueDate: { value: 2, unit: 'days', position: 'before' },
        timeEstimate: { value: 8, unit: 'h' },
        assigneeId: 'user-1'
      }
    ],
    lastEdited: '2023-05-10T13:30:00Z'
  },
  {
    id: 'template-2',
    name: 'Website Development',
    description: 'Standard process for website development projects',
    teamMemberIds: ['user-2'],
    clientIds: ['client-2'],
    tasks: [
      {
        id: 'template-task-4',
        templateId: 'template-2',
        name: 'Requirements gathering',
        position: 0,
        relativeDueDate: { value: 30, unit: 'days', position: 'before' },
        timeEstimate: { value: 6, unit: 'h' },
        assigneeId: 'user-2'
      },
      {
        id: 'template-task-5',
        templateId: 'template-2',
        name: 'Design mockups',
        position: 1,
        relativeDueDate: { value: 20, unit: 'days', position: 'before' },
        timeEstimate: { value: 12, unit: 'h' },
        assigneeId: 'user-2'
      }
    ],
    lastEdited: '2023-04-15T09:45:00Z'
  }
);

// Add some initial contacts
contacts.push(
  {
    id: 'contact-1',
    name: 'John Contact',
    email: 'john.contact@acmecorp.example.com',
    phone: '555-123-4567',
    clientId: 'client-1',
    isPrimaryContact: true,
    lastEdited: '2023-05-20T11:30:00Z'
  },
  {
    id: 'contact-2',
    name: 'Sarah Manager',
    email: 'sarah.manager@acmecorp.example.com',
    phone: '555-987-6543',
    clientId: 'client-1',
    lastEdited: '2023-05-22T14:45:00Z'
  },
  {
    id: 'contact-3',
    name: 'Jane Client',
    email: 'jane.client@smithco.example.com',
    phone: '555-567-8901',
    clientId: 'client-2',
    isPrimaryContact: true,
    lastEdited: '2023-05-18T10:15:00Z'
  }
);

// Add some initial comments
comments = [
  {
    id: 'comment-1',
    projectId: 'project-1',
    authorId: 'user-1',
    content: 'Let\'s make sure we have all the financial statements by next week.',
    createdAt: '2023-06-20T09:30:00Z'
  },
  {
    id: 'comment-2',
    projectId: 'project-1',
    authorId: 'user-3',
    content: 'I\'ve started analyzing the Q1 numbers and found some interesting trends.',
    createdAt: '2023-06-22T14:15:00Z'
  },
  {
    id: 'comment-3',
    projectId: 'project-2',
    authorId: 'user-2',
    content: 'Initial wireframes are ready for review. Let me know your thoughts!',
    createdAt: '2023-06-25T11:45:00Z'
  }
];

// Export all the mock data
export const mockData = {
  projects,
  tasks,
  templates,
  clients,
  teamMembers,
  contacts,
  comments
};
