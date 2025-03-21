
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowUp, Filter } from 'lucide-react';
import { fetchTemplates, fetchClients, fetchTeamMembers } from '@/services/api';
import { Template, Client, TeamMember } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar } from '@/components/ui/avatar';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const TemplatesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // Fetch templates, clients, and team members
  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates
  });
  
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });
  
  const { data: teamMembers, isLoading: isLoadingTeamMembers } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers
  });
  
  const isLoading = isLoadingTemplates || isLoadingClients || isLoadingTeamMembers;
  
  // Get client counts for each template
  const getClientCount = (template: Template): number => {
    return template.clientIds.length;
  };
  
  // Get team member names for each template
  const getTeamMemberNames = (template: Template): TeamMember[] => {
    if (!teamMembers) return [];
    return teamMembers.filter(member => template.teamMemberIds.includes(member.id));
  };
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = templates ? templates.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = templates ? Math.ceil(templates.length / itemsPerPage) : 0;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Templates</h1>
      
      <div className="flex justify-between mb-6">
        <Button variant="outline" size="sm" className="gap-2">
          <Filter size={16} />
          Filter
        </Button>
        
        <Button asChild size="sm">
          <Link to="/templates/new">Create new template</Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      NAME
                      <ArrowUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[15%]">TASKS</TableHead>
                  <TableHead className="w-[20%]">CLIENT COUNT</TableHead>
                  <TableHead className="w-[25%]">TEAM MEMBERS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((template) => (
                  <TableRow key={template.id} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell>
                      <Link to={`/templates/${template.id}`} className="font-medium text-primary hover:underline">
                        {template.name}
                      </Link>
                    </TableCell>
                    <TableCell>{template.tasks.length}</TableCell>
                    <TableCell>{getClientCount(template)}</TableCell>
                    <TableCell>
                      <div className="flex -space-x-2 overflow-hidden">
                        {getTeamMemberNames(template).length > 0 ? (
                          getTeamMemberNames(template).map((member) => (
                            <Avatar key={member.id} className="border-2 border-background size-8">
                              <div className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground text-xs uppercase">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            </Avatar>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {currentItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No templates found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, templates?.length || 0)} of {templates?.length || 0} items
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                  </PaginationLink>
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            
            <div className="text-sm text-muted-foreground">
              {itemsPerPage} rows per page
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplatesPage;
