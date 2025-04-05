import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OpenWorkSectionProps {
  clientId: string;
}

// Direct API functions
const getClientSeries = async (clientId: string) => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(`/api/clients/${clientId}/series`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching client series:', error);
    return [];
  }
};

const getClientProjects = async (clientId: string) => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(`/api/clients/${clientId}/projects`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching client projects:', error);
    return [];
  }
};

// Mock types for series
interface Series {
  id: string;
  name: string;
  frequency: string;
  templateId?: string;
  templateName?: string;
}

const OpenWorkSection: React.FC<OpenWorkSectionProps> = ({ clientId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch series for this client (mock)
  const { data: series = [], isLoading: seriesLoading } = useQuery({
    queryKey: ['client-series', clientId],
    queryFn: () => getClientSeries(clientId),
  });

  // Fetch projects for this client
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['client-projects', clientId],
    queryFn: () => getClientProjects(clientId),
  });

  // Calculate pagination for series
  const seriesArray = Array.isArray(series) ? series : [];
  const totalPages = Math.ceil(seriesArray.length / itemsPerPage);
  const paginatedSeries = seriesArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Open Work</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="series">
          <TabsList className="grid grid-cols-2 mb-4 w-64">
            <TabsTrigger value="series">Series</TabsTrigger>
            <TabsTrigger value="one-off">One-off Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="series">
            {seriesLoading ? (
              <div className="h-32 bg-gray-100 animate-pulse rounded-md"></div>
            ) : paginatedSeries.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                <p className="text-gray-600 mb-2">No series found for this client</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                >
                  Create your first Series
                </Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">SERIES</TableHead>
                      <TableHead className="w-[30%]">FREQUENCY</TableHead>
                      <TableHead className="w-[30%]">ASSOCIATED TEMPLATE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSeries.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.frequency}</TableCell>
                        <TableCell>{item.templateName || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {series.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">
                      Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, series.length)} of {series.length} Associated Series
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="one-off">
            {projectsLoading ? (
              <div className="h-32 bg-gray-100 animate-pulse rounded-md"></div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No one-off projects found for this client.</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                >
                  Create your first Project
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map(project => (
                  <div 
                    key={project.id}
                    className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        {project.description && (
                          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OpenWorkSection;
