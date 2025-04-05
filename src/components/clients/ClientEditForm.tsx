import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Client, TeamMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// List of possible services
const AVAILABLE_SERVICES = [
  'Accounting',
  'Accounting - Month-End Close',
  'Accounting - Other',
  'Accounting - Quarter-End Close',
  'Accounting - Year-End Close',
  'Web Development',
  'Mobile Apps',
  'Consulting',
  'Web Design',
  'Marketing',
];

// Define the form validation schema
const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  assigneeId: z.string().optional(),
  priority: z.enum(['None', 'Low', 'Medium', 'High']),
  services: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ClientEditFormProps {
  client: Client;
  onCancel: () => void;
  onSuccess: (updatedClient: Client) => void;
}

const ClientEditForm: React.FC<ClientEditFormProps> = ({ client, onCancel, onSuccess }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Direct API function for updating client
  const updateClient = async (clientId: string, clientData: Client): Promise<Client> => {
    try {
      console.log(`Updating client ${clientId} with data:`, clientData);
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.put(`/api/clients/${clientId}`, clientData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      console.log('Client updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating client ${clientId}:`, error);
      throw error;
    }
  };

  // Direct API function for fetching team members
  const fetchTeamMembers = async (): Promise<TeamMember[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const controller = new AbortController();
      
      const response = await axios.get('/api/team-members', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        signal: controller.signal
      });
      
      console.log('Team members fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  };

  // Fetch team members for assignee selection
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers,
  });

  // Initialize form with client data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client.name,
      description: client.description || '',
      location: client.location || '',
      website: client.website || '',
      assigneeId: client.assigneeId || '',
      priority: client.priority || 'None',
      services: client.services || [],
      isActive: client.isActive !== undefined ? client.isActive : true,
    },
  });

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: (updatedClient: Client) => updateClient(updatedClient.id, updatedClient),
    onSuccess: (updatedClient) => {
      queryClient.invalidateQueries({ queryKey: ['client', client.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: 'Success',
        description: 'Client updated successfully',
      });
      onSuccess(updatedClient);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update client: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    const updatedClient: Client = {
      ...client,
      ...data,
      lastEdited: new Date().toISOString()
    };
    updateClientMutation.mutate(updatedClient);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-md bg-blue-50 p-4 mb-4">
          <p className="text-sm text-blue-700">You are currently editing the Client.</p>
        </div>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base after:content-['*'] after:text-red-500 after:ml-0.5">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Brief description of client" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Location</FormLabel>
                <FormControl>
                  <Input placeholder="Search for a location..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="assigneeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Assignees</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an assignee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Priority Level</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-6"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="None" />
                      </FormControl>
                      <FormLabel className="font-normal">None</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="Low" />
                      </FormControl>
                      <FormLabel className="font-normal">Low</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="Medium" />
                      </FormControl>
                      <FormLabel className="font-normal">Medium</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="High" />
                      </FormControl>
                      <FormLabel className="font-normal">High</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="services"
            render={() => (
              <FormItem>
                <FormLabel className="text-base">Services</FormLabel>
                <div className="space-y-2">
                  {AVAILABLE_SERVICES.map((service) => (
                    <FormField
                      key={service}
                      control={form.control}
                      name="services"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={service}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(service)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), service])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== service
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{service}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-jetpack-blue hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientEditForm;
