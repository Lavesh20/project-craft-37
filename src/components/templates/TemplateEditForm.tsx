
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTemplate } from '@/services/api';
import { Template, Client, TeamMember } from '@/types';
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
import { MultiSelect } from '@/components/ui/multi-select';

// Define the form validation schema
const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  teamMemberIds: z.array(z.string()).optional(),
  clientIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TemplateEditFormProps {
  template: Template;
  onCancel: () => void;
  onSuccess: (updatedTemplate: Template) => void;
  teamMembers: TeamMember[];
  clients: Client[];
}

const TemplateEditForm: React.FC<TemplateEditFormProps> = ({ template, onCancel, onSuccess, teamMembers, clients }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormValues>({
    name: template.name,
    description: template.description || '',
    teamMemberIds: template.teamMemberIds || [],
    clientIds: template.clientIds || [],
  });

  useEffect(() => {
    setFormData({
      name: template.name,
      description: template.description || '',
      teamMemberIds: template.teamMemberIds || [],
      clientIds: template.clientIds || [],
    });
  }, [template]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
    mode: 'onChange',
  });

  const updateTemplateMutation = useMutation({
    mutationFn: (data: Template) => updateTemplate(data.id, data),
    onSuccess: (updatedTemplate) => {
      queryClient.invalidateQueries({ queryKey: ['template', template.id] });
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: 'Success',
        description: 'Template updated successfully',
      });
      onSuccess(updatedTemplate);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update template: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedTemplate: Template = {
      ...template,
      name: formData.name,
      description: formData.description,
      teamMemberIds: formData.teamMemberIds,
      clientIds: formData.clientIds,
      tasks: template.tasks,
      lastEdited: new Date().toISOString()
    };
    
    updateTemplateMutation.mutate(updatedTemplate);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamMemberChange = (selected: string[]) => {
    setFormData(prev => ({ ...prev, teamMemberIds: selected }));
  };

  const handleClientChange = (selected: string[]) => {
    setFormData(prev => ({ ...prev, clientIds: selected }));
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-md bg-blue-50 p-4 mb-4">
          <p className="text-sm text-blue-700">You are currently editing the Template.</p>
        </div>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base after:content-['*'] after:text-red-500 after:ml-0.5">Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Template name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    name="name"
                    {...field} 
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
                <FormLabel className="text-base">Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Brief description of template" 
                    value={formData.description}
                    onChange={handleInputChange}
                    name="description"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLabel className="text-base">Team Members</FormLabel>
              <MultiSelect
                options={teamMembers.map(member => ({ label: member.name, value: member.id }))}
                value={formData.teamMemberIds || []}
                onChange={handleTeamMemberChange}
              />
            </div>

            <div>
              <FormLabel className="text-base">Clients</FormLabel>
              <MultiSelect
                options={clients.map(client => ({ label: client.name, value: client.id }))}
                value={formData.clientIds || []}
                onChange={handleClientChange}
              />
            </div>
          </div>
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

export default TemplateEditForm;
