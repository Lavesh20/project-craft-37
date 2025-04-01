
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTemplates, fetchClients } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { mockData } from '@/services/mock';
import { Template, Client } from '@/types';

const Templates: React.FC = () => {
  const { toast } = useToast();
  
  // Fetch templates using React Query with error handling
  const { 
    data: templates = [], 
    isLoading: templatesLoading, 
    error: templatesError,
    refetch: refetchTemplates
  } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
    initialData: [],
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch templates:', error);
        toast({
          title: 'Error',
          description: 'Failed to load templates. Using mock data instead.',
          variant: 'destructive',
        });
      }
    }
  });

  // Fetch clients for reference with fallback to mock data
  const { 
    data: clients = [], 
    isLoading: clientsLoading, 
    error: clientsError 
  } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    initialData: [],
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch clients:', error);
        toast({
          title: 'Error',
          description: 'Failed to load client data. Using mock data instead.',
          variant: 'destructive',
        });
      }
    }
  });

  // Log data for debugging
  useEffect(() => {
    console.log('Templates data:', templates);
    console.log('Templates loading:', templatesLoading);
    console.log('Templates error:', templatesError);
    console.log('Clients data:', clients);
    console.log('Clients loading:', clientsLoading);
    console.log('Clients error:', clientsError);
  }, [templates, templatesLoading, templatesError, clients, clientsLoading, clientsError]);

  // Ensure templates and clients are arrays
  const templatesArray = Array.isArray(templates) ? templates : [];
  const clientsArray = Array.isArray(clients) ? clients : [];

  const isLoading = templatesLoading || clientsLoading;
  const hasError = templatesError || clientsError;

  // Helper function to get client names for a template
  const getClientNames = (clientIds: string[] = []) => {
    if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) return 'No clients';
    if (!clientsArray || clientsArray.length === 0) return 'Loading clients...';
    
    const templateClients = clientsArray.filter(client => 
      client && client.id && clientIds.includes(client.id)
    );
    
    if (!templateClients.length) return 'No clients';
    
    return templateClients.map(client => client.name).join(', ');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Force refetch if there are no templates initially
  useEffect(() => {
    if (templatesArray.length === 0 && !templatesLoading) {
      console.log('No templates found, triggering refetch...');
      refetchTemplates();
    }
  }, [templatesArray.length, templatesLoading, refetchTemplates]);

  return (
    <MainLayout>
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Templates</h1>
          <Link to="/templates/new">
            <Button className="bg-jetpack-blue hover:bg-blue-700 inline-flex items-center gap-2">
              <Plus size={16} />
              New Template
            </Button>
          </Link>
        </header>
        
        {isLoading ? (
          <div className="bg-white rounded-md shadow p-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : hasError ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow">
            <p className="text-red-700">
              There was an error loading the data. Using mock data instead.
            </p>
            <Button 
              onClick={() => refetchTemplates()} 
              variant="outline" 
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : templatesArray.length === 0 ? (
          <div className="bg-white rounded-md shadow p-6">
            <p className="text-gray-500 text-center py-8">
              No templates available. Create your first template to get started.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={() => refetchTemplates()} 
                variant="outline" 
                className="mt-2"
              >
                Refresh Templates
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-md shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clients</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Edited</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {templatesArray.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{template.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {Array.isArray(template.tasks) ? template.tasks.length : 0} tasks
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {getClientNames(template.clientIds)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(template.lastEdited)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Link 
                            to={`/templates/${template.id}`} 
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Templates;
