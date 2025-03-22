
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Templates: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Templates</h1>
          <Link to="/templates/new">
            <Button className="bg-jetpack-blue hover:bg-blue-700 inline-flex items-center gap-2">
              <Plus size={16} />
              New Template
            </Button>
          </Link>
        </header>
        
        <div className="bg-white rounded-md shadow p-6">
          <p className="text-gray-500 text-center py-8">
            No templates available. Create your first template to get started.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Templates;
