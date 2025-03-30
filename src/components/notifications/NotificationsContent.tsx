
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

// Define the Notification type
interface Notification {
  id: string;
  type: 'system' | 'task' | 'project' | 'comment';
  title: string;
  message: string;
  date: Date;
  read: boolean;
  entityId: string; // The ID of the project, task, or comment
}

const NotificationsContent = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    tasks: true,
    projects: true,
    comments: true,
    system: true
  });

  // Initialize notifications
  useEffect(() => {
    // This would be replaced with an API call in the future
    // Example: axios.get('/api/notifications')
    const initialNotifications: Notification[] = [
      // Task notifications
      ...mockData.tasks.filter(task => !task.status.includes('Complete')).slice(0, 3).map(task => ({
        id: `task-${task.id}`,
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
        type: 'system' as const,
        title: 'Trial Ending Soon',
        message: 'Your free trial will end in 5 days. Upgrade now to continue using all features.',
        date: new Date(),
        read: false,
        entityId: 'trial'
      },
      {
        id: 'system-feature',
        type: 'system' as const,
        title: 'New Feature Available',
        message: 'We\'ve added new reporting capabilities! Check it out in the dashboard.',
        date: new Date(Date.now() - 86400000), // Yesterday
        read: false,
        entityId: 'feature'
      }
    ];

    setNotifications(initialNotifications);
  }, []);

  const fetchNotifications = async () => {
    try {
      // This would be replaced with an API call in the future
      // const response = await axios.get('/api/notifications');
      // setNotifications(response.data);
      console.log('Notifications would be fetched from backend');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive"
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // This would be replaced with an API call in the future
      // await axios.put(`/api/notifications/${notificationId}/read`);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      // This would be replaced with an API call in the future
      // await axios.put('/api/notifications/mark-all-read');
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    markAsRead(notification.id);
    
    // Navigate to the relevant page based on notification type
    // This would be implemented with react-router in a real application
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
    
    // This would be replaced with an API call in the future
    // axios.put('/api/user/notification-settings', settings);
    
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
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark all as read
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
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications to display</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id}
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
                          {format(notification.date, 'MMM d, h:mm a')}
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
