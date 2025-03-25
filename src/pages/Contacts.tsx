
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpDown, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchContacts, fetchClients } from '@/services/api';
import { Contact } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import NewContactForm from '@/components/contacts/NewContactForm';

const Contacts: React.FC = () => {
  const [isNewContactDialogOpen, setIsNewContactDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: 'name' | 'email' | 'isPrimaryContact' | 'client';
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  // Fetch contacts
  const { 
    data: contacts = [], 
    isLoading: contactsLoading 
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  });

  // Fetch clients for reference
  const { 
    data: clients = [], 
    isLoading: clientsLoading 
  } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  // Make sure contacts and clients are arrays
  const contactsArray = Array.isArray(contacts) ? contacts : [];
  const clientsArray = Array.isArray(clients) ? clients : [];

  const isLoading = contactsLoading || clientsLoading;

  // Sorting function
  const sortedContacts = React.useMemo(() => {
    const sortableItems = [...contactsArray];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'client') {
          const clientA = clientsArray.find(c => c.id === a.clientId)?.name || '';
          const clientB = clientsArray.find(c => c.id === b.clientId)?.name || '';
          if (clientA < clientB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (clientA > clientB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        } else {
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];
          
          if (aValue === undefined && bValue === undefined) return 0;
          if (aValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
          if (bValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
          
          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }
      });
    }
    return sortableItems;
  }, [contactsArray, clientsArray, sortConfig]);

  // Request sort function
  const requestSort = (key: 'name' | 'email' | 'isPrimaryContact' | 'client') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get client name by ID
  const getClientName = (clientId?: string) => {
    if (!clientId) return '';
    const client = clientsArray.find(c => c.id === clientId);
    return client ? client.name : '';
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Contacts</h1>
          <Button 
            className="bg-jetpack-blue hover:bg-blue-700 inline-flex items-center gap-2"
            onClick={() => setIsNewContactDialogOpen(true)}
          >
            <Plus size={16} />
            Create new contact
          </Button>
        </header>

        {isLoading ? (
          <div className="bg-white rounded-md shadow p-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : sortedContacts.length === 0 ? (
          <div className="bg-white rounded-md shadow p-6">
            <p className="text-gray-500 text-center py-8">
              No contacts available. Create your first contact to get started.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-md shadow">
            <div className="flex justify-between items-center p-4 border-b">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter size={14} />
                Filter
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => requestSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>NAME</span>
                        <ArrowUpDown size={14} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => requestSort('email')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>EMAIL</span>
                        <ArrowUpDown size={14} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => requestSort('isPrimaryContact')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>PRIMARY CONTACT</span>
                        <ArrowUpDown size={14} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => requestSort('client')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>CLIENT</span>
                        <ArrowUpDown size={14} />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedContacts.map((contact: Contact) => (
                    <TableRow key={contact.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <Link to={`/contacts/${contact.id}`} className="text-blue-600 hover:text-blue-800">
                          {contact.name}
                        </Link>
                      </TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>
                        {contact.isPrimaryContact ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell>
                        {contact.clientId && (
                          <Link to={`/clients/${contact.clientId}`} className="text-blue-600 hover:text-blue-800">
                            {getClientName(contact.clientId)}
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center p-4 border-t">
              <div className="text-sm text-gray-500">
                Showing 1-{sortedContacts.length} of {sortedContacts.length} items
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500">
                  20 rows per page
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <ChevronLeft size={14} />
                  </Button>
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Dialog open={isNewContactDialogOpen} onOpenChange={setIsNewContactDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl">New Contact</DialogTitle>
            </DialogHeader>
            <NewContactForm 
              onCancel={() => setIsNewContactDialogOpen(false)}
              afterSubmit={() => setIsNewContactDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Contacts;
