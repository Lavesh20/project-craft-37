
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { Project, Template } from '@/types';
import ProjectHeader from './ProjectHeader';
import ProjectInfo from './ProjectInfo';
import TaskList from './TaskList';
import CommentsSection from './CommentsSection';
import ProjectModal from './ProjectModal';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Function to fetch project directly with axios
  const fetchProject = async (id: string): Promise<Project> => {
    try {
      console.log(`Fetching project ${id} directly from component...`);
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`/api/projects/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      console.log('Project data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      // Use mock data as fallback for development
      console.log('Using mock project data as fallback');
      throw error;
    }
  };

  // Function to fetch template directly with axios
  const fetchTemplate = async (templateId: string): Promise<Template> => {
    try {
      console.log(`Fetching template ${templateId} directly from component...`);
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`/api/templates/${templateId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      console.log('Template data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  };

  // Use tanstack query for data fetching with direct axios functions
  const { data: projectData, isLoading: projectLoading, refetch: refetchProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectId ? fetchProject(projectId) : undefined,
    enabled: !!projectId,
  });

  // Fetch template if project has a templateId
  const { data: template, isLoading: templateLoading } = useQuery({
    queryKey: ['template', projectData?.templateId],
    queryFn: () => projectData?.templateId ? fetchTemplate(projectData.templateId) : undefined,
    enabled: !!projectData?.templateId,
  });

  // Effect to update local state when query data changes
  useEffect(() => {
    if (projectData) {
      setProject(projectData);
    } else if (!projectLoading && projectId) {
      // If not loading and no data, redirect to projects page
      navigate('/projects', { replace: true });
    }
  }, [projectData, projectLoading, navigate, projectId]);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    setProject(updatedProject);
  };

  const loading = projectLoading || templateLoading;

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
              refetchProject={refetchProject}
              project={project}
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
