
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTemplate } from '@/services/api';
import { CreateTemplateFormData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { fetchTeamMembers } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/avatar';
import { AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  teamMemberIds: z.array(z.string()).default([])
});

type FormData = z.infer<typeof formSchema>;

const NewTemplate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch team members
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers,
  });
  
  // Setup form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      teamMemberIds: []
    }
  });
  
  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: (data: CreateTemplateFormData) => createTemplate(data),
    onSuccess: (newTemplate) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Success",
        description: "Template created successfully.",
      });
      navigate(`/templates/${newTemplate.id}`);
    },
    onError: (error) => {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const onSubmit = (data: FormData) => {
    createTemplateMutation.mutate({
      name: data.name,
      description: data.description,
      teamMemberIds: data.teamMemberIds
    });
  };
  
  return (
    <div className="p-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex items-center">
          <AlertTriangle className="text-blue-500 mr-2" />
          <span>You are creating a new Template</span>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Template</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-lg shadow p-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Template name" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Template description"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="teamMemberIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Members</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(teamMembers) && teamMembers.map(member => (
                      <Button
                        key={member.id}
                        type="button"
                        variant={field.value.includes(member.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newValue = field.value.includes(member.id)
                            ? field.value.filter(id => id !== member.id)
                            : [...field.value, member.id];
                          field.onChange(newValue);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Avatar className="size-5">
                          <div className="flex items-center justify-center w-full h-full bg-primary-foreground text-primary text-xs uppercase">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </Avatar>
                        {member.name}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/templates')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTemplateMutation.isPending}
              >
                {createTemplateMutation.isPending ? "Creating..." : "Create Template"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewTemplate;
