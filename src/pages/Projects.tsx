import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Plus, MoreVertical, Search, Filter, Building2, Calendar, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import ProjectModal from '@/components/projects/ProjectModal';
import MainLayout from '@/components/layout/MainLayout';
import { Project, Client } from '@/types';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not-started' | 'in-progress' | 'complete'>('all');

  // Direct API function for fetching projects
  const fetchProjects = async (): Promise<Project[]> => {
    try {
      console.log('Fetching projects...');
      const token = localStorage.getItem('auth_token');
      const controller = new AbortController();
      
      const response = await axios.get('/api/projects', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        signal: controller.signal
      });
      
      console.log('Projects fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Error fetching projects:', error);
      }
      throw error;
    }
  };

  // Direct API function for fetching clients
  const fetchClients = async (): Promise<Client[]> => {
    try {
      console.log('Fetching clients...');
      const token = localStorage.getItem('auth_token');
      const controller = new AbortController();
      
      const response = await axios.get('/api/clients', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        signal: controller.signal
      });
      
      console.log('Clients fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Error fetching clients:', error);
      }
      throw error;
    }
  };

  // Direct API function for deleting a project
  const deleteProject = async (projectId: string): Promise<void> => {
    try {
      console.log(`Deleting project ${projectId}...`);
      const token = localStorage.getItem('auth_token');
      
      await axios.delete(`/api/projects/${projectId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      console.log(`Project ${projectId} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting project ${projectId}:`, error);
      throw error;
    }
  };

  // Fetch projects data
  const { 
    data: projects = [], 
    isLoading: projectsLoading,
    refetch: refetchProjects
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  // Fetch clients for displaying client names
  const { 
    data: clients = [], 
    isLoading: clientsLoading
  } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  // Filter projects based on search and status
  const filteredProjects = React.useMemo(() => {
    return projects.filter(project => {
      // Check if project name matches search query
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Check if client name matches search query
      const client = clients.find(c => c.id === project.clientId);
      const clientMatchesSearch = client 
        ? client.name.toLowerCase().includes(searchQuery.toLowerCase()) 
        : false;
      
      // Check if status matches filter
      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'not-started' ? project.status === 'Not Started' :
        statusFilter === 'in-progress' ? project.status === 'In Progress' :
        project.status === 'Complete';
      
      return (matchesSearch || clientMatchesSearch) && matchesStatus;
    });
  }, [projects, clients, searchQuery, statusFilter]);

  // Helper to get client name by ID
  const getClientName = (clientId: string): string => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  // Handle opening delete confirmation
  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  // Handle project deletion
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      await deleteProject(projectToDelete.id);
      toast.success('Project deleted successfully');
      refetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleProjectCreated = (projectId: string) => {
    setIsNewProjectModalOpen(false);
    refetchProjects();
    navigate(`/projects/${projectId}`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="bg-jetpack-blue hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search projects..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Status: {
                      statusFilter === 'all' ? 'All' : 
                      statusFilter === 'not-started' ? 'Not Started' : 
                      statusFilter === 'in-progress' ? 'In Progress' : 
                      'Complete'
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('not-started')}>
                    Not Started
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('in-progress')}>
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('complete')}>
                    Complete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {projectsLoading || clientsLoading ? (
            <div className="p-6 space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-10 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? "Try adjusting your search or filters" 
                  : "Add your first project to get started"}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button 
                  onClick={() => setIsNewProjectModalOpen(true)}
                  className="bg-jetpack-blue hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredProjects.map(project => (
                <div key={project.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`
                          inline-block rounded-full h-3 w-3
                          ${project.status === 'Complete' ? 'bg-green-500' : 
                            project.status === 'In Progress' ? 'bg-blue-500' : 
                            'bg-gray-400'}
                        `}></span>
                        <Link to={`/projects/${project.id}`} className="text-lg font-medium text-blue-600 hover:text-blue-800">
                          {project.name}
                        </Link>
                      </div>
                      
                      {project.description && (
                        <p className="text-gray-500 mb-2">{project.description}</p>
                      )}
                      
                      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
                        {project.clientId && (
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            <Link 
                              to={`/clients/${project.clientId}`} 
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {getClientName(project.clientId)}
                            </Link>
                          </div>
                        )}
                        
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Due {format(new Date(project.dueDate), 'MMM d, yyyy')}</span>
                        </div>
                        
                        {project.tasks?.length ? (
                          <div className="flex items-center">
                            <span>{project.tasks.filter(t => t.status === 'Complete').length}/{project.tasks.length} tasks complete</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/projects/${project.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/projects/${project.id}/edit`}>
                            Edit Project
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteClick(project)}
                        >
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <ProjectModal 
          onClose={() => setIsNewProjectModalOpen(false)}
          onCreated={handleProjectCreated}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              This will permanently delete the project and all associated tasks. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Projects;
