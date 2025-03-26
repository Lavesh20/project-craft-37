
// Import the mockData from the existing mockData.ts file
import { mockData as originalMockData } from './mockData';

// Ensure we have arrays for each entity to prevent "filter is not a function" errors
const ensureArray = <T>(data: T[] | undefined): T[] => {
  return Array.isArray(data) ? data : [];
};

// Create a safe version of the mock data that ensures everything is an array
export const mockData = {
  projects: ensureArray(originalMockData.projects),
  tasks: ensureArray(originalMockData.tasks),
  templates: ensureArray(originalMockData.templates),
  clients: ensureArray(originalMockData.clients),
  teamMembers: ensureArray(originalMockData.teamMembers),
  contacts: ensureArray(originalMockData.contacts),
  comments: ensureArray(originalMockData.comments),
  series: ensureArray(originalMockData.series)
};
