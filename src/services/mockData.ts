
import { Project, Client, TeamMember, Task, Comment, Template, TemplateTask } from '../types';

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
    content: 'I\'ve finished reconciling all the accounts. Everything looks good.',
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

// Mock Templates
export const mockTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'SAMPLE Monthly Accounting',
    description: 'Template for regular monthly accounting services',
    teamMemberIds: [],
    clientIds: ['client-1'],
    tasks: [
      {
        id: 'template-task-1',
        templateId: 'template-1',
        name: 'Receive Client Information',
        description: 'Receive all the necessary documents from client',
        assigneeId: 'user-3',
        relativeDueDate: { value: 10, unit: 'days', position: 'before' },
        timeEstimate: { value: 30, unit: 'm' },
        position: 0
      },
      {
        id: 'template-task-2',
        templateId: 'template-1',
        name: 'Enter Client Information',
        description: 'Input all client data into the system',
        assigneeId: 'user-3',
        relativeDueDate: { value: 5, unit: 'days', position: 'before' },
        timeEstimate: { value: 30, unit: 'm' },
        position: 1
      },
      {
        id: 'template-task-3',
        templateId: 'template-1',
        name: 'Reconcile Accounts',
        description: 'Ensure all accounts are properly reconciled',
        assigneeId: 'user-3',
        relativeDueDate: { value: 5, unit: 'days', position: 'before' },
        timeEstimate: { value: 30, unit: 'm' },
        position: 2
      },
      {
        id: 'template-task-4',
        templateId: 'template-1',
        name: 'Review Prep Work',
        description: 'Review all prepared documents',
        assigneeId: 'user-3',
        relativeDueDate: { value: 5, unit: 'days', position: 'before' },
        timeEstimate: { value: 30, unit: 'm' },
        position: 3
      },
      {
        id: 'template-task-5',
        templateId: 'template-1',
        name: 'Run Reports',
        description: 'Generate all required financial reports',
        assigneeId: 'user-3',
        relativeDueDate: { value: 2, unit: 'days', position: 'before' },
        timeEstimate: { value: 30, unit: 'm' },
        position: 4
      },
      {
        id: 'template-task-6',
        templateId: 'template-1',
        name: 'Send Final Reports To Clients',
        description: 'Deliver the completed reports to the client',
        assigneeId: 'user-3',
        relativeDueDate: { value: 1, unit: 'days', position: 'before' },
        timeEstimate: { value: 30, unit: 'm' },
        position: 5
      }
    ],
    lastEdited: '2024-06-10T09:00:00Z',
    lastEditedBy: 'user-1'
  },
  {
    id: 'template-2',
    name: 'SAMPLE Tax Return',
    description: 'Template for preparing and filing tax returns',
    teamMemberIds: [],
    clientIds: [],
    tasks: [
      {
        id: 'template-task-7',
        templateId: 'template-2',
        name: 'Collect Tax Documents',
        description: 'Gather all necessary tax documents from client',
        assigneeId: 'user-1',
        relativeDueDate: { value: 30, unit: 'days', position: 'before' },
        timeEstimate: { value: 1, unit: 'h' },
        position: 0
      },
      {
        id: 'template-task-8',
        templateId: 'template-2',
        name: 'Review Tax Documents',
        description: 'Ensure all tax documents are complete and accurate',
        assigneeId: 'user-2',
        relativeDueDate: { value: 25, unit: 'days', position: 'before' },
        timeEstimate: { value: 2, unit: 'h' },
        position: 1
      },
      {
        id: 'template-task-9',
        templateId: 'template-2',
        name: 'Prepare Tax Return Draft',
        description: 'Create initial draft of tax return',
        assigneeId: 'user-3',
        relativeDueDate: { value: 20, unit: 'days', position: 'before' },
        timeEstimate: { value: 3, unit: 'h' },
        position: 2
      },
      {
        id: 'template-task-10',
        templateId: 'template-2',
        name: 'Review Tax Return Draft',
        description: 'Check tax return draft for accuracy and completeness',
        assigneeId: 'user-1',
        relativeDueDate: { value: 15, unit: 'days', position: 'before' },
        timeEstimate: { value: 1, unit: 'h' },
        position: 3
      },
      {
        id: 'template-task-11',
        templateId: 'template-2',
        name: 'Finalize Tax Return',
        description: 'Make final adjustments to tax return',
        assigneeId: 'user-2',
        relativeDueDate: { value: 10, unit: 'days', position: 'before' },
        timeEstimate: { value: 1, unit: 'h' },
        position: 4
      },
      {
        id: 'template-task-12',
        templateId: 'template-2',
        name: 'Client Review Meeting',
        description: 'Meet with client to review tax return',
        assigneeId: 'user-3',
        relativeDueDate: { value: 5, unit: 'days', position: 'before' },
        timeEstimate: { value: 1, unit: 'h' },
        position: 5
      },
      {
        id: 'template-task-13',
        templateId: 'template-2',
        name: 'Submit Tax Return',
        description: 'File tax return with appropriate authorities',
        assigneeId: 'user-1',
        relativeDueDate: { value: 1, unit: 'days', position: 'before' },
        timeEstimate: { value: 30, unit: 'm' },
        position: 6
      },
      {
        id: 'template-task-14',
        templateId: 'template-2',
        name: 'Send Final Documents to Client',
        description: 'Provide copies of filed tax return to client',
        assigneeId: 'user-2',
        relativeDueDate: { value: 1, unit: 'days', position: 'after' },
        timeEstimate: { value: 15, unit: 'm' },
        position: 7
      }
    ],
    lastEdited: '2024-06-09T14:30:00Z',
    lastEditedBy: 'user-2'
  }
];
