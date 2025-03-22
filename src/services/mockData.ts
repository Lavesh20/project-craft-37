
import { Project, Task, Template, Client, TeamMember, Contact, TemplateTask } from '@/types';

// Mock data store for the application
export const mockData: {
  projects: Project[];
  tasks: Task[];
  templates: Template[];
  clients: Client[];
  teamMembers: TeamMember[];
  contacts: Contact[];
} = {
  projects: [],
  tasks: [],
  templates: [],
  clients: [],
  teamMembers: [
    {
      id: 'user-1',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Admin'
    },
    {
      id: 'user-2',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Manager'
    },
    {
      id: 'user-3',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'Staff'
    }
  ],
  contacts: [
    {
      id: 'contact-1',
      name: 'Lavesh Vyas',
      email: 'laveshvyas20@gmail.com',
      phone: '555-123-4567',
      clientId: 'client-1',
      isPrimaryContact: true,
      lastEdited: new Date().toISOString(),
    }
  ]
};

// Initialize with some sample data
const initializeMockData = () => {
  // Add sample clients if none exist
  if (mockData.clients.length === 0) {
    mockData.clients.push(
      {
        id: 'client-1',
        name: 'Acme Corp',
        description: 'Large manufacturing company',
        primaryContactName: 'John Smith',
        location: 'New York, NY',
        website: 'https://acme.example.com',
        assigneeId: 'user-1',
        priority: 'High',
        services: ['Consulting', 'Web Development'],
        isActive: true
      },
      {
        id: 'client-2',
        name: 'TechStart Inc',
        description: 'Growing tech startup',
        primaryContactName: 'Maria Johnson',
        location: 'San Francisco, CA',
        website: 'https://techstart.example.com',
        assigneeId: 'user-2',
        priority: 'Medium',
        services: ['Web Development', 'Mobile Apps'],
        isActive: true
      },
      {
        id: 'client-3',
        name: 'Local Business',
        description: 'Small local retail shop',
        primaryContactName: 'Robert Lee',
        location: 'Chicago, IL',
        assigneeId: 'user-3',
        priority: 'Low',
        services: ['Web Design'],
        isActive: true
      }
    );
  }

  // Add sample templates if none exist
  if (mockData.templates.length === 0) {
    // Create a website template
    const websiteTemplate: Template = {
      id: 'template-1',
      name: 'Website Development',
      description: 'Standard website development process',
      teamMemberIds: ['user-1', 'user-2'],
      clientIds: ['client-1', 'client-2'],
      tasks: [],
      lastEdited: new Date().toISOString(),
    };

    // Add tasks to the website template
    const websiteTasks: TemplateTask[] = [
      {
        id: 'template-task-1',
        templateId: 'template-1',
        name: 'Initial client meeting',
        description: 'Gather requirements and discuss project scope',
        position: 1,
        relativeDueDate: { value: 0, unit: 'days', position: 'after' },
        timeEstimate: { value: 1, unit: 'h' }
      },
      {
        id: 'template-task-2',
        templateId: 'template-1',
        name: 'Design mockups',
        description: 'Create initial design mockups for approval',
        position: 2,
        relativeDueDate: { value: 7, unit: 'days', position: 'after' },
        timeEstimate: { value: 8, unit: 'h' }
      },
      {
        id: 'template-task-3',
        templateId: 'template-1',
        name: 'Frontend development',
        description: 'Implement approved designs',
        position: 3,
        relativeDueDate: { value: 14, unit: 'days', position: 'after' },
        timeEstimate: { value: 24, unit: 'h' }
      },
      {
        id: 'template-task-4',
        templateId: 'template-1',
        name: 'Backend integration',
        description: 'Connect to backend services and APIs',
        position: 4,
        relativeDueDate: { value: 21, unit: 'days', position: 'after' },
        timeEstimate: { value: 16, unit: 'h' }
      },
      {
        id: 'template-task-5',
        templateId: 'template-1',
        name: 'Testing and QA',
        description: 'Perform testing and quality assurance',
        position: 5,
        relativeDueDate: { value: 28, unit: 'days', position: 'after' },
        timeEstimate: { value: 8, unit: 'h' }
      },
      {
        id: 'template-task-6',
        templateId: 'template-1',
        name: 'Launch',
        description: 'Deploy website to production',
        position: 6,
        relativeDueDate: { value: 30, unit: 'days', position: 'after' },
        timeEstimate: { value: 2, unit: 'h' }
      }
    ];
    
    websiteTemplate.tasks = websiteTasks;
    mockData.templates.push(websiteTemplate);
    
    // Create a marketing campaign template
    const marketingTemplate: Template = {
      id: 'template-2',
      name: 'Marketing Campaign',
      description: 'Standard marketing campaign process',
      teamMemberIds: ['user-2', 'user-3'],
      clientIds: ['client-3'],
      tasks: [],
      lastEdited: new Date().toISOString(),
    };
    
    // Add tasks to the marketing template
    const marketingTasks: TemplateTask[] = [
      {
        id: 'template-task-7',
        templateId: 'template-2',
        name: 'Strategy meeting',
        description: 'Define campaign goals and strategy',
        position: 1,
        relativeDueDate: { value: 0, unit: 'days', position: 'after' },
        timeEstimate: { value: 2, unit: 'h' }
      },
      {
        id: 'template-task-8',
        templateId: 'template-2',
        name: 'Content creation',
        description: 'Develop campaign content and assets',
        position: 2,
        relativeDueDate: { value: 7, unit: 'days', position: 'after' },
        timeEstimate: { value: 12, unit: 'h' }
      },
      {
        id: 'template-task-9',
        templateId: 'template-2',
        name: 'Campaign setup',
        description: 'Set up tracking and ad platforms',
        position: 3,
        relativeDueDate: { value: 14, unit: 'days', position: 'after' },
        timeEstimate: { value: 4, unit: 'h' }
      },
      {
        id: 'template-task-10',
        templateId: 'template-2',
        name: 'Launch campaign',
        description: 'Activate marketing campaign',
        position: 4,
        relativeDueDate: { value: 21, unit: 'days', position: 'after' },
        timeEstimate: { value: 1, unit: 'h' }
      },
      {
        id: 'template-task-11',
        templateId: 'template-2',
        name: 'Monitoring and optimization',
        description: 'Track performance and optimize campaign',
        position: 5,
        relativeDueDate: { value: 28, unit: 'days', position: 'after' },
        timeEstimate: { value: 8, unit: 'h' }
      },
      {
        id: 'template-task-12',
        templateId: 'template-2',
        name: 'Final report',
        description: 'Analyze results and prepare report',
        position: 6,
        relativeDueDate: { value: 35, unit: 'days', position: 'after' },
        timeEstimate: { value: 4, unit: 'h' }
      }
    ];
    
    marketingTemplate.tasks = marketingTasks;
    mockData.templates.push(marketingTemplate);
  }

  // Add sample projects if none exist
  if (mockData.projects.length === 0) {
    // Add two projects
    mockData.projects.push(
      {
        id: 'project-1',
        name: 'Acme Website Redesign',
        description: 'Complete redesign of the Acme corporate website',
        clientId: 'client-1',
        assigneeId: 'user-1',
        teamMemberIds: ['user-1', 'user-2', 'user-3'],
        status: 'In Progress',
        dueDate: '2023-12-31',
        lastEdited: new Date().toISOString(),
        repeating: false,
        labels: ['website', 'design', 'corporate']
      },
      {
        id: 'project-2',
        name: 'TechStart Mobile App',
        description: 'Mobile application development for TechStart',
        clientId: 'client-2',
        assigneeId: 'user-2',
        teamMemberIds: ['user-2', 'user-3'],
        status: 'Not Started',
        dueDate: '2024-03-15',
        lastEdited: new Date().toISOString(),
        repeating: false,
        labels: ['mobile', 'app', 'development']
      }
    );
    
    // Add tasks for the first project
    mockData.tasks.push(
      {
        id: 'task-1',
        projectId: 'project-1',
        name: 'Gather requirements',
        description: 'Meet with client to gather detailed requirements',
        assigneeId: 'user-1',
        status: 'Complete',
        dueDate: '2023-09-15',
        position: 1,
        lastEdited: new Date().toISOString()
      },
      {
        id: 'task-2',
        projectId: 'project-1',
        name: 'Create wireframes',
        description: 'Design wireframes for key pages',
        assigneeId: 'user-2',
        status: 'In Progress',
        dueDate: '2023-10-01',
        position: 2,
        lastEdited: new Date().toISOString()
      },
      {
        id: 'task-3',
        projectId: 'project-1',
        name: 'Develop frontend',
        description: 'Implement the approved designs',
        assigneeId: 'user-3',
        status: 'Not Started',
        dueDate: '2023-11-01',
        position: 3,
        lastEdited: new Date().toISOString()
      }
    );
    
    // Add tasks for the second project
    mockData.tasks.push(
      {
        id: 'task-4',
        projectId: 'project-2',
        name: 'App requirements',
        description: 'Document app requirements and features',
        assigneeId: 'user-2',
        status: 'Not Started',
        dueDate: '2024-01-15',
        position: 1,
        lastEdited: new Date().toISOString()
      },
      {
        id: 'task-5',
        projectId: 'project-2',
        name: 'UI/UX Design',
        description: 'Design user interface and experience',
        assigneeId: 'user-3',
        status: 'Not Started',
        dueDate: '2024-02-01',
        position: 2,
        lastEdited: new Date().toISOString()
      }
    );
  }

  // Initialize contacts if none exist (already added one above)
};

// Run initialization
initializeMockData();
