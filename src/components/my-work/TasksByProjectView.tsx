
import React from 'react';
import { Building2, CheckCircle } from 'lucide-react';
import { TasksByProject } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface TasksByProjectViewProps {
  tasksByProject: TasksByProject;
  loading: boolean;
}

const TasksByProjectView: React.FC<TasksByProjectViewProps> = ({ tasksByProject, loading }) => {
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

  const projectIds = Object.keys(tasksByProject);

  if (projectIds.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">All done!</h3>
        <p className="text-gray-500">No tasks to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {projectIds.map((projectId) => {
        const { projectName, clientName, tasks } = tasksByProject[projectId];
        
        return (
          <div key={projectId}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-medium">{projectName}</h2>
              {clientName && (
                <>
                  <span className="mx-2 text-gray-300">•</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Building2 className="h-4 w-4 mr-1" />
                    {clientName}
                  </div>
                </>
              )}
            </div>

            {tasks.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">All done!</h3>
                <p className="text-gray-500">No tasks to display</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-3 bg-gray-50 border-b">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                    <div className="col-span-7">TASK</div>
                    <div className="col-span-3 text-right">DUE DATE</div>
                    <div className="col-span-2 text-right">STATUS</div>
                  </div>
                </div>
                
                {tasks.map((task) => (
                  <div key={task.id} className="px-6 py-4 border-b last:border-b-0 hover:bg-gray-50">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-7 flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900">{task.name}</div>
                          {task.description && (
                            <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-3 text-right whitespace-nowrap">
                        <span className={`text-sm font-medium ${new Date(task.dueDate) < new Date() ? 'text-red-600' : 'text-gray-600'}`}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                          task.status === 'Complete' 
                            ? 'bg-green-100 text-green-800' 
                            : task.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
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

export default TasksByProjectView;
