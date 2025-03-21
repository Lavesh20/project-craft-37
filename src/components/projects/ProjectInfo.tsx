
import React from 'react';
import { format } from 'date-fns';
import { Project, Client, TeamMember } from '@/types';
import { User, Calendar, Building, Users } from 'lucide-react';
import { fetchClients, fetchTeamMembers } from '@/services/api';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectInfoProps {
  project: Project;
  onProjectUpdate: (project: Project) => void;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ project, onProjectUpdate }) => {
  // Fetch clients for displaying client name
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  // Fetch team members for displaying names and avatars
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers
  });

  // Helper to get client by ID
  const getClientById = (clientId: string): Client | undefined => {
    return clients.find(client => client.id === clientId);
  };

  // Helper to get team member by ID
  const getTeamMemberById = (memberId: string): TeamMember | undefined => {
    return teamMembers.find(member => member.id === memberId);
  };

  // Helper to get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const client = getClientById(project.clientId);
  const assignee = project.assigneeId ? getTeamMemberById(project.assigneeId) : undefined;

  // Get team members that are assigned to this project
  const projectTeamMembers = project.teamMemberIds
    .map(id => getTeamMemberById(id))
    .filter(member => member !== undefined) as TeamMember[];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Project Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <User className="text-gray-400" size={20} />
          <div>
            <div className="font-medium text-sm text-gray-500">Project Assignee</div>
            <div className="flex items-center mt-1">
              {assignee ? (
                <>
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
                  </Avatar>
                  <span>{assignee.name}</span>
                </>
              ) : (
                <span className="text-gray-400">No assignee</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full w-5 h-5 flex items-center justify-center">
            <span className={`
              inline-block rounded-full w-3 h-3 
              ${project.status === 'Complete' ? 'bg-green-500' : 
                project.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'}
            `}></span>
          </div>
          <div>
            <div className="font-medium text-sm text-gray-500">Status</div>
            <Badge 
              className={`
                mt-1
                ${project.status === 'Complete' ? 'bg-jetpack-green text-green-800' : 
                  project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'}
              `}
            >
              {project.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="text-gray-400" size={20} />
          <div>
            <div className="font-medium text-sm text-gray-500">Due Date</div>
            <Badge variant="outline" className="mt-1 bg-gray-100 text-gray-800">
              {format(new Date(project.dueDate), 'MMM dd')}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Building className="text-gray-400" size={20} />
          <div>
            <div className="font-medium text-sm text-gray-500">Client</div>
            <div className="mt-1 text-blue-600 hover:text-blue-800 cursor-pointer">
              {client ? client.name : 'Unknown Client'}
            </div>
          </div>
        </div>
      </CardContent>

      {projectTeamMembers.length > 0 && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <Users className="text-gray-400" size={20} />
            <div>
              <div className="font-medium text-sm text-gray-500">Team Members</div>
              <div className="flex mt-1 flex-wrap gap-2">
                {projectTeamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ProjectInfo;
