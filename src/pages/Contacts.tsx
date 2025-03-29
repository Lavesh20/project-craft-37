import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchContacts, fetchClients, deleteContact } from '@/services/api';
import { User, Plus, MoreVertical, Search, Mail, Phone, Building2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import MainLayout from '@/components/layout/MainLayout';
import NewContactForm from '@/components/contacts/NewContactForm';
import { Contact, Client } from '@/types';

const Contacts: React.FC = () => {
  const [isNewContactDialogOpen, setIsNewContactDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    data: contacts = [], 
    isLoading: contactsLoading,
    refetch: refetchContacts
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts
  });

  const { 
    data: clients = [], 
    isLoading: clientsLoading
  } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  const filteredContacts = React.useMemo(() => {
    return contacts.filter(contact => {
      const searchLower = searchQuery.toLowerCase();
      return (
        contact.name.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        (contact.phone && contact.phone.includes(searchQuery))
      );
    });
  }, [contacts, searchQuery]);

  const getClientName = (clientId?: string): string => {
    if (!clientId) return 'No Associated Client';
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;
    
    try {
      await deleteContact(contactToDelete.id);
      toast.success('Contact deleted successfully');
      refetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    } finally {
      setIsDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Contacts</h1>
          <Button
            onClick={() => setIsNewContactDialogOpen(true)}
            className="bg-jetpack-blue hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Contact
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {contactsLoading || clientsLoading ? (
            <div className="p-6 space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-10 text-center">
              <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? "Try adjusting your search" 
                  : "Add your first contact to get started"}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsNewContactDialogOpen(true)}
                  className="bg-jetpack-blue hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Contact
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredContacts.map(contact => (
                <div key={contact.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <Link to={`/contacts/${contact.id}`} className="block">
                        <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800">
                          {contact.name}
                          {contact.isPrimaryContact && (
                            <Badge className="ml-2 bg-green-100 text-green-800">Primary</Badge>
                          )}
                        </h3>
                      </Link>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{contact.email}</span>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        {contact.clientId && (
                          <div className="flex items-center text-gray-600">
                            <Building2 className="h-4 w-4 mr-2" />
                            <Link 
                              to={`/clients/${contact.clientId}`} 
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {getClientName(contact.clientId)}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/contacts/${contact.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {!contact.clientId && (
                          <DropdownMenuItem asChild>
                            <Link to={`/contacts/${contact.id}/edit`}>
                              Associate with Client
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteClick(contact)}
                        >
                          Delete Contact
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isNewContactDialogOpen} onOpenChange={setIsNewContactDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Contact</DialogTitle>
          </DialogHeader>
          <NewContactForm />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              This will permanently delete this contact. This action cannot be undone.
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
              onClick={handleConfirmDelete}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Contacts;
