
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClientContacts, createContact, associateContactWithClient, removeContactFromClient } from '@/services/api';
import { Contact } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, UserPlus, X } from 'lucide-react';
import NewContactForm from '@/components/contacts/NewContactForm';

interface ClientContactsProps {
  clientId: string;
}

const ClientContacts: React.FC<ClientContactsProps> = ({ clientId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Fetch contacts for this client
  const { data: clientContacts = [], isLoading } = useQuery({
    queryKey: ['client-contacts', clientId],
    queryFn: () => fetchClientContacts(clientId),
  });

  // Mutation to remove a contact from a client
  const removeContactMutation = useMutation({
    mutationFn: removeContactFromClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-contacts', clientId] });
      toast({
        title: 'Success',
        description: 'Contact removed from client',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to remove contact: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  // Handle creating a new contact for this client
  const handleCreateContact = async (contactData: any) => {
    // Close the dialog
    setIsAddingContact(false);
    
    // Invalidate queries to refresh the data
    queryClient.invalidateQueries({ queryKey: ['client-contacts', clientId] });
    
    // Show success message
    toast({
      title: 'Success',
      description: 'Contact added to client',
    });
  };

  // Handle removing a contact from the client
  const handleRemoveContact = (contactId: string) => {
    removeContactMutation.mutate({ clientId, contactId });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg">Contacts</CardTitle>
        <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
              <UserPlus className="mr-1 h-4 w-4" />
              Add contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <NewContactForm 
              onCancel={() => setIsAddingContact(false)} 
              afterSubmit={handleCreateContact} 
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
          </div>
        ) : clientContacts.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <User className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p>No contacts associated with this client.</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-blue-600"
              onClick={() => setIsAddingContact(true)}
            >
              Add your first contact
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {clientContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-3 w-3 mr-1" /> {contact.email}
                    </div>
                    {contact.phone && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" /> {contact.phone}
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveContact(contact.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientContacts;
