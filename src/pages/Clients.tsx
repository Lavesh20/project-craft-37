
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchClients } from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Building, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const Clients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientForm, setShowClientForm] = useState(false);
  
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });
  
  // Ensure clients is an array before using filter
  const clientsArray = Array.isArray(clients) ? clients : [];
  
  const filteredClients = clientsArray.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.description && client.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const activeClients = filteredClients.filter(client => client.isActive);
  const inactiveClients = filteredClients.filter(client => !client.isActive);
  
  const handleClientClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6">
          <Skeleton className="h-12 w-48 mb-6" />
          <div className="grid gap-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Clients</h1>
          <Button onClick={() => setShowClientForm(true)} className="bg-jetpack-blue hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <Input 
            placeholder="Search clients..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid grid-cols-2 w-56">
            <TabsTrigger value="active">Active ({activeClients.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({inactiveClients.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeClients.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Building className="mx-auto mb-3 text-gray-400" size={40} />
                  <p className="text-gray-500">No active clients found</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowClientForm(true)}
                  >
                    Add Your First Client
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Primary Contact</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeClients.map((client) => (
                    <TableRow 
                      key={client.id} 
                      className="cursor-pointer"
                      onClick={() => handleClientClick(client.id)}
                    >
                      <TableCell className="font-medium hover:underline">
                        {client.name}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`
                            ${client.priority === 'High' ? 'bg-red-100 text-red-800' : 
                              client.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                              client.priority === 'Low' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'}
                          `}
                        >
                          {client.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.primaryContactName || '-'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(client.services) && client.services.slice(0, 2).map((service, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-50">
                              {service}
                            </Badge>
                          ))}
                          {Array.isArray(client.services) && client.services.length > 2 && (
                            <Badge variant="outline" className="bg-gray-50">
                              +{client.services.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          
          <TabsContent value="inactive">
            {inactiveClients.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">No inactive clients found</p>
                </CardContent>
              </Card>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Primary Contact</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inactiveClients.map((client) => (
                    <TableRow 
                      key={client.id} 
                      className="cursor-pointer"
                      onClick={() => handleClientClick(client.id)}
                    >
                      <TableCell className="font-medium hover:underline">
                        {client.name}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`
                            ${client.priority === 'High' ? 'bg-red-100 text-red-800' : 
                              client.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                              client.priority === 'Low' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'}
                          `}
                        >
                          {client.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.primaryContactName || '-'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(client.services) && client.services.slice(0, 2).map((service, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-50">
                              {service}
                            </Badge>
                          ))}
                          {Array.isArray(client.services) && client.services.length > 2 && (
                            <Badge variant="outline" className="bg-gray-50">
                              +{client.services.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-gray-100 text-gray-800">
                          Inactive
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Clients;
