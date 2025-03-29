
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchClients, fetchTemplates } from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import TrialBanner from '@/components/layout/TrialBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Plus, FileText, Users, Copy } from 'lucide-react';

const Index: React.FC = () => {
  // Fetch data for dashboard summary
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates
  });

  // Calculate dashboard metrics
  const activeProjects = projects.filter(p => p.status !== 'Complete').length;
  const completedProjects = projects.filter(p => p.status === 'Complete').length;
  const activeClients = clients.filter(c => c.isActive !== false).length;

  return (
    <MainLayout>
      <TrialBanner />
      
      <div className="container mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Project stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{activeProjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedProjects} projects completed
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Client stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {clientsLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{activeClients}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {clients.length} total clients
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Template stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <Copy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {templatesLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{templates.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Save time with workflow templates
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/projects/new">
            <Button className="w-full bg-jetpack-blue hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </Link>
          <Link to="/clients/new">
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" /> New Client
            </Button>
          </Link>
          <Link to="/templates/new">
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" /> New Template
            </Button>
          </Link>
        </div>
        
        {/* Recent Projects Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Projects</CardTitle>
              <Link to="/projects" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No projects found</p>
                <Link to="/projects/new">
                  <Button>Create your first project</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map(project => (
                  <Link key={project.id} to={`/projects/${project.id}`}>
                    <div className="p-4 border rounded-md hover:bg-gray-50 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-gray-500">
                          {clients.find(c => c.id === project.clientId)?.name || 'Unknown Client'}
                        </p>
                      </div>
                      <span className={`
                        px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${project.status === 'Complete' ? 'bg-green-100 text-green-800' : 
                          project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {project.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;
