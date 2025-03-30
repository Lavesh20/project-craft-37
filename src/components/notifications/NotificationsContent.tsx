
import React, { useState } from 'react';
import { Bell, Settings, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/context/NotificationContext';
import NotificationSettings from './NotificationSettings';

const NotificationsContent = () => {
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
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

  if (showSettings) {
    return <NotificationSettings onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <Check className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(true)}>
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
                className={`flex gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                onClick={() => handleMarkAsRead(notification.id)}
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
