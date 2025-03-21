
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Filter, 
  Import, 
  Download, 
  Plus, 
  ArrowUpAZ, 
  ArrowDownAZ, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import NewClientForm from '@/components/clients/NewClientForm';
import { Client, TeamMember } from '@/types';
import { fetchClients, fetchTeamMembers } from '@/services/api';

const Clients = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    clientName: '',
    priority: '',
    assigneeId: '',
    isActive: true,
    primaryContact: '',
    services: [] as string[],
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  const { data: teamMembers = [], isLoading: teamMembersLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: fetchTeamMembers,
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      clientName: '',
      priority: '',
      assigneeId: '',
      isActive: true,
      primaryContact: '',
      services: [],
    });
  };

  const applyFilters = (clients: Client[]) => {
    return clients.filter(client => {
      const nameMatch = !filters.clientName || client.name.toLowerCase().includes(filters.clientName.toLowerCase());
      const priorityMatch = !filters.priority || client.priority === filters.priority;
      const assigneeMatch = !filters.assigneeId || client.assigneeId === filters.assigneeId;
      const activeMatch = filters.isActive === undefined || client.isActive === filters.isActive;
      const primaryContactMatch = !filters.primaryContact || 
        (client.primaryContactName && client.primaryContactName.toLowerCase().includes(filters.primaryContact.toLowerCase()));
      const servicesMatch = filters.services.length === 0 || 
        filters.services.some(service => client.services.includes(service));

      return nameMatch && priorityMatch && assigneeMatch && activeMatch && primaryContactMatch && servicesMatch;
    });
  };

  const sortedClients = [...(clients as Client[])].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
    return 0;
  });

  const filteredClients = applyFilters(sortedClients);
  
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getAssigneeName = (assigneeId?: string) => {
    if (!assigneeId) return 'Unassigned';
    const assignee = teamMembers.find(m => m.id === assigneeId);
    return assignee ? assignee.name : 'Unknown';
  };

  const totalPages = Math.ceil(filteredClients.length / rowsPerPage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex items-center gap-2">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Clients</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="space-y-2">
                  <Label>Client Name</Label>
                  <Input 
                    placeholder="Search by name" 
                    value={filters.clientName}
                    onChange={(e) => handleFilterChange('clientName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <RadioGroup 
                    value={filters.priority}
                    onValueChange={(value) => handleFilterChange('priority', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="None" id="priority-none" />
                      <Label htmlFor="priority-none">None</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Low" id="priority-low" />
                      <Label htmlFor="priority-low">Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Medium" id="priority-medium" />
                      <Label htmlFor="priority-medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="High" id="priority-high" />
                      <Label htmlFor="priority-high">High</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Select 
                    value={filters.assigneeId}
                    onValueChange={(value) => handleFilterChange('assigneeId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Assignees</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="active-only" 
                      checked={filters.isActive}
                      onCheckedChange={(checked) => handleFilterChange('isActive', checked)}
                    />
                    <Label htmlFor="active-only">Active clients only</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Primary Contact</Label>
                  <Input 
                    placeholder="Search by contact name" 
                    value={filters.primaryContact}
                    onChange={(e) => handleFilterChange('primaryContact', e.target.value)}
                  />
                </div>
              </div>
              
              <SheetFooter className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
                <Button onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          
          <Button variant="outline" className="gap-2">
            <Import size={16} />
            Import Clients
          </Button>
          
          <Button variant="link" className="gap-2">
            <Download size={16} />
            Download Template
          </Button>
          
          <Sheet open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
            <SheetTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Create New Client
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-2xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Create New Client</SheetTitle>
              </SheetHeader>
              <NewClientForm 
                teamMembers={teamMembers} 
                onSuccess={() => setIsNewClientOpen(false)}
                onCancel={() => setIsNewClientOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Name
                  {sortBy === 'name' && (
                    sortOrder === 'asc' ? <ArrowUpAZ size={16} /> : <ArrowDownAZ size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead>Primary Contact</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientsLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading clients...
                </TableCell>
              </TableRow>
            ) : paginatedClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No clients found. Create your first client to get started.
                </TableCell>
              </TableRow>
            ) : (
              paginatedClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.primaryContactName || '-'}</TableCell>
                  <TableCell>{getAssigneeName(client.assigneeId)}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      client.priority === 'High' ? 'bg-red-100 text-red-800' :
                      client.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                      client.priority === 'Low' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {client.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    {client.services.length > 0 
                      ? client.services.slice(0, 2).join(', ') + (client.services.length > 2 ? '...' : '')
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {client.isActive ? (
                      <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {filteredClients.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
            {Math.min(currentPage * rowsPerPage, filteredClients.length)} of {filteredClients.length} items
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={rowsPerPage.toString()} 
              onValueChange={(value) => {
                setRowsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 rows per page</SelectItem>
                <SelectItem value="10">10 rows per page</SelectItem>
                <SelectItem value="20">20 rows per page</SelectItem>
                <SelectItem value="50">50 rows per page</SelectItem>
              </SelectContent>
            </Select>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
