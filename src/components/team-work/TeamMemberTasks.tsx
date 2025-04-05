
import React from 'react';
import { TeamMember, Task } from '@/types';
import { format, parseISO } from 'date-fns';
import { Check, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchClients } from '@/services/api';
import { Link } from 'react-router-dom';

interface TeamMemberTasksProps {
  teamMember: TeamMember;
  tasks: Task[];
  isLoading: boolean;
}

const TeamMemberTasks: React.FC<TeamMemberTasksProps> = ({ 
  teamMember, 
  tasks = [], 
  isLoading 
}) => {
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  // Ensure we have arrays
  const projects = Array.isArray(projectsData) ? projectsData : [];
  const clients = Array.isArray(clientsData) ? clientsData : [];
  const tasksArray = Array.isArray(tasks) ? tasks : [];

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getClientName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.clientId) return 'No Client';
    
    const client = clients.find(c => c.id === project.clientId);
    return client?.name || 'Unknown Client';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (isLoading || projectsLoading || clientsLoading) {
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
