
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TeamMember, Task, Project, Client } from '@/types';
import { format, parseISO } from 'date-fns';
import { Check, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

interface TeamMemberTasksProps {
  teamMember: TeamMember;
  tasks: Task[];
  isLoading: boolean;
}

const TeamMemberTasks: React.FC<TeamMemberTasksProps> = ({ 
  teamMember, 
  tasks = [], 
  isLoading: initialLoading 
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create an AbortController to cancel requests when component unmounts
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        
        // Fetch projects
        const projectsResponse = await axios.get('/api/projects', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          signal: controller.signal
        });
        
        // Fetch clients
        const clientsResponse = await axios.get('/api/clients', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          signal: controller.signal
        });
        
        // Ensure we always set arrays
        setProjects(projectsResponse.data ? Array.isArray(projectsResponse.data) ? projectsResponse.data : [] : []);
        setClients(clientsResponse.data ? Array.isArray(clientsResponse.data) ? clientsResponse.data : [] : []);
        setError(null);
      } catch (err) {
        // Only set error if the request wasn't aborted
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message);
        } else {
          console.error('Error fetching data:', err);
          setError('Failed to load data');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup function to abort any in-flight requests when component unmounts
    return () => {
      controller.abort();
    };
  }, []);

  // Ensure we have arrays
  const tasksArray = Array.isArray(tasks) ? tasks : [];
  const projectsArray = Array.isArray(projects) ? projects : [];
  const clientsArray = Array.isArray(clients) ? clients : [];

  const getProjectName = (projectId: string) => {
    const project = projectsArray.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getClientName = (projectId: string) => {
    const project = projectsArray.find(p => p.id === projectId);
    if (!project || !project.clientId) return 'No Client';
    
    const client = clientsArray.find(c => c.id === project.clientId);
    return client?.name || 'Unknown Client';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (loading || initialLoading) {
    return (
      <div className="bg-white rounded-md shadow">
        <div className="px-4 py-3 border-b">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-8 flex flex-col items-center justify-center">
          <Skeleton className="h-4 w-full max-w-md mb-2" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-md shadow">
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <h2 className="text-md font-semibold">{teamMember.name}</h2>
        </div>
        <div className="p-8 text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <div className="h-6 w-6 flex items-center justify-center bg-gray-200 rounded-full">
          {teamMember.id === 'unassigned' ? (
            <Check size={16} />
          ) : (
            <span className="text-xs font-medium">{teamMember.name.substr(0, 1)}</span>
          )}
        </div>
        <h2 className="text-md font-semibold">{teamMember.name}</h2>
      </div>
      
      {tasksArray.length === 0 ? (
        <div className="p-8 flex flex-col items-center justify-center text-gray-500">
          <p className="font-medium text-lg">All done!</p>
          <p className="text-sm">No tasks to display</p>
        </div>
      ) : (
        <div className="divide-y">
          {tasksArray.map(task => (
            <div key={task.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="flex-grow">
                  <Link 
                    to={`/projects/${task.projectId}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {task.name}
                  </Link>
                  <div className="mt-1 text-sm text-gray-600">
                    <div>Project: {getProjectName(task.projectId)}</div>
                    <div>Client: {getClientName(task.projectId)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <AlertCircle size={14} className="text-red-500" />
                    <span className="text-sm text-red-500">
                      Due {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamMemberTasks;
