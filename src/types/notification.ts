
export interface Notification {
  id: string;
  type: 'task' | 'project' | 'comment' | 'system';
  title: string;
  message: string;
  date: Date;
  read: boolean;
  entityId?: string;
}

export interface NotificationPreference {
  id: string;
  type: string;
  label: string;
  enabled: boolean;
}
