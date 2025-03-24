
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getMyOverdueTasks,
  getMyTasksByStatus,
  getMyTasksByProject
} from '@/services/api';
import { MyWorkTask, TasksByStatus, TasksByProject } from '@/types';
import OverdueTasksView from './OverdueTasksView';
import TasksByStatusView from './TasksByStatusView';
import TasksByProjectView from './TasksByProjectView';

const MyWorkDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overdue');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [overdueTasks, setOverdueTasks] = useState<MyWorkTask[]>([]);
  const [tasksByStatus, setTasksByStatus] = useState<TasksByStatus>({});
  const [tasksByProject, setTasksByProject] = useState<TasksByProject>({});

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overdue') {
        const tasks = await getMyOverdueTasks();
        setOverdueTasks(tasks);
      } else if (activeTab === 'status') {
        const tasks = await getMyTasksByStatus(format(selectedDate, 'yyyy-MM-dd'));
        setTasksByStatus(tasks);
      } else if (activeTab === 'project') {
        const tasks = await getMyTasksByProject(format(selectedDate, 'yyyy-MM-dd'));
        setTasksByProject(tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tasks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    fetchTasks();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleApply = () => {
    fetchTasks();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Work</h1>

      <Tabs defaultValue="overdue" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="overdue">All Overdue</TabsTrigger>
          <TabsTrigger value="status">View by Status</TabsTrigger>
          <TabsTrigger value="project">View by Project</TabsTrigger>
        </TabsList>

        {(activeTab === 'status' || activeTab === 'project') && (
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <span className="mr-2">Viewing the week of:</span>
              <div className="relative">
                <Input
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={handleDateChange}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
            <Button onClick={handleApply}>Apply</Button>
          </div>
        )}

        <TabsContent value="overdue">
          <OverdueTasksView tasks={overdueTasks} loading={loading} />
        </TabsContent>

        <TabsContent value="status">
          <TasksByStatusView tasksByStatus={tasksByStatus} loading={loading} />
        </TabsContent>

        <TabsContent value="project">
          <TasksByProjectView tasksByProject={tasksByProject} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyWorkDashboard;
