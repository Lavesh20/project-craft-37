
import React from 'react';
import ProjectsList from '@/components/projects/ProjectsList';
import MainLayout from '@/components/layout/MainLayout';

const Projects: React.FC = () => {
  return (
    <MainLayout>
      <ProjectsList />
    </MainLayout>
  );
};

export default Projects;
