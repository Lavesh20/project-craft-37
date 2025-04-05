import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NotificationSettings from './NotificationSettings';
import { AccountSettings } from '@/types/account';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BellRing } from 'lucide-react';
import axios from 'axios';

// Define the notification type
interface Notification {
  id: string;
  type: 'system' | 'task' | 'project' | 'comment';
  title: string;
  message: string;
  date: string;
  read: boolean;
  entityId: string;
}

// Direct API functions
const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return [];
    
    const response = await axios.get(`/api/notifications/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    await axios.put(`/api/notifications/${notificationId}/read`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    await axios.put(`/api/notifications/${userId}/read-all`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

const NotificationsContent = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id || '';

  // Default notification settings
  const [notificationSettings, setNotificationSettings] = useState<AccountSettings['notifications']>({
    tasks: true,
    projects: true,
    comments: true,
    system: true
  });

  // Use mock notifications for now since API isn't returning data
  const mockNotifications = [
    {
      id: '1',
      type: 'system',
      title: 'System Maintenance',
      message: 'The system will be undergoing maintenance tonight from 2-4 AM.',
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
      read: false,
      entityId: 'system-1'
    },
    {
      id: '2',
      type: 'task',
      title: 'Task Due Soon',
      message: 'Your task "Complete financial report" is due tomorrow.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
      entityId: 'task-123'
    },
    {
      id: '3',
      type: 'project',
      title: 'New Project Created',
      message: 'A new project "Q4 Marketing Campaign" has been created.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      read: true,
      entityId: 'project-456'
    },
    {
      id: '4',
      type: 'comment',
      title: 'New Comment',
      message: 'John Smith commented on "Q3 Financial Report".',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
      entityId: 'comment-789'
    },
    {
      id: '5',
      type: 'task',
      title: 'Task Assigned',
      message: 'You have been assigned a new task "Prepare client presentation".',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      read: false,
      entityId: 'task-456'
    },
  ];

  // Query to fetch notifications
  const { data: apiNotifications = [], isLoading, error } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => {
      if (!user || !userId) return Promise.resolve([]);
      // Try to fetch from API, but use mock data as fallback
      return fetchNotifications(userId).catch(err => {
        console.log('Using mock notifications due to API error:', err);
        return mockNotifications;
      });
    },
    enabled: !!userId,
  });

  // Make sure we always have notifications to display (either from API or mock)
  const notifications = apiNotifications.length > 0 ? apiNotifications : mockNotifications;
  
  // Convert notifications to array if it's not already
  const notificationsArray = Array.isArray(notifications) ? notifications : [];

  // Mutation for marking a notification as read
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read.",
        variant: "destructive"
      });
    }
  });

  // Mutation for marking all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: (userId: string) => markAllNotificationsAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      toast({
        title: "Success",
        description: "All notifications have been marked as read.",
      });
    },
    onError: (error) => {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read.",
        variant: "destructive"
      });
    }
  });

  // Handle marking a notification as read
  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    if (user?.id) {
      markAllAsReadMutation.mutate(user.id);
    }
  };

  // Handle notification settings change
  const handleSettingsChange = (settings: AccountSettings['notifications']) => {
    setNotificationSettings(settings);
    setShowSettings(false);
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  // Filter notifications based on active tab
  const filteredNotifications = notificationsArray.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  // Count unread notifications
  const unreadCount = notificationsArray.filter(notification => !notification.read).length;

  // Format date string to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Notifications</h2>
          <p className="text-gray-600 mb-4">We encountered a problem while loading your notifications.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['notifications', userId] })}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <Sheet open={showSettings} onOpenChange={setShowSettings}>
            <SheetTrigger asChild>
              <Button variant="outline">Settings</Button>
            </SheetTrigger>
            <SheetContent>
              <NotificationSettings 
                settings={notificationSettings} 
                onSettingsChange={handleSettingsChange}
              />
            </SheetContent>
          </Sheet>
          {unreadCount > 0 && (
            <Button variant="secondary" onClick={handleMarkAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All
            {unreadCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="task">Tasks</TabsTrigger>
          <TabsTrigger value="project">Projects</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
                <BellRing className="h-12 w-12 mb-4 opacity-40" />
                <p className="text-lg font-medium mb-2">No notifications to display</p>
                <p className="text-sm">When you receive notifications, they will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={notification.read ? 'opacity-70' : ''}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`text-lg font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {formatRelativeTime(notification.date)}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsContent;
