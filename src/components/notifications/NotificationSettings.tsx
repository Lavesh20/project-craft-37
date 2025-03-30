
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface NotificationSettingsProps {
  settings: {
    tasks: boolean;
    projects: boolean;
    comments: boolean;
    system: boolean;
  };
  onSettingsChange: (settings: NotificationSettingsProps['settings']) => void;
}

const NotificationSettings = ({ settings, onSettingsChange }: NotificationSettingsProps) => {
  const form = useForm({
    defaultValues: settings
  });

  const onSubmit = (data: NotificationSettingsProps['settings']) => {
    onSettingsChange(data);
  };

  return (
    <div className="h-full flex flex-col">
      <SheetHeader className="mb-6">
        <SheetTitle>Notification Settings</SheetTitle>
      </SheetHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="tasks"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Task notifications</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Receive notifications about upcoming and overdue tasks
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="projects"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Project notifications</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Receive notifications about project deadlines
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Comment notifications</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Receive notifications when someone comments on your work
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="system"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">System notifications</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Receive important system notifications and updates
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NotificationSettings;
