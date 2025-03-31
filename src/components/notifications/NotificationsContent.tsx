import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  MessageCircle,
  Settings as SettingsIcon,
  X
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import NotificationSettings from './NotificationSettings';
import { mockData } from '@/services/mock';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Notification {
  _id?: string;
  id?: string;
  userId: string;
  type: 'system' | 'task' | 'project' | 'comment';
  title: string;
  message: string;
  date: Date;
  read: boolean;
  entityId: string; // The ID of the project, task, or comment
}

const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const userId = 'demo-user';
    const response = await axios.get(`/api/notifications/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return generateMockNotifications();
  }
};

const markAsReadApi = async (notificationId: string): Promise<Notification> => {
  const response = await axios.put(`/api/notifications/${notificationId}/read`);
  return response.data;
};

const markAllAsReadApi = async (userId: string): Promise<any> => {
  const response = await axios.put(`/api/notifications/mark-all-read/${userId}`);
  return response.data;
};

const generateMockNotifications = (): Notification[] => {
  const userId = 'demo-user';
  return [
    // Task notifications
    ...mockData.tasks.filter(task => !task.status.includes('Complete')).slice(0, 3).map(task => ({
      id: `task-${task.id}`,
      userId,
      type: 'task' as const,
      title: task.name,
      message: `Task "${task.name}" is due soon.`,
      date: new Date(task.dueDate),
      read: false,
      entityId: task.id
    })),
    // Project notifications
    ...mockData.projects.slice(0, 2).map(project => ({
      id: `project-${project.id}`,
      userId,
      type: 'project' as const,
      title: project.name,
      message: `Project "${project.name}" deadline is approaching.`,
      date: new Date(project.dueDate),
      read: false,
      entityId: project.id
    })),
    // System notifications
    {
      id: 'system-trial',
      userId,
      type: 'system' as const,
      title: 'Trial Ending Soon',
      message: 'Your free trial will end in 5 days. Upgrade now to continue using all features.',
      date: new Date(),
      read: false,
      entityId: 'trial'
    },
    {
      id: 'system-feature',
      userId,
      type: 'system' as const,
      title: 'New Feature Available',
      message: 'We\'ve added new reporting capabilities! Check it out in the dashboard.',
      date: new Date(Date.now() - 86400000), // Yesterday
      read: false,
      entityId: 'feature'
    }
  ];
};

const NotificationsContent = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    tasks: true,
    projects: true,
    comments: true,
    system: true
  });
  
  const queryClient = useQueryClient();
  const userId = 'demo-user';

  const { 
    data: notifications = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: fetchNotifications,
    initialData: generateMockNotifications(),
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch notifications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load notifications. Using mock data instead.',
          variant: 'destructive'
        });
      }
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: markAsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
    onError: (error) => {
      console.error('Failed to mark notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive'
      });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllAsReadApi(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    },
    onError: (error) => {
      console.error('Failed to mark all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive'
      });
    }
  });

  const markAsRead = async (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const markAllAsRead = async () => {
    markAllAsReadMutation.mutate();
  };

  const handleNotificationClick = async (notification: Notification) => {
    const notificationId = notification._id || notification.id;
    if (notificationId) {
      markAsRead(notificationId);
    }
    
    if (notification.type === 'task') {
      toast({
        title: "Navigation",
        description: `Navigating to task ${notification.entityId} (not implemented)`,
      });
    } else if (notification.type === 'project') {
      toast({
        title: "Navigation",
        description: `Navigating to project ${notification.entityId} (not implemented)`,
      });
    } else if (notification.type === 'system' && notification.entityId === 'trial') {
      toast({
        title: "Navigation",
        description: "Navigating to account page (not implemented)",
      });
    }
  };

  const handleSettingsChange = (settings: typeof notificationSettings) => {
    setNotificationSettings(settings);
    setSettingsOpen(false);
    
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.type === activeTab);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex space-x-2">
          <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </SheetTrigger>
            <SheetContent>
              <NotificationSettings 
                settings={notificationSettings} 
                onSettingsChange={handleSettingsChange} 
              />
            </SheetContent>
          </Sheet>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={markAllAsReadMutation.isPending || unreadCount === 0}
          >
            {markAllAsReadMutation.isPending 
              ? <span>Processing...</span> 
              : <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark all as read
                </>
            }
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="task">Tasks</TabsTrigger>
          <TabsTrigger value="project">Projects</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-6 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-jetpack-blue mb-3"></div>
                <p className="text-gray-500">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications to display</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification._id || notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors flex ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="mr-3 mt-1">
                      {notification.type === 'task' && (
                        <Clock className={`h-5 w-5 ${!notification.read ? 'text-blue-500' : 'text-gray-400'}`} />
                      )}
                      {notification.type === 'project' && (
                        <AlertCircle className={`h-5 w-5 ${!notification.read ? 'text-blue-500' : 'text-gray-400'}`} />
                      )}
                      {notification.type === 'comment' && (
                        <MessageCircle className={`h-5 w-5 ${!notification.read ? 'text-blue-500' : 'text-gray-400'}`} />
                      )}
                      {notification.type === 'system' && (
                        <Bell className={`h-5 w-5 ${!notification.read ? 'text-blue-500' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className={`font-medium ${!notification.read ? 'text-blue-800' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {format(new Date(notification.date), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsContent;
