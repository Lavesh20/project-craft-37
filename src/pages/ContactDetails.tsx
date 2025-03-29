
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchContact, fetchClients, updateContact, deleteContact } from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Building2, Pencil, Trash, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

const ContactDetails: React.FC = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch contact data
  const { 
    data: contact, 
    isLoading: contactLoading,
    isError: contactError
  } = useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => contactId ? fetchContact(contactId) : Promise.reject('No contact ID provided'),
    enabled: !!contactId
  });

  // Fetch clients for displaying client name
  const { 
    data: clients = []
  } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  // Get client name from ID
  const clientName = contact?.clientId 
    ? clients.find(c => c.id === contact.clientId)?.name || 'Unknown Client'
    : null;

  // Mutation for deleting contact
  const deleteContactMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      toast.success('Contact deleted successfully');
      navigate('/contacts');
    },
    onError: (error) => {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
      setIsDeleteDialogOpen(false);
    }
  });

  // Handle contact deletion
  const handleDeleteContact = () => {
    if (!contactId) return;
    deleteContactMutation.mutate(contactId);
  };

  // Handle primary contact toggle
  const handleTogglePrimaryContact = async () => {
    if (!contact || !contact.clientId) return;
    
    try {
      await updateContact(contact.id, {
        ...contact,
        isPrimaryContact: !contact.isPrimaryContact
      });
      
      queryClient.invalidateQueries({ queryKey: ['contact', contactId] });
      queryClient.invalidateQueries({ queryKey: ['client-contacts', contact.clientId] });
      
      toast.success(
        contact.isPrimaryContact 
          ? 'Contact is no longer the primary contact' 
          : 'Contact set as primary contact'
      );
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    }
  };

  if (contactLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <Skeleton className="h-8 w-8 mr-2" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Skeleton className="h-60 w-full" />
            </div>
            <div>
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (contactError || !contact) {
    return (
      <MainLayout>
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-medium mb-2">Contact not found</h2>
            <p className="text-gray-500 mb-4">The contact you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button asChild>
              <Link to="/contacts">Back to Contacts</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/contacts')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Contacts
          </Button>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {contact.name}
              {contact.isPrimaryContact && (
                <Badge className="ml-2 bg-green-100 text-green-800">Primary Contact</Badge>
              )}
            </h1>
            {clientName && (
              <div className="flex items-center mt-1 text-gray-600">
                <Building2 className="h-4 w-4 mr-1" />
                <Link 
                  to={`/clients/${contact.clientId}`} 
                  className="text-blue-600 hover:text-blue-800"
                >
                  {clientName}
                </Link>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            {contact.clientId && (
              <Button 
                variant="outline" 
                onClick={handleTogglePrimaryContact}
              >
                {contact.isPrimaryContact ? 'Remove as Primary' : 'Make Primary Contact'}
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={() => navigate(`/contacts/${contact.id}/edit`)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div>{contact.email}</div>
                  </div>
                </div>
                
                {contact.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div>{contact.phone}</div>
                    </div>
                  </div>
                )}

                {(contact.street || contact.city || contact.state || contact.postalCode) && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div>
                        {contact.street && <div>{contact.street}</div>}
                        {(contact.city || contact.state || contact.postalCode) && (
                          <div>
                            {contact.city && `${contact.city}, `}
                            {contact.state && `${contact.state} `}
                            {contact.postalCode}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!contact.clientId ? (
                  <Button className="w-full">
                    Associate with Client
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      updateContact(contact.id, { ...contact, clientId: undefined, isPrimaryContact: false })
                        .then(() => {
                          queryClient.invalidateQueries({ queryKey: ['contact', contactId] });
                          toast.success('Contact removed from client');
                        })
                        .catch(error => {
                          console.error('Error removing contact from client:', error);
                          toast.error('Failed to remove contact from client');
                        });
                    }}
                  >
                    Remove from Client
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/projects/new", { state: { contactId: contact.id } })}
                >
                  Create Project
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
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
              onClick={handleDeleteContact}
              disabled={deleteContactMutation.isPending}
            >
              {deleteContactMutation.isPending ? 'Deleting...' : 'Delete Contact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ContactDetails;
