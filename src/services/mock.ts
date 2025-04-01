
// Import the mockData from the existing mockData.ts file
import { mockData as originalMockData } from './mockData';
import { RelativeDueDate, TimeEstimate } from '@/types';

// Ensure we have arrays for each entity to prevent "filter is not a function" errors
const ensureArray = <T>(data: T[] | undefined): T[] => {
  return Array.isArray(data) ? data : [];
};

// Add some mock templates if none exist in the original data
const mockTemplates = ensureArray(originalMockData.templates);
if (mockTemplates.length === 0) {
  console.log('Adding fallback mock templates');
  mockTemplates.push(
    {
      id: 'template-1',
      name: 'Monthly Tax Return',
      description: 'Template for monthly tax return filings',
      tasks: [
        { 
          id: 'task-1', 
          name: 'Gather documents', 
          position: 0,
          relativeDueDate: { value: 14, unit: 'days', position: 'before' },
          timeEstimate: { value: 2, unit: 'h' }
        },
        { 
          id: 'task-2', 
          name: 'Review with client', 
          position: 1,
          relativeDueDate: { value: 7, unit: 'days', position: 'before' },
          timeEstimate: { value: 1, unit: 'h' }
        },
        { 
          id: 'task-3', 
          name: 'Submit filing', 
          position: 2,
          relativeDueDate: { value: 1, unit: 'days', position: 'before' },
          timeEstimate: { value: 30, unit: 'm' }
        }
      ],
      clientIds: ['client-1', 'client-2'],
      lastEdited: new Date().toISOString(),
      createdAt: new Date().toISOString() // Add the missing createdAt property
    },
    {
      id: 'template-2',
      name: 'Quarterly Financial Review',
      description: 'Template for quarterly financial reviews',
      tasks: [
        { 
          id: 'task-4', 
          name: 'Prepare financial statements', 
          position: 0,
          relativeDueDate: { value: 10, unit: 'days', position: 'before' },
          timeEstimate: { value: 4, unit: 'h' }
        },
        { 
          id: 'task-5', 
          name: 'Analyze performance', 
          position: 1,
          relativeDueDate: { value: 5, unit: 'days', position: 'before' },
          timeEstimate: { value: 3, unit: 'h' }
        }
      ],
      clientIds: ['client-3'],
      lastEdited: new Date().toISOString(),
      createdAt: new Date().toISOString() // Add the missing createdAt property
    }
  );
}

// Create a safe version of the mock data that ensures everything is an array
export const mockData = {
  projects: ensureArray(originalMockData.projects),
  tasks: ensureArray(originalMockData.tasks),
  templates: mockTemplates,
  clients: ensureArray(originalMockData.clients),
  teamMembers: ensureArray(originalMockData.teamMembers),
  contacts: ensureArray(originalMockData.contacts),
  comments: ensureArray(originalMockData.comments),
  series: ensureArray(originalMockData.series)
};

// Log the mock data to the console for debugging purposes
console.log('Mock templates available:', mockData.templates.length);
console.log('Mock clients available:', mockData.clients.length);
