
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchContact, fetchClient } from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, Mail, Building, MapPin, ArrowLeft, Edit, User, Link as LinkIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const ContactDetails: React.FC = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();

  // Fetch contact details
  const { 
    data: contact, 
    isLoading: contactLoading,
    error: contactError,
  } = useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => contactId ? fetchContact(contactId) : undefined,
    enabled: !!contactId,
  });

  // Fetch associated client details if contact has a clientId
  const { 
    data: client, 
    isLoading: clientLoading,
  } = useQuery({
    queryKey: ['client', contact?.clientId],
    queryFn: () => contact?.clientId ? fetchClient(contact.clientId) : undefined,
    enabled: !!contact?.clientId,
  });

  const isLoading = contactLoading || (contact?.clientId && clientLoading);

  if (contactError) {
    return (
      <MainLayout>
        <div className="container mx-auto py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error loading contact details. The contact may not exist or has been deleted.
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            className="mr-4"
            onClick={() => navigate('/contacts')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Button>
          
          <h1 className="text-2xl font-bold flex-1">
            {isLoading ? <Skeleton className="h-8 w-48" /> : contact?.name}
          </h1>
          
          <Button className="bg-jetpack-blue hover:bg-blue-700">
            <Edit className="h-4 w-4 mr-2" />
            Edit Contact
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <User className="text-gray-400 mt-0.5" size={18} />
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Name</div>
                        <div>{contact?.name}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Mail className="text-gray-400 mt-0.5" size={18} />
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Email</div>
                        <div>{contact?.email}</div>
                      </div>
                    </div>
                    
                    {contact?.phone && (
                      <div className="flex items-start space-x-3">
                        <Phone className="text-gray-400 mt-0.5" size={18} />
                        <div>
                          <div className="text-sm text-gray-500 font-medium">Phone</div>
                          <div>{contact.phone}</div>
                        </div>
                      </div>
                    )}
                    
                    {contact?.isPrimaryContact && (
                      <div className="flex items-start space-x-3">
                        <User className="text-gray-400 mt-0.5" size={18} />
                        <div>
                          <div className="text-sm text-gray-500 font-medium">Primary Contact</div>
                          <div className="text-green-600 font-medium">Yes</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {(contact?.street || contact?.city || contact?.state || contact?.postalCode) && (
                    <div>
                      <h3 className="text-sm text-gray-500 font-medium mb-2 flex items-center">
                        <MapPin className="text-gray-400 mr-2" size={18} />
                        Address
                      </h3>
                      <div className="pl-6">
                        {contact.street && <div>{contact.street}</div>}
                        <div>
                          {[contact.city, contact.state, contact.postalCode]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {contact?.lastEdited && (
                    <div className="text-sm text-gray-500 border-t pt-3 mt-4">
                      Last updated {format(parseISO(contact.lastEdited), 'MMMM d, yyyy h:mm a')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Client Association</CardTitle>
                </CardHeader>
                <CardContent>
                  {contact?.clientId ? (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Building className="text-gray-400 mt-0.5" size={18} />
                        <div>
                          <div className="text-sm text-gray-500 font-medium">Associated With</div>
                          <Link to={`/clients/${client?.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                            {client?.name}
                          </Link>
                        </div>
                      </div>
                      
                      {client?.website && (
                        <div className="flex items-start space-x-3">
                          <LinkIcon className="text-gray-400 mt-0.5" size={18} />
                          <div>
                            <div className="text-sm text-gray-500 font-medium">Website</div>
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
                      
                      {client?.location && (
                        <div className="flex items-start space-x-3">
                          <MapPin className="text-gray-400 mt-0.5" size={18} />
                          <div>
                            <div className="text-sm text-gray-500 font-medium">Location</div>
                            <div>{client.location}</div>
                          </div>
                        </div>
                      )}
                      
                      <Button variant="outline" className="w-full mt-4" onClick={() => navigate(`/clients/${client?.id}`)}>
                        <Building className="h-4 w-4 mr-2" />
                        View Client Details
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Building className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                      <p>This contact is not associated with any client.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ContactDetails;
