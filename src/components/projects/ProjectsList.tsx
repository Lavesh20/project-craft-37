
import React, { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProjects, fetchClients } from '@/services/api';
import { Project, FilterOptions, TableColumn, Client } from '@/types';
import { Filter, Pencil, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProjectModal from './ProjectModal';
import { useQuery } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterOptions>({ timeframe: 'this-month' });
  const [sortColumn, setSortColumn] = useState<string | null>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Use React Query to fetch projects and clients
  const { data: projects = [], isLoading: projectsLoading, refetch: refetchProjects } = useQuery({
    queryKey: ['projects', filter],
    queryFn: () => fetchProjects(filter),
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });
  
  const [columns, setColumns] = useState<TableColumn[]>([
    { id: 'name', label: 'NAME', visible: true, sortable: true },
    { id: 'client', label: 'CLIENT', visible: true, sortable: true },
    { id: 'labels', label: 'LABELS', visible: true },
    { id: 'dueDate', label: 'DUE', visible: true, sortable: true },
    { id: 'status', label: 'STATUS', visible: true, sortable: true },
    { id: 'assignee', label: 'NEXT ASSIGNEE', visible: true, sortable: true },
    { id: 'lastEdited', label: 'LAST EDITED', visible: true, sortable: true }
  ]);

  const handleCreateProject = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      // Toggle sort direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilter(prev => ({ ...prev, [key]: value }));
    refetchProjects();
  };

  // Get client name by ID with proper logging
  const getClientNameById = (clientId: string): string => {
    if (clientsLoading) {
      return 'Loading...';
    }
    
    if (!clients || clients.length === 0) {
      return 'No clients data';
    }
    
    const client = clients.find(client => client.id === clientId);
    if (!client) {
      return 'Unknown Client';
    }
    
    return client.name;
  };

  const getSortedProjects = () => {
    if (!sortColumn) return projects;

    return [...projects].sort((a, b) => {
      let valueA, valueB;

      switch (sortColumn) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'client':
          valueA = getClientNameById(a.clientId).toLowerCase();
          valueB = getClientNameById(b.clientId).toLowerCase();
          break;
        case 'dueDate':
          valueA = new Date(a.dueDate).getTime();
          valueB = new Date(b.dueDate).getTime();
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        case 'assignee':
          valueA = a.assigneeId || '';
          valueB = b.assigneeId || '';
          break;
        case 'lastEdited':
          valueA = new Date(a.lastEdited).getTime();
          valueB = new Date(b.lastEdited).getTime();
          break;
        default:
          return 0;
      }

      const result = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return sortDirection === 'asc' ? result : -result;
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd');
  };

  // Calculate relative time for last edited
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: false });
  };

  const visibleColumns = columns.filter(col => col.visible);
  const sortedProjects = getSortedProjects();
  const loading = projectsLoading || clientsLoading;
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
          <Button 
            onClick={handleCreateProject}
            className="bg-jetpack-blue hover:bg-blue-700 transition-colors"
          >
            Create project
          </Button>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter size={16} />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Timeframe</h4>
                    <Select
                      value={filter.timeframe || 'all'}
                      onValueChange={(value) => handleFilterChange('timeframe', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All time</SelectItem>
                        <SelectItem value="this-week">This week</SelectItem>
                        <SelectItem value="this-month">This month</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Status</h4>
                    <Select
                      value={filter.status || 'all'}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {clients?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Client</h4>
                      <Select
                        value={filter.client || 'all'}
                        onValueChange={(value) => handleFilterChange('client', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All clients</SelectItem>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline" className="flex items-center gap-1">
              <Pencil size={16} />
              Edit Columns
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Loading projects...</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    {visibleColumns.map(column => (
                      <th 
                        key={column.id} 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.sortable ? (
                          <div 
                            className="cursor-pointer flex items-center gap-1"
                            onClick={() => handleSort(column.id)}
                          >
                            {column.label}
                            {sortColumn === column.id && (
                              sortDirection === 'asc' ? 
                                <ArrowUp size={14} /> : 
                                <ArrowDown size={14} />
                            )}
                          </div>
                        ) : (
                          column.label
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedProjects.length === 0 ? (
                    <tr>
                      <td colSpan={visibleColumns.length} className="px-6 py-8 text-center text-gray-500">
                        No projects found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    sortedProjects.map(project => (
                      <tr 
                        key={project.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleProjectClick(project.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {project.status === 'Complete' && (
                              <span className="text-green-500 mr-2">
                                <Check size={20} />
                              </span>
                            )}
                            <div className="font-medium text-gray-900">{project.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-blue-600 hover:text-blue-800">
                            {getClientNameById(project.clientId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {project.labels?.map(label => (
                              <Badge key={label} variant="outline" className="bg-gray-100 text-gray-800">
                                {label}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant="outline" 
                            className="bg-gray-100 text-gray-800"
                          >
                            {formatDate(project.dueDate)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            className={`
                              ${project.status === 'Complete' ? 'bg-jetpack-green text-green-800' : 
                               project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                               'bg-gray-100 text-gray-800'}
                            `}
                          >
                            {project.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {/* This would be a team member lookup in a real app */}
                            {project.assigneeId === 'user-1' ? 'John Doe' : 
                             project.assigneeId === 'user-2' ? 'Jane Smith' : 
                             project.assigneeId === 'user-3' ? 'Vyas' : '—'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {getRelativeTime(project.lastEdited)} ago
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div>
                Showing 1-{sortedProjects.length} of {sortedProjects.length} items
              </div>
              <div>
                20 rows per page
              </div>
            </div>
          </>
        )}
      </div>
      
      {isModalOpen && (
        <ProjectModal onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProjectsList;
