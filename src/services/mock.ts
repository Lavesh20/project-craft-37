
// Import the mockData from the existing mockData.ts file
import { mockData } from './mockData';

// Ensure we have arrays for each entity to prevent "filter is not a function" errors
const ensureArray = <T>(data: T[] | undefined): T[] => {
  return Array.isArray(data) ? data : [];
};

// Create a safe version of the mock data that ensures everything is an array
export const mockData = {
  projects: ensureArray(mockData.projects),
  tasks: ensureArray(mockData.tasks),
  templates: ensureArray(mockData.templates),
  clients: ensureArray(mockData.clients),
  teamMembers: ensureArray(mockData.teamMembers),
  contacts: ensureArray(mockData.contacts),
  comments: ensureArray(mockData.comments),
  series: ensureArray(mockData.series)
};
