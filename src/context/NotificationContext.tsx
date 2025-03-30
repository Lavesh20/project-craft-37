
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification, NotificationPreference } from '@/types/notification';
import { mockData } from '@/services/mock';
import { format } from 'date-fns';

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreference[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  togglePreference: (id: string) => void;
  addNotification: (notification: Notification) => void;
};

const defaultPreferences: NotificationPreference[] = [
  { id: 'task-next', type: 'task', label: 'Your task is up next', enabled: true },
  { id: 'mentioned-task', type: 'mention', label: 'Mentioned in a task', enabled: true },
  { id: 'mentioned-project', type: 'mention', label: 'Mentioned in a project', enabled: true },
  { id: 'task-marked', type: 'task', label: 'Your task was marked incomplete', enabled: true },
  { id: 'project-due', type: 'project', label: 'Project due today', enabled: true },
  { id: 'task-due', type: 'task', label: 'Task due today', enabled: true },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>(defaultPreferences);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Generate initial notifications
  useEffect(() => {
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
            type: 'task' as const,
            title: `Task ${isOverdue ? 'overdue' : 'due soon'}`,
            message: `"${task.name}" for ${project?.name || 'Unknown Project'} is ${isOverdue ? 'overdue' : 'due today'}.`,
            date: new Date(task.dueDate),
            read: false,
            entityId: task.id
          };
        });

      // Get project deadlines notifications
      const projectNotifications = mockData.projects
        .filter(project => {
          const dueDate = new Date(project.dueDate);
          const timeDiff = dueDate.getTime() - today.getTime();
          // Get projects due within 5 days or overdue
          return timeDiff <= 5 * 24 * 60 * 60 * 1000;
        })
        .map(project => ({
          id: `project-${project.id}`,
          type: 'project' as const,
          title: 'Project deadline approaching',
          message: `Project "${project.name}" is due on ${format(new Date(project.dueDate), 'MMM dd')}.`,
          date: new Date(project.dueDate),
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

    setNotifications(generateNotifications());
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const togglePreference = (id: string) => {
    setPreferences(
      preferences.map(pref => 
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        preferences, 
        markAsRead, 
        markAllAsRead, 
        togglePreference, 
        addNotification 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
