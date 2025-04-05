
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { Project } from '@/types';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProjectHeaderProps {
  project: Project;
  onEdit: () => void;
  onProjectUpdate: (project: Project) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onEdit, onProjectUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Direct API call to update project status
  const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
    try {
      console.log(`Updating project ${id} with data:`, projectData);
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.patch(`/api/projects/${id}`, projectData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      console.log('Project updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  };

  const handleStatusChange = async (newStatus: 'Not Started' | 'In Progress' | 'Complete') => {
    if (newStatus === project.status) return;
    
    try {
      setIsUpdating(true);
      const updatedProject = await updateProject(project.id, {
        ...project,
        status: newStatus,
        lastEdited: new Date().toISOString(),
        lastEditedBy: 'user-1' // Using placeholder user ID
      });

      onProjectUpdate(updatedProject);
      toast.success(`Project status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update project status:', error);
      toast.error('Failed to update project status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-3">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <Button 
          className="bg-jetpack-blue hover:bg-blue-700"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Project
        </Button>
      </div>
      
      <div className="mb-4 text-gray-600">
        {project.description}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-sm mr-3">Project Status:</div>
        <Button
          variant={project.status === 'Not Started' ? "default" : "outline"}
          size="sm"
          className={project.status === 'Not Started' ? "bg-gray-500 hover:bg-gray-600" : ""}
          onClick={() => handleStatusChange('Not Started')}
          disabled={isUpdating}
        >
          Not Started
        </Button>
        <Button
          variant={project.status === 'In Progress' ? "default" : "outline"}
          size="sm"
          className={project.status === 'In Progress' ? "bg-blue-500 hover:bg-blue-600" : ""}
          onClick={() => handleStatusChange('In Progress')}
          disabled={isUpdating}
        >
          In Progress
        </Button>
        <Button
          variant={project.status === 'Complete' ? "default" : "outline"}
          size="sm"
          className={project.status === 'Complete' ? "bg-green-500 hover:bg-green-600" : ""}
          onClick={() => handleStatusChange('Complete')}
          disabled={isUpdating}
        >
          Complete
        </Button>
      </div>
    </div>
  );
};

export default ProjectHeader;
