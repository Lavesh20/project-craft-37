
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { TasksByStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface TasksByStatusViewProps {
  tasksByStatus: TasksByStatus;
  loading: boolean;
}

const TasksByStatusView: React.FC<TasksByStatusViewProps> = ({ tasksByStatus, loading }) => {
  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Ensure tasksByStatus is an object before getting its keys
  const statusOrder = ['Not Started', 'In Progress', 'Complete'];
  const statuses = Object.keys(tasksByStatus || {}).sort(
    (a, b) => statusOrder.indexOf(a) - statusOrder.indexOf(b)
  );

  if (statuses.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">All done!</h3>
        <p className="text-gray-500">No tasks to display</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Not Started':
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      case 'In Progress':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'Complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {statuses.map((status) => {
        // Make sure we always have an array, even if tasksByStatus[status] is undefined or not an array
        const tasksForStatus = Array.isArray(tasksByStatus[status]) 
          ? tasksByStatus[status] 
          : [];

        return (
          <div key={status}>
            <div className="flex items-center gap-2 mb-4">
              {getStatusIcon(status)}
              <h2 className="text-lg font-medium">{status}</h2>
            </div>

            {tasksForStatus.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">All done!</h3>
                <p className="text-gray-500">No tasks to display</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-3 bg-gray-50 border-b">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                    <div className="col-span-6">TASK</div>
                    <div className="col-span-3">PROJECT</div>
                    <div className="col-span-3 text-right">DUE DATE</div>
                  </div>
                </div>
                
                {tasksForStatus.map((task) => (
                  <div key={task.id} className="px-6 py-4 border-b last:border-b-0 hover:bg-gray-50">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6 flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900">{task.name}</div>
                          {task.description && (
                            <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-3">
                        {task.projectName && (
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                            {task.projectName}
                          </div>
                        )}
                        {task.clientName && (
                          <div className="text-xs text-gray-500 mt-1">{task.clientName}</div>
                        )}
                      </div>
                      <div className="col-span-3 text-right whitespace-nowrap">
                        <span className={`text-sm font-medium ${new Date(task.dueDate) < new Date() ? 'text-red-600' : 'text-gray-600'}`}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TasksByStatusView;
