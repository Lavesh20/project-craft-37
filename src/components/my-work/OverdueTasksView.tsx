
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { MyWorkTask } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface OverdueTasksViewProps {
  tasks: MyWorkTask[];
  loading: boolean;
}

const OverdueTasksView: React.FC<OverdueTasksViewProps> = ({ tasks, loading }) => {
  // Ensure tasks is an array before processing
  const taskList = Array.isArray(tasks) ? tasks : [];

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (taskList.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">All done!</h3>
        <p className="text-gray-500">No tasks to display</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-5 w-5 text-orange-500" />
        <h2 className="text-lg font-medium">Overdue</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {taskList.map((task) => (
          <div key={task.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 pt-1">
                <CheckCircle className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-900">{task.name}</h3>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {task.projectName && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                      {task.projectName}
                    </span>
                  )}
                  {task.clientName && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {task.clientName}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right text-sm whitespace-nowrap">
                <span className="text-red-600 font-medium">
                  {new Date(task.dueDate) < new Date() ? 'Overdue' : task.dueDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverdueTasksView;
