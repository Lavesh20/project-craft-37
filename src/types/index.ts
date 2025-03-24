export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId?: string;
  assigneeId?: string;
  teamMemberIds?: string[];
  status: string;
  dueDate: string;
  tasks?: Task[];
  lastEdited: string;
  lastEditedBy?: string;
  templateId?: string;
  repeating?: boolean;
  labels?: string[];
  frequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Custom';
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  assigneeId?: string;
  status: string;
  dueDate: string;
  position: number;
  lastEdited: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  teamMemberIds?: string[];
  clientIds?: string[];
  tasks: TemplateTask[];
  lastEdited: string;
}

export interface TemplateTask {
  id: string;
  templateId: string;
  name: string;
  description?: string;
  position: number;
  relativeDueDate: RelativeDueDate;
  timeEstimate: TimeEstimate;
  assigneeId?: string;
}

export interface RelativeDueDate {
  value: number;
  unit: 'days' | 'weeks' | 'months';
  position: 'before' | 'after';
}

export interface TimeEstimate {
  value: number;
  unit: 'm' | 'h';
}

export interface Client {
  id: string;
  name: string;
  description?: string;
  primaryContactName?: string;
  location?: string;
  website?: string;
  assigneeId?: string;
  priority: 'None' | 'Low' | 'Medium' | 'High';
  services: string[];
  isActive: boolean;
  lastEdited?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  clientId?: string;
  isPrimaryContact?: boolean;
  lastEdited: string;
}

// Add or modify types for client-related features
export interface CreateContactFormData {
  name: string;
  email: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  clientId?: string;
  isPrimaryContact?: boolean;
}

export interface Series {
  id: string;
  name: string;
  clientId: string;
  frequency: string;
  templateId?: string;
  templateName?: string;
}

// Update CreateTaskFormData interface to include projectId
export interface CreateTaskFormData {
  name: string;
  description?: string;
  assigneeId?: string;
  dueDate: string;
}

// Update CreateProjectFormData to include status field
export interface CreateProjectFormData {
  name: string;
  description?: string;
  clientId?: string;
  dueDate: string;
  status: string; // Add this field as it's required
  assigneeId?: string;
  teamMemberIds?: string[];
  repeating?: boolean;
  frequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Custom';
  templateId?: string; // Add this field as it's being used in the API
}

// Add CreateTemplateFormData interface
export interface CreateTemplateFormData {
  name: string;
  description?: string;
  teamMemberIds?: string[];
}

// Add CreateClientFormData interface
export interface CreateClientFormData {
  name: string;
  description?: string;
  primaryContactName?: string;
  location?: string;
  website?: string;
  assigneeId?: string;
  priority: 'None' | 'Low' | 'Medium' | 'High';
  services: string[];
  isActive: boolean;
}

// Add Comment interface
export interface Comment {
  id: string;
  projectId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

// Add CreateTemplateTaskFormData interface
export interface CreateTemplateTaskFormData {
  name: string;
  description?: string;
  assigneeId?: string;
  relativeDueDate: RelativeDueDate;
  timeEstimate: TimeEstimate;
}

// Add FilterOptions interface
export interface FilterOptions {
  timeframe?: string;
  status?: string;
  client?: string;
}

// Add TableColumn interface
export interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
}

// Add or update types for my-work related features
export interface MyWorkTask extends Task {
  projectName?: string;
  clientName?: string;
}

export interface TasksByStatus {
  [status: string]: MyWorkTask[];
}

export interface TasksByProject {
  [projectId: string]: {
    projectName: string;
    clientName?: string;
    tasks: MyWorkTask[];
  };
}
