
export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  assigneeId?: string;
  teamMemberIds: string[];
  status: 'Complete' | 'In Progress' | 'Not Started';
  dueDate: string;
  lastEdited: string;
  repeating: boolean;
  frequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Custom';
  labels?: string[];
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
}

export interface CreateProjectFormData {
  name: string;
  description?: string;
  clientId: string;
  assigneeId?: string;
  teamMemberIds: string[];
  repeating: boolean;
  frequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Custom';
  dueDate: string;
}

export interface FilterOptions {
  timeframe?: 'all' | 'this-week' | 'this-month' | 'custom';
  status?: 'all' | 'complete' | 'in-progress' | 'not-started';
  assignee?: string;
  client?: string;
  label?: string;
}

export interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
}
