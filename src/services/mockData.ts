
import { Project, Client, TeamMember, Task, Comment } from '../types';

// Mock Clients
export const mockClients: Client[] = [
  { id: 'client-1', name: 'Example Inc.', email: 'contact@example.com', phone: '555-1234' },
  { id: 'client-2', name: 'ABC Company', email: 'info@abccompany.com', phone: '555-5678' },
  { id: 'client-3', name: 'XYZ Corporation', email: 'hello@xyzcorp.com', phone: '555-9876' }
];

// Mock Team Members
export const mockTeamMembers: TeamMember[] = [
  { id: 'user-1', name: 'John Doe', email: 'john@jetpack.com', role: 'Admin' },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@jetpack.com', role: 'Manager' },
  { id: 'user-3', name: 'Vyas', email: 'vyas@jetpack.com', role: 'Staff' }
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'SAMPLE Monthly Accounting',
    description: 'Regular monthly accounting services',
    clientId: 'client-1',
    assigneeId: 'user-1',
    teamMemberIds: ['user-1', 'user-3'],
    status: 'Complete',
    dueDate: '2024-06-12',
    lastEdited: '2024-06-11T14:30:00Z',
    lastEditedBy: 'user-1',
    repeating: false,
    labels: ['Accounting', 'Monthly', 'Project']
  },
  {
    id: 'proj-2',
    name: 'test project',
    description: 'A test project for demonstration',
    clientId: 'client-2',
    assigneeId: 'user-2',
    teamMemberIds: ['user-2'],
    status: 'Complete',
    dueDate: '2024-06-25',
    lastEdited: '2024-06-11T10:15:00Z',
    lastEditedBy: 'user-2',
    repeating: false,
    labels: ['Test', 'Project']
  },
  {
    id: 'proj-3',
    name: 'Tax Return - Q2',
    description: 'Quarterly tax return preparation',
    clientId: 'client-3',
    assigneeId: 'user-3',
    teamMemberIds: ['user-1', 'user-3'],
    status: 'In Progress',
    dueDate: '2024-06-30',
    lastEdited: '2024-06-10T09:45:00Z',
    lastEditedBy: 'user-3',
    repeating: true,
    frequency: 'Quarterly',
    labels: ['Tax', 'Quarterly', 'Project']
  }
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    name: 'Prepare financial statements',
    description: 'Create monthly P&L, balance sheet, and cash flow statements',
    assigneeId: 'user-1',
    status: 'Complete',
    dueDate: '2024-06-10',
    position: 0,
    lastEdited: '2024-06-10T15:30:00Z'
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    name: 'Reconcile accounts',
    description: 'Make sure all accounts are reconciled for the month',
    assigneeId: 'user-3',
    status: 'Complete',
    dueDate: '2024-06-11',
    position: 1,
    lastEdited: '2024-06-11T09:45:00Z'
  },
  {
    id: 'task-3',
    projectId: 'proj-3',
    name: 'Gather expense documentation',
    description: 'Collect all receipts and invoices for the quarter',
    assigneeId: 'user-3',
    status: 'Complete',
    dueDate: '2024-06-15',
    position: 0,
    lastEdited: '2024-06-15T14:20:00Z'
  },
  {
    id: 'task-4',
    projectId: 'proj-3',
    name: 'Calculate quarterly taxes',
    description: 'Determine tax liability based on quarterly earnings',
    assigneeId: 'user-1',
    status: 'In Progress',
    dueDate: '2024-06-25',
    position: 1,
    lastEdited: '2024-06-16T10:05:00Z'
  },
  {
    id: 'task-5',
    projectId: 'proj-3',
    name: 'File tax return',
    description: 'Submit the completed tax return to the appropriate agencies',
    assigneeId: 'user-3',
    status: 'Not Started',
    dueDate: '2024-06-30',
    position: 2,
    lastEdited: '2024-06-10T09:45:00Z'
  }
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    projectId: 'proj-1',
    authorId: 'user-1',
    content: 'All financial statements have been completed and reconciled.',
    createdAt: '2024-06-11T14:00:00Z'
  },
  {
    id: 'comment-2',
    projectId: 'proj-1',
    authorId: 'user-3',
    content: 'I've finished reconciling all the accounts. Everything looks good.',
    createdAt: '2024-06-11T09:50:00Z'
  },
  {
    id: 'comment-3',
    projectId: 'proj-3',
    authorId: 'user-3',
    content: 'All expense documentation has been collected and organized.',
    createdAt: '2024-06-15T14:25:00Z'
  }
];
