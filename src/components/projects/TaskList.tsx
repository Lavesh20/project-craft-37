
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Task, Project, CreateTaskFormData, TeamMember } from '@/types';
import { createTask, updateTask, reorderTasks, fetchTeamMembers, getProject } from '@/services/api';
import { Plus, Check, Calendar, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskListProps {
  projectId: string;
  tasks: Task[];
  onProjectUpdate: (project: Project) => void;
}

const TaskList: React.FC<TaskListProps> = ({ projectId, tasks, onProjectUpdate }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newTaskData, setNewTaskData] = useState<CreateTaskFormData>({
    name: '',
    description: '',
    assigneeId: undefined,
    dueDate: new Date().toISOString().split('T')[0]
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Fetch team members for the assignee dropdown
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers
  });

  // Helper to get team member by ID
  const getTeamMemberById = (memberId: string): TeamMember | undefined => {
    return teamMembers.find(member => member.id === memberId);
  };

  // Helper to get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Toggle task expand
  const toggleTaskExpand = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  // Handle task completion toggle
  const handleTaskStatusChange = async (taskId: string, isComplete: boolean) => {
    try {
      const status = isComplete ? 'Complete' : 'In Progress';
      await updateTask(projectId, taskId, { status });
      
      // Refresh project to update UI and status
      const updatedProject = await getProject(projectId);
      if (updatedProject) {
        onProjectUpdate(updatedProject);
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  // Handle new task creation
  const handleCreateTask = async () => {
    if (!newTaskData.name.trim()) return;
    
    try {
      await createTask(projectId, {
        ...newTaskData,
        dueDate: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
      
      // Reset form and close dialog
      setNewTaskData({
        name: '',
        description: '',
        assigneeId: undefined,
        dueDate: new Date().toISOString().split('T')[0]
      });
      setSelectedDate(new Date());
      setIsAddingTask(false);
      
      // Refresh project to update UI
      const updatedProject = await getProject(projectId);
      if (updatedProject) {
        onProjectUpdate(updatedProject);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // Count completed tasks
  const completedTaskCount = tasks.filter(task => task.status === 'Complete').length;
  
  // Sort tasks by position
  const sortedTasks = [...tasks].sort((a, b) => a.position - b.position);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Task List</CardTitle>
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} /> Add task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task for this project.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="taskName" className="text-sm font-medium">Task Name</label>
                <Input
                  id="taskName"
                  value={newTaskData.name}
                  onChange={(e) => setNewTaskData({ ...newTaskData, name: e.target.value })}
                  placeholder="Enter task name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="taskDescription" className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  id="taskDescription"
                  value={newTaskData.description || ''}
                  onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                  placeholder="Describe what needs to be done"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="taskAssignee" className="text-sm font-medium">Assignee (Optional)</label>
                <Select 
                  value={newTaskData.assigneeId} 
                  onValueChange={(value) => setNewTaskData({ ...newTaskData, assigneeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          {member.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="taskDueDate" className="text-sm font-medium">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {sortedTasks.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No tasks yet. Add a task to get started.
          </div>
        ) : (
          <div className="divide-y">
            {sortedTasks.map((task) => {
              const isExpanded = expandedTaskId === task.id;
              const assignee = task.assigneeId ? getTeamMemberById(task.assigneeId) : undefined;
              
              return (
                <Collapsible
                  key={task.id}
                  open={isExpanded}
                  className="py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab text-gray-400">
                      <GripVertical size={16} />
                    </div>
                    
                    <Checkbox
                      checked={task.status === 'Complete'}
                      onCheckedChange={(checked) => handleTaskStatusChange(task.id, !!checked)}
                    />
                    
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => toggleTaskExpand(task.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${task.status === 'Complete' ? 'line-through text-gray-400' : ''}`}>
                            {task.name}
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-800 text-xs"
                          >
                            {format(new Date(task.dueDate), 'MMM dd')}
                          </Badge>
                          <Badge
                            className={`text-xs ${
                              task.status === 'Complete' 
                                ? 'bg-jetpack-green text-green-800' 
                                : task.status === 'In Progress' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {task.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500">
                            {task.status === 'Complete' ? '1/1' : '0/1'}
                          </span>
                          {assignee && (
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
                            </Avatar>
                          )}
                          <CollapsibleTrigger asChild>
                            <button className="text-gray-400 hover:text-gray-600">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </CollapsibleTrigger>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CollapsibleContent className="pt-3 pl-10">
                    {task.description && (
                      <div className="mb-4 text-gray-600 text-sm">
                        {task.description}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-500">Assignee</div>
                        <div className="mt-1">
                          {assignee ? (
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
                              </Avatar>
                              {assignee.name}
                            </div>
                          ) : (
                            <span className="text-gray-400">No assignee</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-500">Due Date</div>
                        <div className="mt-1">
                          {format(new Date(task.dueDate), 'MMMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          {completedTaskCount}/{tasks.length} tasks complete
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskList;
