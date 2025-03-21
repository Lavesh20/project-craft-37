
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTemplate, fetchClients, fetchTeamMembers } from '@/services/api';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TemplateEditForm from '@/components/templates/TemplateEditForm';

const TemplateDetails: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch template data
  const { data: template, isLoading: isLoadingTemplate } = useQuery({
    queryKey: ['template', templateId],
    queryFn: () => getTemplate(templateId!),
    enabled: !!templateId,
  });
  
  // Fetch clients and team members data
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });
  
  const { data: teamMembers } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers,
  });
  
  // Format relative due date
  const formatRelativeDueDate = (value: number, position: 'before' | 'after') => {
    return `${value} ${value === 1 ? 'day' : 'days'} ${position}`;
  };
  
  // Format time estimate
  const formatTimeEstimate = (value: number, unit: 'h' | 'm') => {
    return `${value}${unit}`;
  };
  
  // Get assignee
  const getAssignee = (assigneeId?: string) => {
    if (!assigneeId || !teamMembers) return null;
    return teamMembers.find((member) => member.id === assigneeId);
  };
  
  // Get associated clients
  const getAssociatedClients = () => {
    if (!template || !clients) return [];
    return clients.filter((client) => template.clientIds.includes(client.id));
  };
  
  if (isLoadingTemplate) {
    return (
      <div className="p-6">
        <Skeleton className="h-12 w-2/3 mb-4" />
        <Skeleton className="h-48 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (!template) {
    return (
      <div className="p-6">
        <h1 className="text-xl text-red-500">Template not found</h1>
        <p className="mt-2">This template may have been deleted or you don't have access to it.</p>
        <Button className="mt-4" onClick={() => navigate('/templates')}>
          Return to Templates
        </Button>
      </div>
    );
  }
  
  if (isEditing && template) {
    return <TemplateEditForm template={template} onCancel={() => setIsEditing(false)} />;
  }
  
  const associatedClients = getAssociatedClients();
  const assignedTeamMembers = teamMembers?.filter((member) => template.teamMemberIds.includes(member.id)) || [];
  
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {/* Template Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{template.name}</h1>
                <Badge>Template</Badge>
              </div>
              {template.description && (
                <p className="text-muted-foreground">{template.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsEditing(true)}>
                Edit Template
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Create Project from Template</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate Template</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete Template</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* Team Members Section */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Team Members</h2>
                {assignedTeamMembers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {assignedTeamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-2 p-2 bg-accent rounded-md">
                        <Avatar className="size-6">
                          <div className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground text-xs uppercase">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </Avatar>
                        <span className="text-sm">{member.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground">None</div>
                )}
              </div>
              
              {/* Task List Section */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Task List</h2>
                
                <div className="border rounded-md divide-y">
                  {template.tasks.map((task) => {
                    const assignee = getAssignee(task.assigneeId);
                    
                    return (
                      <div key={task.id} className="flex items-center p-4 group">
                        <div className="mr-2 text-muted-foreground cursor-grab">
                          <GripVertical size={20} />
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{task.name}</div>
                          {task.description && (
                            <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm px-2 py-1 bg-accent rounded">
                            {formatRelativeDueDate(
                              task.relativeDueDate.value,
                              task.relativeDueDate.position
                            )}
                          </div>
                          <div className="text-sm px-2 py-1 bg-accent rounded">
                            {formatTimeEstimate(
                              task.timeEstimate.value,
                              task.timeEstimate.unit
                            )}
                          </div>
                          {assignee && (
                            <Avatar className="size-8">
                              <div className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground text-xs uppercase">
                                {assignee.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {template.tasks.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground">
                      No tasks have been created for this template.
                    </div>
                  )}
                </div>
                
                <Button variant="outline" className="mt-4" onClick={() => setIsEditing(true)}>
                  <Plus className="mr-2 size-4" />
                  Add task
                </Button>
              </div>
            </div>
            
            {/* Associated Clients Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Associated Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  {associatedClients.length > 0 ? (
                    <div className="space-y-3">
                      {associatedClients.map((client) => (
                        <div key={client.id} className="text-sm hover:bg-accent p-2 rounded-md cursor-pointer">
                          {client.name}
                        </div>
                      ))}
                      
                      <div className="pt-2 flex flex-col items-center gap-2">
                        <div className="text-xs text-muted-foreground">
                          Showing 1-{associatedClients.length} of {associatedClients.length} items
                        </div>
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationLink disabled>Previous</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink isActive>1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink disabled>Next</PaginationLink>
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                        <div className="text-xs text-muted-foreground">
                          10 rows per page
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      No clients are currently using this template.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetails;
