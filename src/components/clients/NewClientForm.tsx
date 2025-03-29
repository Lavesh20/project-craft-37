
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CreateClientFormData, TeamMember } from '@/types';
import { createClient } from '@/services/api';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  description: z.string().optional(),
  primaryContactName: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  assigneeId: z.string().optional(),
  priority: z.enum(['None', 'Low', 'Medium', 'High']),
  services: z.array(z.string()),
  isActive: z.boolean().default(true),
});

const availableServices = [
  { value: 'tax-preparation', label: 'Tax Preparation' },
  { value: 'bookkeeping', label: 'Bookkeeping' },
  { value: 'payroll', label: 'Payroll Services' },
  { value: 'financial-planning', label: 'Financial Planning' },
  { value: 'audit', label: 'Audit Services' },
  { value: 'consulting', label: 'Business Consulting' },
  { value: 'estate-planning', label: 'Estate Planning' },
];

interface NewClientFormProps {
  teamMembers: TeamMember[];
  onSuccess: () => void;
  onCancel: () => void;
}

const NewClientForm: React.FC<NewClientFormProps> = ({ 
  teamMembers, 
  onSuccess,
  onCancel
}) => {
  const [createAndAddAnother, setCreateAndAddAnother] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<CreateClientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      primaryContactName: '',
      location: '',
      website: '',
      assigneeId: '',
      priority: 'None',
      services: [],
      isActive: true,
    },
  });

  const createClientMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client created successfully');
      
      if (createAndAddAnother) {
        form.reset({
          name: '',
          description: '',
          primaryContactName: '',
          location: '',
          website: '',
          assigneeId: '',
          priority: 'None',
          services: [],
          isActive: true,
        });
      } else {
        onSuccess();
      }
    },
    onError: (error) => {
      toast.error('Failed to create client');
      console.error('Create client error:', error);
    },
  });

  const onSubmit = (data: CreateClientFormData) => {
    createClientMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <Card className="p-6 shadow-sm border border-gray-100">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter client name" 
                      {...field} 
                      className="focus-visible:ring-jetpack-blue" 
                    />
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
                  <FormLabel className="text-base font-semibold">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      className="min-h-24 focus-visible:ring-jetpack-blue"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Provide a brief description of the client's business or needs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
        
        <Card className="p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="primaryContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Primary Contact</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Contact name" 
                      {...field} 
                      className="focus-visible:ring-jetpack-blue" 
                    />
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
                    <Input 
                      placeholder="Enter location" 
                      {...field} 
                      className="focus-visible:ring-jetpack-blue" 
                    />
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
                  <FormLabel className="text-base">Website URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com" 
                      {...field} 
                      className="focus-visible:ring-jetpack-blue" 
                    />
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
                  <FormLabel className="text-base">Assignee</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="focus-visible:ring-jetpack-blue">
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unassigned">None</SelectItem>
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
          </div>
        </Card>
        
        <Card className="p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Additional Information</h3>
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="space-y-3 mb-6">
                <FormLabel className="text-base">Priority Level</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-row space-x-4"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 bg-gray-50 p-4 rounded-md">
                  {availableServices.map((service) => (
                    <FormField
                      key={service.value}
                      control={form.control}
                      name="services"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={service.value}
                            className="flex flex-row items-start space-x-3 space-y-0 p-2 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(service.value)}
                                onCheckedChange={(checked) => {
                                  const currentServices = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentServices, service.value]);
                                  } else {
                                    field.onChange(
                                      currentServices.filter((value) => value !== service.value)
                                    );
                                  }
                                }}
                                className="data-[state=checked]:bg-jetpack-blue data-[state=checked]:border-jetpack-blue"
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">{service.label}</FormLabel>
                          </FormItem>
                        );
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
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-jetpack-blue data-[state=checked]:border-jetpack-blue"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">Active Status</FormLabel>
                  <FormDescription className="text-xs">
                    Mark this client as active in your system
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
        
        <div className="flex flex-col md:flex-row gap-3 pt-4 border-t">
          <Button 
            type="submit"
            disabled={createClientMutation.isPending}
            className="bg-jetpack-blue hover:bg-blue-700 transition-colors"
          >
            Create Client
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCreateAndAddAnother(true);
              form.handleSubmit(onSubmit)();
            }}
            disabled={createClientMutation.isPending}
            className="border-jetpack-blue text-jetpack-blue hover:bg-blue-50"
          >
            Create and Add Another
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="hover:bg-gray-100"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewClientForm;
