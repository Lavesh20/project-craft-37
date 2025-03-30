
import React, { useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Cog, Bell } from 'lucide-react';
import NotificationSettings from './NotificationSettings';
import { format } from 'date-fns';

const NotificationsContent = () => {
  const { notifications, markAllAsRead, markAsRead } = useNotifications();
  const [showSettings, setShowSettings] = useState(false);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  if (showSettings) {
    return <NotificationSettings onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleMarkAllAsRead}
            className="border-gray-300"
          >
            Mark all as read
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowSettings(true)}
            className="border-gray-300"
          >
            <Cog className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bell className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-2 h-2 mt-2 rounded-full ${!notification.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                  <div>
                    <div className="font-medium">{notification.title}</div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <div className="text-gray-400 text-xs mt-2">{format(notification.date, 'MMM dd, h:mm a')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsContent;
