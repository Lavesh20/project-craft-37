
import React, { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProjects } from '@/services/api';
import { Project, FilterOptions, TableColumn } from '@/types';
import { Filter, Pencil, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProjectModal from './ProjectModal';

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterOptions>({ timeframe: 'this-month' });
  const [sortColumn, setSortColumn] = useState<string | null>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [columns, setColumns] = useState<TableColumn[]>([
    { id: 'name', label: 'NAME', visible: true, sortable: true },
    { id: 'client', label: 'CLIENT', visible: true, sortable: true },
    { id: 'labels', label: 'LABELS', visible: true },
    { id: 'dueDate', label: 'DUE', visible: true, sortable: true },
    { id: 'status', label: 'STATUS', visible: true, sortable: true },
    { id: 'assignee', label: 'NEXT ASSIGNEE', visible: true, sortable: true },
    { id: 'lastEdited', label: 'LAST EDITED', visible: true, sortable: true }
  ]);

  useEffect(() => {
    loadProjects();
  }, [filter]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects(filter);
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    loadProjects(); // Reload projects when modal closes
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
          // In a real app, you'd have the client names here
          valueA = a.clientId;
          valueB = b.clientId;
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
            <Button variant="outline" className="flex items-center gap-1">
              <Filter size={16} />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <Pencil size={16} />
              Edit Columns
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <Badge variant="outline" className="bg-gray-100 hover:bg-gray-200 px-3 py-1 text-sm">
            This month
          </Badge>
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
                            className="table-header-cell"
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
                  {sortedProjects.map(project => (
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
                          {/* This would be a client name lookup in a real app */}
                          {project.clientId === 'client-1' ? 'Example Inc.' : 
                           project.clientId === 'client-2' ? 'ABC Company' : 'XYZ Corporation'}
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
                  ))}
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
