
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/context/NotificationContext';

interface NotificationSettingsProps {
  onBack: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onBack }) => {
  const { toast } = useToast();
  const { preferences, togglePreference } = useNotifications();

  const saveSettings = () => {
    // In a real app, you would save to API/localStorage here
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    });
    onBack();
  };

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Notification Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="space-y-4">
          {preferences.map((preference) => (
            <div key={preference.id} className="flex items-center justify-between">
              <span className="text-sm font-medium">{preference.label}</span>
              <Switch 
                checked={preference.enabled} 
                onCheckedChange={() => togglePreference(preference.id)}
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Button 
            onClick={saveSettings}
            className="bg-jetpack-blue hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
