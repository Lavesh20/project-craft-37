
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Template, Client, TeamMember, TemplateTask } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from "sonner";
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface TemplateEditFormProps {
  template: Template;
  onCancel: () => void;
  onSuccess: (template: Template) => void;
  teamMembers: TeamMember[];
  clients: Client[];
}

const formSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  teamMemberIds: z.array(z.string()).default([]),
  clientIds: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof formSchema>;

const TemplateEditForm: React.FC<TemplateEditFormProps> = ({ 
  template, 
  onCancel, 
  onSuccess, 
  teamMembers, 
  clients 
}) => {
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<TemplateTask[]>(template.tasks || []);

  // Form setup with existing template data
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template.name,
      description: template.description || '',
      teamMemberIds: template.teamMemberIds || [],
      clientIds: template.clientIds || [],
    }
  });

  // Handle form submission to update template
  const updateTemplate = async (data: any): Promise<Template> => {
    try {
      const token = localStorage.getItem('auth_token');
      const updatedTemplate = {
        ...template,
        ...data,
        tasks: tasks,
        lastEdited: new Date().toISOString()
      };
      
      const response = await axios.patch(`/api/templates/${template.id}`, updatedTemplate, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  };

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: updateTemplate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['template', template.id] });
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success("Template updated successfully");
      onSuccess(data);
    },
    onError: () => {
      toast.error("Failed to update template");
    }
  });

  // Handle form submission
  const onSubmit = (data: FormData) => {
    updateTemplateMutation.mutate(data);
  };

  // Handle task drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }));
    
    setTasks(updatedItems);
  };

  // Add a new task to the list
  const addTask = () => {
    const newTask: TemplateTask = {
      id: `task-${Date.now()}`,
      name: "New Task",
      description: "",
      relativeDueDate: {
        value: 1,
        unit: 'days',
        position: 'after'
      },
      timeEstimate: {
        value: 1,
        unit: 'h'
      },
      position: tasks.length
    };
    
    setTasks([...tasks, newTask]);
  };

  // Update a specific task
  const updateTask = (index: number, updates: Partial<TemplateTask>) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      ...updates
    };
    setTasks(updatedTasks);
  };

  // Delete a task
  const deleteTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Template</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter template name" {...field} />
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
                          placeholder="Enter template description" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="teamMemberIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Members</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {teamMembers.map(member => (
                          <Button
                            key={member.id}
                            type="button"
                            variant={field.value?.includes(member.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const newValue = field.value?.includes(member.id)
                                ? field.value.filter(id => id !== member.id)
                                : [...(field.value || []), member.id];
                              field.onChange(newValue);
                            }}
                          >
                            {member.name}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Associated Clients</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {clients.map(client => (
                          <Button
                            key={client.id}
                            type="button"
                            variant={field.value?.includes(client.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const newValue = field.value?.includes(client.id)
                                ? field.value.filter(id => id !== client.id)
                                : [...(field.value || []), client.id];
                              field.onChange(newValue);
                            }}
                          >
                            {client.name}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <Button 
                  type="button" 
                  onClick={addTask}
                  variant="outline"
                >
                  <Plus className="mr-2 size-4" />
                  Add Task
                </Button>
              </div>
              
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border rounded-md p-4"
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <div {...provided.dragHandleProps} className="cursor-grab">
                                  <GripVertical size={20} />
                                </div>
                                <Input
                                  value={task.name}
                                  onChange={(e) => updateTask(index, { name: e.target.value })}
                                  className="flex-grow"
                                  placeholder="Task name"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteTask(index)}
                                >
                                  <Trash2 className="size-4 text-destructive" />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Description</label>
                                  <Textarea
                                    value={task.description || ''}
                                    onChange={(e) => updateTask(index, { description: e.target.value })}
                                    placeholder="Task description"
                                  />
                                </div>
                                
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Due Date</label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min={1}
                                        value={task.relativeDueDate?.value || 1}
                                        onChange={(e) => updateTask(index, { 
                                          relativeDueDate: {
                                            ...task.relativeDueDate,
                                            value: parseInt(e.target.value) || 1
                                          }
                                        })}
                                        className="w-20"
                                      />
                                      <select 
                                        value={task.relativeDueDate?.unit || 'days'}
                                        onChange={(e) => updateTask(index, { 
                                          relativeDueDate: {
                                            ...task.relativeDueDate,
                                            unit: e.target.value as 'days' | 'weeks' | 'months'
                                          }
                                        })}
                                        className="border rounded px-2 py-2"
                                      >
                                        <option value="days">days</option>
                                        <option value="weeks">weeks</option>
                                        <option value="months">months</option>
                                      </select>
                                      <select 
                                        value={task.relativeDueDate?.position || 'after'}
                                        onChange={(e) => updateTask(index, { 
                                          relativeDueDate: {
                                            ...task.relativeDueDate,
                                            position: e.target.value as 'before' | 'after'
                                          }
                                        })}
                                        className="border rounded px-2 py-2"
                                      >
                                        <option value="after">after</option>
                                        <option value="before">before</option>
                                      </select>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium">Time Estimate</label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min={1}
                                        value={task.timeEstimate?.value || 1}
                                        onChange={(e) => updateTask(index, { 
                                          timeEstimate: {
                                            ...task.timeEstimate,
                                            value: parseInt(e.target.value) || 1
                                          }
                                        })}
                                        className="w-20"
                                      />
                                      <select 
                                        value={task.timeEstimate?.unit || 'h'}
                                        onChange={(e) => updateTask(index, { 
                                          timeEstimate: {
                                            ...task.timeEstimate,
                                            unit: e.target.value as 'h' | 'm'
                                          }
                                        })}
                                        className="border rounded px-2 py-2"
                                      >
                                        <option value="m">minutes</option>
                                        <option value="h">hours</option>
                                      </select>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium">Assignee</label>
                                    <select
                                      value={task.assigneeId || ''}
                                      onChange={(e) => updateTask(index, { assigneeId: e.target.value || undefined })}
                                      className="w-full border rounded px-2 py-2"
                                    >
                                      <option value="">Unassigned</option>
                                      {teamMembers.map(member => (
                                        <option key={member.id} value={member.id}>{member.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              
              {tasks.length === 0 && (
                <div className="text-center p-6 border rounded-md border-dashed">
                  <p className="text-muted-foreground">No tasks added to this template yet.</p>
                  <Button 
                    type="button" 
                    onClick={addTask} 
                    variant="outline" 
                    className="mt-2"
                  >
                    <Plus className="mr-2 size-4" />
                    Add your first task
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 pt-6 border-t">
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
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TemplateEditForm;
