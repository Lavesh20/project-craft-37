
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchClients, fetchTeamMembers, deleteClient } from '@/services/api';
import { Building2, Plus, MoreVertical, Search, Filter, RefreshCw, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import NewClientForm from '@/components/clients/NewClientForm';
import { Client, TeamMember } from '@/types';

const Clients: React.FC = () => {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Fetch clients data
  const { 
    data: clients = [], 
    isLoading: clientsLoading,
    refetch: refetchClients
  } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  // Fetch team members for the new client form
  const { 
    data: teamMembers = [], 
    isLoading: teamMembersLoading 
  } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers
  });

  // Filter clients based on search and status
  const filteredClients = React.useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'active' ? client.isActive !== false :
        client.isActive === false;
      
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  // Handle opening delete confirmation
  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  // Handle client deletion
  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      await deleteClient(clientToDelete.id);
      toast.success('Client deleted successfully');
      refetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    } finally {
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clients</h1>
          <Button
            onClick={() => setIsNewClientDialogOpen(true)}
            className="bg-jetpack-blue hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search clients..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Status: {statusFilter === 'all' ? 'All' : statusFilter === 'active' ? 'Active' : 'Inactive'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                    Inactive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" onClick={() => refetchClients()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {clientsLoading ? (
            <div className="p-6 space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-10 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? "Try adjusting your search or filters" 
                  : "Add your first client to get started"}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button 
                  onClick={() => setIsNewClientDialogOpen(true)}
                  className="bg-jetpack-blue hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Client
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredClients.map(client => (
                <div key={client.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <Link to={`/clients/${client.id}`} className="block">
                        <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800">
                          {client.name}
                        </h3>
                      </Link>
                      {client.description && (
                        <p className="text-gray-500 mt-1">{client.description}</p>
                      )}
                      <div className="flex items-center mt-2 space-x-2">
                        {client.isActive === false ? (
                          <Badge variant="outline" className="bg-gray-100">Inactive</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        )}
                        {client.priority && client.priority !== 'None' && (
                          <Badge className={`
                            ${client.priority === 'High' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                              client.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                              'bg-blue-100 text-blue-800 hover:bg-blue-100'}
                          `}>
                            {client.priority} Priority
                          </Badge>
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
                          <Link to={`/clients/${client.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/projects/new" state={{ preselectedClientId: client.id }}>
                            Create Project
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/contacts/new" state={{ preselectedClientId: client.id }}>
                            Add Contact
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteClick(client)}
                        >
                          Delete Client
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

      {/* New Client Dialog */}
      <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Client</DialogTitle>
          </DialogHeader>
          <NewClientForm 
            teamMembers={teamMembers}
            onSuccess={() => {
              setIsNewClientDialogOpen(false);
              refetchClients();
            }}
            onCancel={() => setIsNewClientDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              This will permanently delete the client and all associated data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> Deleting this client will also remove all associated contacts and projects.
            </p>
          </div>
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
              Delete Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Clients;
