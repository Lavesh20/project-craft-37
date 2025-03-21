import { Project, Task, Template, TemplateTask, Client, TeamMember } from '@/types';

const projects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    clientId: '101',
    teamMemberIds: ['102', '103'],
    status: 'In Progress',
    dueDate: '2024-03-15',
    lastEdited: '2024-02-01',
    repeating: false,
  },
  {
    id: '2',
    name: 'Mobile App Development',
    clientId: '102',
    teamMemberIds: ['101', '104'],
    status: 'Complete',
    dueDate: '2024-02-28',
    lastEdited: '2024-02-05',
    repeating: true,
    frequency: 'Monthly',
  },
  {
    id: '3',
    name: 'SEO Optimization',
    clientId: '103',
    teamMemberIds: ['102', '103'],
    status: 'Not Started',
    dueDate: '2024-04-01',
    lastEdited: '2024-02-10',
    repeating: true,
    frequency: 'Weekly',
  },
];

const tasks: Task[] = [
  {
    id: '1',
    projectId: '1',
    name: 'Design Mockups',
    status: 'Complete',
    dueDate: '2024-02-01',
    position: 1,
    lastEdited: '2024-01-25',
  },
  {
    id: '2',
    projectId: '1',
    name: 'Front-end Development',
    status: 'In Progress',
    dueDate: '2024-02-15',
    position: 2,
    lastEdited: '2024-02-01',
  },
  {
    id: '3',
    projectId: '2',
    name: 'User Interface Design',
    status: 'Complete',
    dueDate: '2024-01-15',
    position: 1,
    lastEdited: '2024-01-10',
  },
  {
    id: '4',
    projectId: '2',
    name: 'Back-end Development',
    status: 'Complete',
    dueDate: '2024-02-10',
    position: 2,
    lastEdited: '2024-02-01',
  },
];

const templates: Template[] = [
  {
    id: '1',
    name: 'New Website Template',
    teamMemberIds: ['101', '102'],
    clientIds: ['201'],
    tasks: [
      {
        id: '1',
        templateId: '1',
        name: 'Initial Design',
        relativeDueDate: { value: 7, unit: 'days', position: 'after' },
        timeEstimate: { value: 2, unit: 'h' },
        position: 1,
      },
      {
        id: '2',
        templateId: '1',
        name: 'Content Creation',
        relativeDueDate: { value: 14, unit: 'days', position: 'after' },
        timeEstimate: { value: 4, unit: 'h' },
        position: 2,
      },
    ],
    lastEdited: '2024-02-01',
  },
  {
    id: '2',
    name: 'Mobile App Template',
    teamMemberIds: ['103', '104'],
    clientIds: ['202'],
    tasks: [
      {
        id: '3',
        templateId: '2',
        name: 'Wireframing',
        relativeDueDate: { value: 3, unit: 'days', position: 'before' },
        timeEstimate: { value: 3, unit: 'h' },
        position: 1,
      },
      {
        id: '4',
        templateId: '2',
        name: 'Testing',
        relativeDueDate: { value: 7, unit: 'days', position: 'before' },
        timeEstimate: { value: 5, unit: 'h' },
        position: 2,
      },
    ],
    lastEdited: '2024-02-05',
  },
];

const teamMembers: TeamMember[] = [
  {
    id: '101',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'Admin'
  },
  {
    id: '102',
    name: 'Sarah Parker',
    email: 'sarah@example.com',
    role: 'Manager'
  },
  {
    id: '103',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'Staff'
  },
  {
    id: '104',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    role: 'Staff'
  }
];

const clients: Client[] = [
  {
    id: '201',
    name: 'Acme Corporation',
    description: 'Global technology company',
    primaryContactName: 'John Doe',
    location: 'San Francisco, CA',
    website: 'https://acme.example.com',
    assigneeId: '101',
    priority: 'High',
    services: ['tax-preparation', 'consulting'],
    isActive: true
  },
  {
    id: '202',
    name: 'Beta Industries',
    description: 'Manufacturing company',
    primaryContactName: 'Jane Smith',
    location: 'Chicago, IL',
    website: 'https://beta.example.com',
    assigneeId: '102',
    priority: 'Medium',
    services: ['bookkeeping', 'payroll'],
    isActive: true
  },
  {
    id: '203',
    name: 'Gamma Services',
    description: 'Professional services firm',
    primaryContactName: 'Bob Wilson',
    location: 'New York, NY',
    website: 'https://gamma.example.com',
    assigneeId: '103',
    priority: 'Low',
    services: ['financial-planning', 'audit'],
    isActive: true
  },
  {
    id: '204',
    name: 'Delta Tech',
    description: 'Software development company',
    primaryContactName: 'Alice Brown',
    location: 'Austin, TX',
    website: 'https://delta.example.com',
    assigneeId: '104',
    priority: 'High',
    services: ['tax-preparation', 'estate-planning'],
    isActive: true
  },
  {
    id: '205',
    name: 'Epsilon Retail',
    description: 'Retail chain',
    primaryContactName: 'Charlie Green',
    location: 'Seattle, WA',
    website: 'https://epsilon.example.com',
    assigneeId: '101',
    priority: 'Medium',
    services: ['bookkeeping', 'consulting'],
    isActive: true
  }
];

export const mockData = {
  projects,
  tasks,
  templates,
  clients,
  teamMembers
};

// Function to fetch team members for use in various components
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return teamMembers;
};
