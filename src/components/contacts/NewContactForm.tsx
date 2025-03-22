
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createContact } from '@/services/api';
import { CreateContactFormData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Define the form validation schema
const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  clientId: z.string().optional(),
  isPrimaryContact: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NewContactFormProps {
  onCancel: () => void;
  afterSubmit?: (contact: CreateContactFormData) => void;
}

const NewContactForm: React.FC<NewContactFormProps> = ({ onCancel, afterSubmit }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      isPrimaryContact: false,
    },
  });

  // Create contact mutation
  const createContactMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: 'Success',
        description: 'Contact created successfully',
      });
      if (afterSubmit) {
        afterSubmit(form.getValues() as CreateContactFormData);
      } else {
        navigate('/contacts');
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create contact: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    createContactMutation.mutate(data as CreateContactFormData);
  };

  const handleCreateAndAddAnother = () => {
    const isValid = form.trigger();
    if (isValid) {
      const data = form.getValues();
      createContactMutation.mutate(data as CreateContactFormData, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['contacts'] });
          toast({
            title: 'Success',
            description: 'Contact created successfully',
          });
          form.reset();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base after:content-['*'] after:text-red-500 after:ml-0.5">Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="name@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="(999) 999 - 9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Street</FormLabel>
                  <FormControl>
                    <Input placeholder="123 River road" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">City</FormLabel>
                  <FormControl>
                    <Input placeholder="Olympia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">State</FormLabel>
                  <FormControl>
                    <Input placeholder="WA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="99999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCreateAndAddAnother}
            className="flex-1 order-2 sm:order-1"
          >
            Create and add another
          </Button>
          <Button 
            type="submit" 
            className="bg-jetpack-blue hover:bg-blue-700 flex-1 order-1 sm:order-2"
          >
            Create Contact
          </Button>
        </div>
        
        <div className="flex justify-center">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewContactForm;
