import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { createContact, fetchClients } from '@/services/api';
import { CreateContactFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

// Define form schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  clientId: z.string().optional(),
  isPrimaryContact: z.boolean().optional()
});

type ContactFormData = z.infer<typeof contactSchema>;

interface NewContactFormProps {
  onCancel: () => void;
  afterSubmit: () => void;
  preselectedClientId?: string;
}

const NewContactForm: React.FC<NewContactFormProps> = ({ 
  onCancel, 
  afterSubmit,
  preselectedClientId
}) => {
  const [isCreatingPrimaryContact, setIsCreatingPrimaryContact] = useState(false);
  const queryClient = useQueryClient();

  // Set up form with react-hook-form and zod validation
  const { 
    register, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      clientId: preselectedClientId || '',
      isPrimaryContact: false
    }
  });

  // Fetch clients for dropdown
  const { data: fetchedClients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  // Ensure clients is an array
  const clients = Array.isArray(fetchedClients) ? fetchedClients : [];

  // Watch for client selection to enable/disable primary contact option
  const selectedClientId = watch('clientId');

  // Create contact mutation
  const createContactMutation = useMutation({
    mutationFn: (data: CreateContactFormData) => createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      // Also invalidate client-contacts if a client was selected
      if (selectedClientId && selectedClientId !== 'none') {
        queryClient.invalidateQueries({ queryKey: ['client-contacts', selectedClientId] });
        queryClient.invalidateQueries({ queryKey: ['client', selectedClientId] });
      }
      toast.success('Contact created successfully');
      afterSubmit();
    },
    onError: (error) => {
      console.error('Error creating contact:', error);
      toast.error('Failed to create contact');
    }
  });

  // Form submission handler
  const onSubmit = async (data: ContactFormData) => {
    try {
      // Ensure we're passing valid CreateContactFormData with required fields
      const contactData: CreateContactFormData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        clientId: data.clientId === 'none' ? undefined : data.clientId,
        isPrimaryContact: data.isPrimaryContact
      };
      
      await createContactMutation.mutateAsync(contactData);
    } catch (error) {
      // Error will be handled by mutation callbacks
    }
  };

  // Handle primary contact checkbox change
  const handlePrimaryContactChange = (checked: boolean) => {
    setValue('isPrimaryContact', checked);
    setIsCreatingPrimaryContact(checked);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[90vh] overflow-y-auto">
      <Card className="p-4 md:p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register('name')}
              className={errors.name ? 'border-red-300' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              {...register('email')}
              className={errors.email ? 'border-red-300' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="(555) 123-4567"
              {...register('phone')}
            />
          </div>

          <div>
            <Label htmlFor="client">Associated Client</Label>
            <Select
              value={selectedClientId}
              onValueChange={(value) => setValue('clientId', value)}
              disabled={clientsLoading || preselectedClientId !== undefined}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a client (optional)" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                <SelectItem value="none">No client</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClientId && selectedClientId !== "none" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPrimaryContact"
                checked={watch('isPrimaryContact')}
                onCheckedChange={handlePrimaryContactChange}
              />
              <Label htmlFor="isPrimaryContact" className="cursor-pointer">
                Set as primary contact for this client
              </Label>
              {isCreatingPrimaryContact && (
                <p className="text-amber-600 text-sm">
                  Note: This will replace the current primary contact, if one exists.
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 md:p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Address Information</h3>
        <div>
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            placeholder="123 Main St"
            {...register('street')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="New York"
              {...register('city')}
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              placeholder="NY"
              {...register('state')}
            />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              placeholder="10001"
              {...register('postalCode')}
            />
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-jetpack-blue hover:bg-blue-700 w-full sm:w-auto">
          {isSubmitting ? 'Creating...' : 'Create Contact'}
        </Button>
      </div>
    </form>
  );
};

export default NewContactForm;
