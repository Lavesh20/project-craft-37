
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createProject, updateProject, fetchClients, fetchTeamMembers, fetchTemplates } from '@/services/api';
import { Project, Template } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// Define schema for project form
const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Client is required'),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  status: z.enum(['Not Started', 'In Progress', 'Complete']),
  assigneeId: z.string().optional(),
  templateId: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  onClose: () => void;
  onCreated?: (projectId: string) => void;
  projectToEdit?: Project;
}

// Helper function to parse a date string to a Date
const parseDate = (dateStr: string): Date => {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? new Date() : date;
};

const ProjectModal: React.FC<ProjectModalProps> = ({ onClose, onCreated, projectToEdit }) => {
  const isEditMode = !!projectToEdit;
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // Fetch clients for dropdown
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  // Fetch team members for assignee dropdown
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers
  });

  // Fetch templates for dropdown
  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates
  });

  // Set up form with react-hook-form and zod validation
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: projectToEdit?.name || '',
      description: projectToEdit?.description || '',
      clientId: projectToEdit?.clientId || '',
      dueDate: projectToEdit ? parseDate(projectToEdit.dueDate) : new Date(),
      status: projectToEdit?.status || 'Not Started',
      assigneeId: projectToEdit?.assigneeId || undefined,
      templateId: projectToEdit?.templateId || undefined,
    },
  });

  // Watch templateId to update selected template
  const watchedTemplateId = form.watch('templateId');

  // Update selected template when templateId changes
  useEffect(() => {
    if (watchedTemplateId) {
      const template = templates.find(t => t.id === watchedTemplateId) || null;
      setSelectedTemplate(template);
    } else {
      setSelectedTemplate(null);
    }
  }, [watchedTemplateId, templates]);

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      toast.success('Project created successfully');
      if (onCreated) {
        onCreated(data.id);
      } else {
        onClose();
      }
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) => 
      updateProject(id, data),
    onSuccess: () => {
      toast.success('Project updated successfully');
      onClose();
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  });

  // Form submission handler
  const onSubmit = async (data: ProjectFormValues) => {
    try {
      if (isEditMode && projectToEdit) {
        // Prepare update data
        const updateData: Partial<Project> = {
          name: data.name,
          description: data.description,
          clientId: data.clientId,
          dueDate: data.dueDate.toISOString(),
          status: data.status,
          assigneeId: data.assigneeId,
        };
        
        // Update existing project
        await updateProjectMutation.mutateAsync({ 
          id: projectToEdit.id, 
          data: updateData 
        });
      } else {
        // Prepare create data
        const createData: Partial<Project> = {
          name: data.name,
          description: data.description,
          clientId: data.clientId,
          dueDate: data.dueDate.toISOString(),
          status: data.status,
          assigneeId: data.assigneeId,
          teamMemberIds: data.assigneeId ? [data.assigneeId] : [],
          templateId: data.templateId,
          tasks: [],
          // Remove position field as it's not in the Project type
          lastEdited: new Date().toISOString(),
        };
        
        // Create new project
        await createProjectMutation.mutateAsync(createData);
      }
    } catch (error) {
      // Error will be handled by mutation callbacks
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Project name" {...field} />
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
                      placeholder="Brief description of the project" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client <span className="text-red-500">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isEditMode} // Disable in edit mode
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
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
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date <span className="text-red-500">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {teamMembers.map(member => (
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
            
            {!isEditMode && (
              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-jetpack-blue hover:bg-blue-700"
                disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
              >
                {isEditMode ? 'Save Changes' : 'Create Project'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
