
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Template, TemplateTask, CreateTemplateTaskFormData } from '@/types';
import { updateTemplate, createTemplateTask, updateTemplateTask, deleteTemplateTask, reorderTemplateTasks } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { fetchTeamMembers, fetchClients } from '@/services/api';

interface TemplateEditFormProps {
  template: Template;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  teamMemberIds: z.array(z.string())
});

type FormData = z.infer<typeof formSchema>;

const TemplateEditForm: React.FC<TemplateEditFormProps> = ({ template, onCancel }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [tasks, setTasks] = React.useState<TemplateTask[]>(
    [...template.tasks].sort((a, b) => a.position - b.position)
  );
  const [newTask, setNewTask] = React.useState<Partial<CreateTemplateTaskFormData>>({
    name: '',
    description: '',
    assigneeId: undefined,
    relativeDueDate: {
      value: 5,
      unit: 'days',
      position: 'before'
    },
    timeEstimate: {
      value: 30,
      unit: 'm'
    }
  });
  
  // Fetch team members
  const { data: teamMembers } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers,
  });
  
  // Fetch clients
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });
  
  // Setup form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template.name,
      description: template.description || '',
      teamMemberIds: template.teamMemberIds
    }
  });
  
  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Template> }) => 
      updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['template', template.id] });
      toast({
        title: "Success",
        description: "Template updated successfully.",
      });
      onCancel();
    },
    onError: (error) => {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: ({ templateId, task }: { templateId: string; task: Omit<TemplateTask, 'id' | 'templateId' | 'position'> }) => 
      createTemplateTask(templateId, task),
    onSuccess: (newTask) => {
      setTasks(prev => [...prev, newTask].sort((a, b) => a.position - b.position));
      setNewTask({
        name: '',
        description: '',
        assigneeId: undefined,
        relativeDueDate: {
          value: 5,
          unit: 'days',
          position: 'before'
        },
        timeEstimate: {
          value: 30,
          unit: 'm'
        }
      });
    },
    onError: (error) => {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const onSubmit = (data: FormData) => {
    updateTemplateMutation.mutate({
      id: template.id,
      data: {
        name: data.name,
        description: data.description,
        teamMemberIds: data.teamMemberIds
      }
    });
  };
  
  // Associated clients
  const associatedClients = clients?.filter(client => 
    template.clientIds.includes(client.id)
  ) || [];
  
  return (
    <div className="p-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex items-center">
          <AlertTriangle className="text-blue-500 mr-2" />
          <span>You are currently editing the Template</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                {/* Template details */}
                <div className="space-y-4">
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
                          {teamMembers?.map(member => (
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
                </div>
                
                {/* Tasks section */}
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">Task List</h2>
                  
                  <div className="border rounded-md divide-y mb-4">
                    {tasks.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">
                        No tasks have been created for this template yet.
                      </div>
                    ) : (
                      tasks.map((task, index) => (
                        <div key={task.id} className="flex items-start p-4 group">
                          <div className="mr-2 text-muted-foreground cursor-grab pt-1">
                            <GripVertical size={20} />
                          </div>
                          <div className="flex-grow">
                            <Input
                              value={task.name}
                              onChange={(e) => {
                                const updatedTasks = [...tasks];
                                updatedTasks[index] = { ...task, name: e.target.value };
                                setTasks(updatedTasks);
                              }}
                              className="mb-2"
                              placeholder="Task name"
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min="1"
                                    value={task.relativeDueDate.value}
                                    onChange={(e) => {
                                      const updatedTasks = [...tasks];
                                      updatedTasks[index] = {
                                        ...task,
                                        relativeDueDate: {
                                          ...task.relativeDueDate,
                                          value: parseInt(e.target.value) || 1
                                        }
                                      };
                                      setTasks(updatedTasks);
                                    }}
                                    className="w-20"
                                  />
                                  <span className="text-sm whitespace-nowrap">days</span>
                                  <Select
                                    value={task.relativeDueDate.position}
                                    onValueChange={(value: 'before' | 'after') => {
                                      const updatedTasks = [...tasks];
                                      updatedTasks[index] = {
                                        ...task,
                                        relativeDueDate: {
                                          ...task.relativeDueDate,
                                          position: value
                                        }
                                      };
                                      setTasks(updatedTasks);
                                    }}
                                  >
                                    <SelectTrigger className="w-24">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="before">before</SelectItem>
                                      <SelectItem value="after">after</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min="1"
                                    value={task.timeEstimate.value}
                                    onChange={(e) => {
                                      const updatedTasks = [...tasks];
                                      updatedTasks[index] = {
                                        ...task,
                                        timeEstimate: {
                                          ...task.timeEstimate,
                                          value: parseInt(e.target.value) || 1
                                        }
                                      };
                                      setTasks(updatedTasks);
                                    }}
                                    className="w-20"
                                  />
                                  <Select
                                    value={task.timeEstimate.unit}
                                    onValueChange={(value: 'h' | 'm') => {
                                      const updatedTasks = [...tasks];
                                      updatedTasks[index] = {
                                        ...task,
                                        timeEstimate: {
                                          ...task.timeEstimate,
                                          unit: value
                                        }
                                      };
                                      setTasks(updatedTasks);
                                    }}
                                  >
                                    <SelectTrigger className="w-24">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="m">minutes</SelectItem>
                                      <SelectItem value="h">hours</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div>
                                <Select
                                  value={task.assigneeId}
                                  onValueChange={(value) => {
                                    const updatedTasks = [...tasks];
                                    updatedTasks[index] = {
                                      ...task,
                                      assigneeId: value
                                    };
                                    setTasks(updatedTasks);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Assignee" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="">No assignee</SelectItem>
                                    {teamMembers?.map(member => (
                                      <SelectItem key={member.id} value={member.id}>
                                        {member.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => {
                              setTasks(tasks.filter(t => t.id !== task.id));
                            }}
                            className="text-destructive ml-2"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Add task form */}
                  <div className="border rounded-md p-4">
                    <h3 className="text-md font-medium mb-3">Add New Task</h3>
                    <div className="space-y-3">
                      <Input
                        value={newTask.name || ''}
                        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                        placeholder="Enter task name"
                        className="mb-2"
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={newTask.relativeDueDate?.value || 5}
                              onChange={(e) => setNewTask({
                                ...newTask,
                                relativeDueDate: {
                                  ...newTask.relativeDueDate!,
                                  value: parseInt(e.target.value) || 5
                                }
                              })}
                              className="w-20"
                            />
                            <span className="text-sm whitespace-nowrap">days</span>
                            <Select
                              value={newTask.relativeDueDate?.position || 'before'}
                              onValueChange={(value: 'before' | 'after') => setNewTask({
                                ...newTask,
                                relativeDueDate: {
                                  ...newTask.relativeDueDate!,
                                  position: value
                                }
                              })}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="before">before</SelectItem>
                                <SelectItem value="after">after</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={newTask.timeEstimate?.value || 30}
                              onChange={(e) => setNewTask({
                                ...newTask,
                                timeEstimate: {
                                  ...newTask.timeEstimate!,
                                  value: parseInt(e.target.value) || 30
                                }
                              })}
                              className="w-20"
                            />
                            <Select
                              value={newTask.timeEstimate?.unit || 'm'}
                              onValueChange={(value: 'h' | 'm') => setNewTask({
                                ...newTask,
                                timeEstimate: {
                                  ...newTask.timeEstimate!,
                                  unit: value
                                }
                              })}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="m">minutes</SelectItem>
                                <SelectItem value="h">hours</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Select
                            value={newTask.assigneeId || ''}
                            onValueChange={(value) => setNewTask({
                              ...newTask,
                              assigneeId: value || undefined
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Assignee" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">No assignee</SelectItem>
                              {teamMembers?.map(member => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        onClick={() => {
                          if (!newTask.name) {
                            toast({
                              title: "Error",
                              description: "Task name is required.",
                              variant: "destructive",
                            });
                            return;
                          }
                          
                          addTaskMutation.mutate({
                            templateId: template.id,
                            task: {
                              name: newTask.name,
                              description: newTask.description,
                              assigneeId: newTask.assigneeId,
                              relativeDueDate: newTask.relativeDueDate!,
                              timeEstimate: newTask.timeEstimate!
                            }
                          });
                        }}
                        disabled={!newTask.name}
                        className="mt-2"
                      >
                        <Plus className="mr-2 size-4" />
                        Add Task
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Form buttons */}
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateTemplateMutation.isPending}
                  >
                    {updateTemplateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
        
        {/* Associated Clients Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Associated Clients</CardTitle>
            </CardHeader>
            <CardContent>
              {associatedClients.length > 0 ? (
                <div className="space-y-3">
                  {associatedClients.map((client) => (
                    <div key={client.id} className="text-sm hover:bg-accent p-2 rounded-md cursor-pointer">
                      {client.name}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  No clients are currently using this template.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditForm;
