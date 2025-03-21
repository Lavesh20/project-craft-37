
import { Project, Client, TeamMember } from '../types';

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
    repeating: false,
    labels: ['Accounting', 'Monthly']
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
    repeating: false,
    labels: ['Test']
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
    repeating: true,
    frequency: 'Quarterly',
    labels: ['Tax', 'Quarterly']
  }
];
