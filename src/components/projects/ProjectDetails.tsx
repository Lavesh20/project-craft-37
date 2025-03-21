
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { fetchProject, fetchTemplate, updateProject } from '@/services/api';
import { Project, Template } from '@/types';
import ProjectHeader from './ProjectHeader';
import ProjectInfo from './ProjectInfo';
import TaskList from './TaskList';
import CommentsSection from './CommentsSection';
import ProjectModal from './ProjectModal';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (id: string) => {
    try {
      setLoading(true);
      const data = await fetchProject(id);
      
      if (!data) {
        navigate('/projects', { replace: true });
        return;
      }
      
      setProject(data);
      
      // If the project has a templateId, fetch the template
      if (data.templateId) {
        try {
          const templateData = await fetchTemplate(data.templateId);
          setTemplate(templateData || null);
        } catch (error) {
          console.error('Failed to fetch template:', error);
        }
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
      navigate('/projects', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    if (projectId) {
      loadProject(projectId);
    }
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    setProject(updatedProject);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Skeleton className="h-48 mb-6" />
            <Skeleton className="h-64" />
          </div>
          <div>
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl text-red-500">Project not found</h2>
        <p className="mt-2">This project may have been deleted or you don't have access to it.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <ProjectHeader
          project={project}
          onEdit={handleEditClick}
          onProjectUpdate={handleProjectUpdate}
        />
        
        {template && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-medium">Based on template:</span>
              <span>{template.name}</span>
            </div>
            <button 
              onClick={() => navigate(`/templates/${template.id}`)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
            >
              View Template <ExternalLink size={14} />
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ProjectInfo project={project} onProjectUpdate={handleProjectUpdate} />
            <TaskList 
              projectId={project.id} 
              tasks={project.tasks || []}
              onProjectUpdate={handleProjectUpdate}
            />
          </div>
          <div>
            <CommentsSection projectId={project.id} />
          </div>
        </div>
        
        <div className="mt-10 text-sm text-gray-500 border-t pt-4">
          <div>
            Last edited {format(parseISO(project.lastEdited), 'MMMM d, yyyy h:mm a')} by {project.lastEditedBy ? (
              project.lastEditedBy === 'user-1' ? 'John Doe' : 
              project.lastEditedBy === 'user-2' ? 'Jane Smith' : 
              project.lastEditedBy === 'user-3' ? 'Vyas' : 'Unknown User'
            ) : 'Unknown User'}
          </div>
        </div>
      </div>
      
      {isEditModalOpen && (
        <ProjectModal
          onClose={handleCloseModal}
          projectToEdit={project}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
