import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CreateTaskFormData, Task, TeamMember } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import axios from 'axios';

// Direct API functions
const createTask = async (taskData: CreateTaskFormData) => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await axios.post('/api/tasks', taskData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

const updateTask = async (id: string, data: any) => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await axios.put(`/api/tasks/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get('/api/team-members', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
};

interface TaskModalProps {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
  taskToEdit: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ projectId, onClose, onSuccess, taskToEdit }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    taskToEdit ? parseISO(taskToEdit.dueDate) : new Date()
  );
  
  const isEditMode = !!taskToEdit;
  
  const [formData, setFormData] = useState<CreateTaskFormData>({
    name: '',
    description: '',
    assigneeId: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    projectId
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const teamMembersData = await fetchTeamMembers();
        setTeamMembers(teamMembersData);
        
        if (taskToEdit) {
          setFormData({
            name: taskToEdit.name,
            description: taskToEdit.description || '',
            assigneeId: taskToEdit.assigneeId || '',
            dueDate: taskToEdit.dueDate,
            projectId
          });
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [taskToEdit, projectId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setFormData(prev => ({ ...prev, dueDate: format(newDate, 'yyyy-MM-dd') }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Task name is required');
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (isEditMode && taskToEdit) {
        await updateTask(taskToEdit.id, {
          ...taskToEdit,
          name: formData.name,
          description: formData.description,
          assigneeId: formData.assigneeId,
          dueDate: formData.dueDate,
          lastEdited: new Date().toISOString()
        });
        toast.success('Task updated successfully');
      } else {
        await createTask(formData);
        toast.success('Task created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} task:`, error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} task`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content p-6">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditMode ? 'Edit Task' : 'New Task'}
              </h2>
              <button 
                type="button" 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Task Name<span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Type your task name here..."
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Type your task description here..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700">
                Assignee
              </label>
              <select
                id="assigneeId"
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="unassigned">Select a Team Member</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date<span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-left font-normal"
                  >
                    {date ? format(date, 'MM/dd/yyyy') : 'Select date'}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-jetpack-blue hover:bg-blue-700 transition-colors"
              disabled={submitting}
            >
              {submitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Task' : 'Create Task')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
