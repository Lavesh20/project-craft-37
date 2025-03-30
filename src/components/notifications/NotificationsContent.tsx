
import React, { useState } from 'react';
import { Bell, Settings, Check } from 'lucide-react';
import { mockData } from '@/services/mock';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'task' | 'project' | 'comment' | 'system';
  title: string;
  message: string;
  date: Date;
  read: boolean;
  entityId?: string;
}

const NotificationsContent = () => {
  const { toast } = useToast();
  // Generate notifications based on overdue tasks and projects
  const generateNotifications = (): Notification[] => {
    const today = new Date();
    
    // Get upcoming/overdue tasks
    const taskNotifications = mockData.tasks
      .filter(task => {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - today.getTime();
        // Get tasks due within 3 days or overdue
        return timeDiff <= 3 * 24 * 60 * 60 * 1000;
      })
      .map(task => {
        const project = mockData.projects.find(p => p.id === task.projectId);
        const isOverdue = new Date(task.dueDate) < today;
        
        return {
          id: `task-${task.id}`,
          type: 'task',
          title: `Task ${isOverdue ? 'overdue' : 'due soon'}`,
          message: `"${task.title}" for ${project?.name || 'Unknown Project'} is ${isOverdue ? 'overdue' : 'due today'}.`,
          date: new Date(task.dueDate),
          read: false,
          entityId: task.id
        };
      });

    // Get project deadlines notifications
    const projectNotifications = mockData.projects
      .filter(project => {
        const deadline = new Date(project.deadline);
        const timeDiff = deadline.getTime() - today.getTime();
        // Get projects due within 5 days or overdue
        return timeDiff <= 5 * 24 * 60 * 60 * 1000;
      })
      .map(project => ({
        id: `project-${project.id}`,
        type: 'project',
        title: 'Project deadline approaching',
        message: `Project "${project.name}" is due on ${format(new Date(project.deadline), 'MMM dd')}.`,
        date: new Date(project.deadline),
        read: false,
        entityId: project.id
      }));
    
    // Add some system notifications
    const systemNotifications: Notification[] = [
      {
        id: 'system-trial',
        type: 'system',
        title: 'Trial ending soon',
        message: 'Your free trial expires in 5 days. Upgrade to keep access to all features.',
        date: new Date(today.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true
      },
      {
        id: 'system-new-feature',
        type: 'system',
        title: 'New feature available',
        message: 'Check out our new team collaboration tools!',
        date: new Date(today.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        read: false
      }
    ];
    
    // Combine all notifications and sort by date (newest first)
    return [...taskNotifications, ...projectNotifications, ...systemNotifications]
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const [notifications, setNotifications] = useState<Notification[]>(generateNotifications());

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task':
        return (
          <div className="rounded-full p-2 bg-orange-500 text-white">
            <Bell size={20} />
          </div>
        );
      case 'project':
        return (
          <div className="rounded-full p-2 bg-purple-500 text-white">
            <Bell size={20} />
          </div>
        );
      case 'system':
        return (
          <div className="rounded-full p-2 bg-blue-500 text-white">
            <Bell size={20} />
          </div>
        );
      default:
        return (
          <div className="rounded-full p-2 bg-gray-500 text-white">
            <Bell size={20} />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <Bell className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`flex gap-4 p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <span className="text-sm text-gray-500">
                      {format(notification.date, 'MMM dd')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsContent;
