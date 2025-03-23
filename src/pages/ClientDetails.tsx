
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchClient, getClientProjects, getClientTemplates } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, User, Mail, MapPin, Globe, Tag, Calendar, MoreVertical, Pencil } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ClientEditForm from '@/components/clients/ClientEditForm';
import ClientContacts from '@/components/clients/ClientContacts';
import OpenWorkSection from '@/components/clients/OpenWorkSection';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ClientDetails = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const { data: client, isLoading: clientLoading } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientId ? fetchClient(clientId) : undefined,
    enabled: !!clientId,
  });

  if (clientLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
      </MainLayout>
    );
  }

  if (!client) {
    return (
      <MainLayout>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl text-red-500">Client not found</h2>
          <p className="mt-2">This client may have been deleted or you don't have access to it.</p>
        </div>
      </MainLayout>
    );
  }

  const handleEditSuccess = (updatedClient) => {
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {isEditing ? (
          <ClientEditForm 
            client={client} 
            onCancel={() => setIsEditing(false)} 
            onSuccess={handleEditSuccess} 
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{client.name}</h1>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Client
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/clients')}>
                      Back to Clients
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Delete Client
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Client Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Building className="text-gray-400 mt-0.5" size={20} />
                        <div>
                          <div className="font-medium text-sm text-gray-500">Description</div>
                          <div>{client.description || 'No description provided'}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <User className="text-gray-400 mt-0.5" size={20} />
                        <div>
                          <div className="font-medium text-sm text-gray-500">Primary Contact</div>
                          <div>{client.primaryContactName || 'No primary contact specified'}</div>
                        </div>
                      </div>
                      
                      {client.location && (
                        <div className="flex items-start gap-2">
                          <MapPin className="text-gray-400 mt-0.5" size={20} />
                          <div>
                            <div className="font-medium text-sm text-gray-500">Location</div>
                            <div>{client.location}</div>
                          </div>
                        </div>
                      )}
                      
                      {client.website && (
                        <div className="flex items-start gap-2">
                          <Globe className="text-gray-400 mt-0.5" size={20} />
                          <div>
                            <div className="font-medium text-sm text-gray-500">Website</div>
                            <a 
                              href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {client.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <div className="flex items-center gap-2 mr-4">
                        <Tag className="text-gray-400" size={16} />
                        <span className="font-medium text-sm text-gray-500">Priority:</span>
                        <Badge 
                          className={`
                            ${client.priority === 'High' ? 'bg-red-100 text-red-800' : 
                              client.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                              client.priority === 'Low' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'}
                          `}
                        >
                          {client.priority || 'None'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="rounded-full w-5 h-5 flex items-center justify-center">
                          <span className={`inline-block rounded-full w-3 h-3 ${client.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        </div>
                        <span className="font-medium text-sm text-gray-500">Status:</span>
                        <Badge 
                          className={`${client.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          {client.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    
                    {client.services && client.services.length > 0 && (
                      <div className="pt-4 border-t">
                        <div className="font-medium text-sm text-gray-500 mb-2">Services</div>
                        <div className="flex flex-wrap gap-2">
                          {client.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-50">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <OpenWorkSection clientId={client.id} />
              </div>
              
              <div>
                {clientId && <ClientContacts clientId={clientId} />}
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ClientDetails;
