
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchClientContacts, 
  associateContactWithClient, 
  removeContactFromClient, 
  fetchContacts 
} from '@/services/api';
import { Contact } from '@/types';
import { PlusCircle, User, Phone, Mail, ExternalLink, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface ClientContactsProps {
  clientId: string;
}

const ClientContacts: React.FC<ClientContactsProps> = ({ clientId }) => {
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [isRemoveContactDialogOpen, setIsRemoveContactDialogOpen] = useState(false);
  const [contactToRemove, setContactToRemove] = useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Fetch contacts for this client
  const { 
    data: clientContacts = [], 
    isLoading: clientContactsLoading,
  } = useQuery({
    queryKey: ['client-contacts', clientId],
    queryFn: () => fetchClientContacts(clientId),
  });

  // Fetch all contacts for the add dialog
  const { 
    data: allContacts = [], 
    isLoading: allContactsLoading,
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
    enabled: isAddContactDialogOpen,
  });

  // Mutation to associate a contact with this client
  const associateContactMutation = useMutation({
    mutationFn: associateContactWithClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-contacts', clientId] });
      toast.success('Contact added successfully');
      setIsAddContactDialogOpen(false);
      setSelectedContacts([]);
    },
    onError: (error) => {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact');
    },
  });

  // Mutation to remove a contact from this client
  const removeContactMutation = useMutation({
    mutationFn: removeContactFromClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-contacts', clientId] });
      toast.success('Contact removed successfully');
      setIsRemoveContactDialogOpen(false);
      setContactToRemove(null);
    },
    onError: (error) => {
      console.error('Error removing contact:', error);
      toast.error('Failed to remove contact');
    },
  });

  // Handler for adding selected contacts to client
  const handleAddContacts = () => {
    if (selectedContacts.length === 0) {
      toast.error('Please select at least one contact');
      return;
    }

    // Associate each selected contact with this client
    selectedContacts.forEach(contactId => {
      associateContactMutation.mutate({ contactId, clientId });
    });
  };

  // Handler for removing a contact from client
  const handleRemoveContact = () => {
    if (!contactToRemove) return;
    
    removeContactMutation.mutate({ 
      contactId: contactToRemove.id, 
      clientId 
    });
  };

  // Get available contacts (not already associated with this client)
  const getAvailableContacts = () => {
    if (!Array.isArray(allContacts) || !Array.isArray(clientContacts)) return [];
    
    return allContacts.filter(
      contact => !clientContacts.some(
        clientContact => clientContact.id === contact.id
      )
    );
  };

  // Toggle contact selection
  const toggleContactSelection = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  // Handler for opening remove contact dialog
  const openRemoveDialog = (contact: Contact) => {
    setContactToRemove(contact);
    setIsRemoveContactDialogOpen(true);
  };

  if (clientContactsLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Contacts</CardTitle>
        <Dialog open={isAddContactDialogOpen} onOpenChange={setIsAddContactDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Contact to Client</DialogTitle>
              <DialogDescription>
                Select contacts to associate with this client
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[300px] overflow-y-auto border rounded-md">
              {allContactsLoading ? (
                <div className="p-4 space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="divide-y">
                  {getAvailableContacts().length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No additional contacts available
                    </div>
                  ) : (
                    getAvailableContacts().map(contact => (
                      <div 
                        key={contact.id} 
                        className="flex items-center p-3 hover:bg-gray-50"
                      >
                        <Checkbox
                          id={`contact-${contact.id}`}
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={() => toggleContactSelection(contact.id)}
                          className="mr-3"
                        />
                        <div className="ml-2 flex-1">
                          <label
                            htmlFor={`contact-${contact.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {contact.name}
                          </label>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsAddContactDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddContacts}
                disabled={selectedContacts.length === 0 || associateContactMutation.isPending}
              >
                {associateContactMutation.isPending ? 'Adding...' : 'Add Selected Contacts'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!Array.isArray(clientContacts) || clientContacts.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No contacts associated with this client
          </div>
        ) : (
          <div className="divide-y">
            {clientContacts.map(contact => (
              <div key={contact.id} className="py-3 flex justify-between items-center">
                <div className="flex items-start space-x-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <Link 
                      to={`/contacts/${contact.id}`}
                      className="font-medium hover:text-blue-600"
                    >
                      {contact.name}
                      {contact.isPrimaryContact && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                    </Link>
                    <div className="text-sm flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-gray-500">
                        <Mail className="h-3 w-3 mr-1" />
                        {contact.email}
                      </div>
                      {contact.phone && (
                        <div className="flex items-center text-gray-500">
                          <Phone className="h-3 w-3 mr-1" />
                          {contact.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/contacts/${contact.id}`}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title="View contact details"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => openRemoveDialog(contact)}
                    className="p-1 text-gray-500 hover:text-red-600"
                    title="Remove contact from client"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Dialog for confirming contact removal */}
      <Dialog 
        open={isRemoveContactDialogOpen} 
        onOpenChange={setIsRemoveContactDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Contact from Client</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p>
              Are you sure you want to remove <span className="font-semibold">{contactToRemove?.name}</span> from this client?
            </p>
            <p className="text-sm text-gray-500 mt-1">
              This will not delete the contact, just remove the association with this client.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRemoveContactDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRemoveContact}
              disabled={removeContactMutation.isPending}
            >
              {removeContactMutation.isPending ? 'Removing...' : 'Remove Contact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ClientContacts;
