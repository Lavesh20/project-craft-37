
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { format, parseISO } from 'date-fns';
import { Project, Task } from '@/types';
import { CheckCircle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateTask, deleteTask } from '@/services/api';
import { toast } from 'sonner';
import TaskModal from './TaskModal';
import { useQueryClient } from '@tanstack/react-query';

interface TaskListProps {
  projectId: string;
  tasks: Task[];
  refetchProject: () => void;
  project: Project;
}

const TaskList: React.FC<TaskListProps> = ({ projectId, tasks, refetchProject, project }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Sort tasks by position
    if (!tasks) return;
    
    const sortedTasks = [...tasks].sort((a, b) => {
      // Make sure tasks have position property
      const posA = a.position !== undefined ? a.position : 0;
      const posB = b.position !== undefined ? b.position : 0;
      return posA - posB;
    });
    setLocalTasks(sortedTasks);
  }, [tasks]);

  const handleOpenTaskModal = (task?: Task) => {
    if (task) {
      setTaskToEdit(task);
    } else {
      setTaskToEdit(null);
    }
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(localTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }));
    
    setLocalTasks(updatedItems);
    handleReorder(updatedItems);
  };

  const handleReorder = async (tasks: Task[]) => {
    try {
      // Update each task with its new position
      for (const task of tasks) {
        await updateTask(task.id, task);
      }
      toast.success('Tasks reordered successfully');
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
      toast.error('Failed to reorder tasks');
      // Refresh project data to reset order
      refetchProject();
    }
  };

  const handleStatusChange = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    try {
      const newStatus: 'Complete' | 'Not Started' = task.status === 'Complete' ? 'Not Started' : 'Complete';
      const updatedTask = {
        ...task,
        status: newStatus,
        lastEdited: new Date().toISOString()
      };
      await updateTask(taskId, updatedTask);
      refetchProject();
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully');
      refetchProject();
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button 
          onClick={() => handleOpenTaskModal()}
          className="bg-jetpack-blue hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {localTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No tasks yet. Click "Add Task" to create your first task.
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="divide-y divide-gray-200"
                >
                  {localTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 pt-1">
                              <button
                                onClick={() => handleStatusChange(task.id)}
                                className="focus:outline-none"
                              >
                                <CheckCircle 
                                  className={`h-5 w-5 ${
                                    task.status === 'Complete' 
                                      ? 'text-green-500 fill-green-500' 
                                      : 'text-gray-400'
                                  }`} 
                                />
                              </button>
                            </div>
                            <div 
                              className="flex-grow cursor-pointer"
                              onClick={() => handleOpenTaskModal(task)}
                            >
                              <h3 className={`font-medium ${
                                task.status === 'Complete' ? 'line-through text-gray-500' : 'text-gray-900'
                              }`}>
                                {task.name}
                              </h3>
                              {task.description && (
                                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                              )}
                              <div className="mt-2 flex items-center text-xs text-gray-500">
                                <span className="mr-2">
                                  Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}
                                </span>
                                {task.assigneeId && (
                                  <span className="mr-2">
                                    Assignee: {task.assigneeId === 'user-1' ? 'John Doe' : 
                                              task.assigneeId === 'user-2' ? 'Jane Smith' : 
                                              task.assigneeId === 'user-3' ? 'Vyas' : 'Unknown'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-gray-400 hover:text-red-500 focus:outline-none"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
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
        )}
      </div>
      
      {isTaskModalOpen && (
        <TaskModal
          projectId={projectId}
          onClose={handleCloseTaskModal}
          onSuccess={refetchProject}
          taskToEdit={taskToEdit}
        />
      )}
    </div>
  );
};

export default TaskList;
