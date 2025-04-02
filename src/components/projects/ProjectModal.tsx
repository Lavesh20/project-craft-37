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
import { CalendarIcon, Info } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MultiSelect } from '@/components/ui/multi-select';
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
  teamMemberIds: z.array(z.string()).optional(),
  repeating: z.boolean().optional(),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Custom']).optional(),
  startDate: z.date().optional(),
  labels: z.array(z.string()).optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  onClose: () => void;
  onCreated?: (projectId: string) => void;
  projectToEdit?: Project;
}

const parseDate = (dateStr: string): Date => {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? new Date() : date;
};

const labelOptions = [
  { label: 'Urgent', value: 'urgent' },
  { label: 'High Priority', value: 'high-priority' },
  { label: 'Low Priority', value: 'low-priority' },
  { label: 'On Hold', value: 'on-hold' },
  { label: 'Needs Review', value: 'needs-review' },
];

const ProjectModal: React.FC<ProjectModalProps> = ({ onClose, onCreated, projectToEdit }) => {
  const isEditMode = !!projectToEdit;
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates
  });

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
      teamMemberIds: projectToEdit?.teamMemberIds || [],
      repeating: projectToEdit?.repeating || false,
      frequency: projectToEdit?.frequency || undefined,
      startDate: projectToEdit?.startDate ? parseDate(projectToEdit.startDate) : new Date(),
      labels: projectToEdit?.labels || [],
    },
  });

  const watchedTemplateId = form.watch('templateId');
  const watchedRepeating = form.watch('repeating');

  useEffect(() => {
    if (watchedTemplateId && watchedTemplateId !== 'none') {
      const template = templates.find(t => t.id === watchedTemplateId) || null;
      setSelectedTemplate(template);
    } else {
      setSelectedTemplate(null);
    }
  }, [watchedTemplateId, templates]);

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

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      if (isEditMode && projectToEdit) {
        const updateData: Partial<Project> = {
          name: data.name,
          description: data.description,
          clientId: data.clientId,
          dueDate: data.dueDate.toISOString(),
          status: data.status,
          assigneeId: data.assigneeId === 'none' ? undefined : data.assigneeId,
          teamMemberIds: data.teamMemberIds || [],
          repeating: data.repeating,
          frequency: data.frequency,
          startDate: data.startDate?.toISOString(),
          labels: data.labels,
        };
        
        await updateProjectMutation.mutateAsync({ 
          id: projectToEdit.id, 
          data: updateData 
        });
      } else {
        const createData: Partial<Project> = {
          name: data.name,
          description: data.description,
          clientId: data.clientId,
          dueDate: data.dueDate.toISOString(),
          status: data.status,
          assigneeId: data.assigneeId === 'none' ? undefined : data.assigneeId,
          teamMemberIds: data.teamMemberIds || [],
          templateId: data.templateId === 'none' ? undefined : data.templateId,
          tasks: [],
          lastEdited: new Date().toISOString(),
          repeating: data.repeating,
          frequency: data.frequency,
          startDate: data.startDate?.toISOString(),
          labels: data.labels,
        };
        
        await createProjectMutation.mutateAsync(createData);
      }
    } catch (error) {
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {isEditMode ? 'Edit Project' : 'New Project'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Type your project name here..." {...field} />
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
                      placeholder="Type your project description here..." 
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client <span className="text-red-500">*</span></FormLabel>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isEditMode}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an option" />
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
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-blue-500 text-xs whitespace-nowrap"
                      >
                        Create a client
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Assignee</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Team Member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
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
            
            <FormField
              control={form.control}
              name="teamMemberIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Members</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={teamMembers.map(member => ({ label: member.name, value: member.id }))}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Press ctrl or ⌘ to select multiple"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="repeating"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Is this a repeating project? <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === 'true')}
                      defaultValue={field.value ? 'true' : 'false'}
                      className="flex flex-wrap gap-2"
                    >
                      <div className="flex items-center space-x-2 flex-1 min-w-[140px]">
                        <RadioGroupItem value="true" id="repeating-yes" />
                        <label htmlFor="repeating-yes" className="flex-grow text-center py-2 border rounded-md cursor-pointer">
                          Yes
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 flex-1 min-w-[140px]">
                        <RadioGroupItem value="false" id="repeating-no" />
                        <label htmlFor="repeating-no" className="flex-grow text-center py-2 border rounded-md cursor-pointer bg-gray-50">
                          No, this is a one-off
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {watchedRepeating && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency <span className="text-red-500">*</span></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Click to set a recurring date" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Daily">Daily</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Yearly">Yearly</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Schedule starts <span className="text-red-500">*</span></FormLabel>
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
                                format(field.value, "MM/dd/yyyy")
                              ) : (
                                <span>Select date</span>
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
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
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
                            format(field.value, "MM/dd/yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
              name="labels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Labels</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={labelOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select project labels"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                        <SelectItem value="none">None</SelectItem>
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
            
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-jetpack-blue hover:bg-blue-700 w-full sm:w-auto"
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
