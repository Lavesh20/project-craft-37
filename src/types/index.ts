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
}

export interface RelativeDueDate {
  value: number;
  unit: 'days' | 'weeks' | 'months';
  position: 'before' | 'after';
}

export interface TimeEstimate {
  value: number;
  unit: 'm' | 'h' | 'd';
}

export interface Client {
  id: string;
  name: string;
  description?: string;
  primaryContactName?: string;
  location?: string;
  website?: string;
  assigneeId?: string;
  priority: string;
  services: string[];
  isActive: boolean;
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

// Add CreateTaskFormData interface
export interface CreateTaskFormData {
  name: string;
  description?: string;
  assigneeId?: string;
  dueDate: string;
}

// Add CreateProjectFormData interface
export interface CreateProjectFormData {
  name: string;
  description?: string;
  clientId?: string;
  dueDate: string;
  status: string;
}

// Add CreateTemplateFormData interface
export interface CreateTemplateFormData {
  name: string;
  description?: string;
}
