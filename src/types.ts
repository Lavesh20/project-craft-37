
// Core entity types
export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  status: 'Not Started' | 'In Progress' | 'Complete';
  dueDate: string;
  startDate?: string;
  assigneeId?: string;
  teamMemberIds: string[];
  tasks?: Task[];
  templateId?: string;
  lastEdited: string;
  lastEditedBy?: string;
}

export interface Client {
  id: string;
  name: string;
  description?: string;
  location?: string;
  website?: string;
  assigneeId?: string;
  priority?: 'None' | 'Low' | 'Medium' | 'High';
  services?: string[];
  isActive?: boolean;
  createdAt?: string;
  lastEdited?: string;
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
  createdAt?: string;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: 'Not Started' | 'In Progress' | 'Complete';
  assigneeId?: string;
  dueDate: string;
  projectId: string;
  clientId?: string;
  clientName?: string;
  projectName?: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  clientId?: string;
  tasks: TemplateTask[];
  category?: string;
  createdAt: string;
  lastEdited?: string;
}

export interface TemplateTask {
  id: string;
  name: string;
  description?: string;
  assigneeId?: string;
  relativeDueDate: number; // Number of days from project start
}

export interface Comment {
  id: string;
  projectId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export interface Series {
  id: string;
  name: string;
  frequency: string;
  templateId?: string;
  templateName?: string;
}

// Data structures for API responses
export interface TasksByStatus {
  [status: string]: Task[];
}

export interface TasksByProject {
  [projectId: string]: {
    projectId: string;
    projectName: string;
    clientName?: string;
    tasks: Task[];
  };
}

// Form data types
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

export interface MyWorkTask extends Task {
  projectName?: string;
  clientName?: string;
}
