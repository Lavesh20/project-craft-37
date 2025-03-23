
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Contact, Client } from '@/types';
import { fetchContacts, fetchClient } from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, MapPin, Building, Edit, ExternalLink } from 'lucide-react';

const ContactDetails: React.FC = () => {
  const { contactId } = useParams<{ contactId: string }>();
  
  // Fetch all contacts
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  });
  
  // Find the specific contact
  const contact = contacts.find((c: Contact) => c.id === contactId);
  
  // Fetch associated client if contact has a clientId
  const { data: client, isLoading: clientLoading } = useQuery({
    queryKey: ['client', contact?.clientId],
    queryFn: () => contact?.clientId ? fetchClient(contact.clientId) : null,
    enabled: !!contact?.clientId,
  });
  
  const isLoading = contactsLoading || (contact?.clientId && clientLoading);
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <Skeleton className="h-10 w-40" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  if (!contact) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="bg-white rounded-md shadow p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Not Found</h2>
            <p className="text-gray-600 mb-6">The contact you're looking for doesn't exist or has been removed.</p>
            <Link to="/contacts">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Contacts
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link to="/contacts">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Contact Details</h1>
          </div>
          <Button className="bg-jetpack-blue hover:bg-blue-700" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Contact
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{contact.name}</CardTitle>
                {contact.isPrimaryContact && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Primary Contact</Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                  
                  {contact.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <a href={`tel:${contact.phone}`} className="text-gray-900">
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {(contact.street || contact.city || contact.state || contact.postalCode) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Address</h3>
                        <div className="text-gray-900">
                          {contact.street && <div>{contact.street}</div>}
                          {(contact.city || contact.state || contact.postalCode) && (
                            <div>
                              {contact.city && `${contact.city}, `}
                              {contact.state && `${contact.state} `}
                              {contact.postalCode && contact.postalCode}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Associated Client</h3>
                      {client ? (
                        <Link to={`/clients/${client.id}`} className="text-blue-600 hover:underline flex items-center gap-1">
                          {client.name} <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="text-gray-500">No associated client</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {client && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Client Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Name</h3>
                      <p className="text-gray-900">{client.name}</p>
                    </div>
                    
                    {client.website && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Website</h3>
                        <a 
                          href={client.website}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline"
                        >
                          {client.website}
                        </a>
                      </div>
                    )}
                    
                    {client.location && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Location</h3>
                        <p className="text-gray-900">{client.location}</p>
                      </div>
                    )}
                    
                    {client.services && client.services.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Services</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {client.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-100">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <Link to={`/clients/${client.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Client Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          Last edited: {new Date(contact.lastEdited).toLocaleString()}
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactDetails;
