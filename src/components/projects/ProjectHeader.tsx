
import React, { useState } from 'react';
import { updateProject } from '@/services/api';
import { Project } from '@/types';
import { MoreHorizontal, Plus, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ProjectHeaderProps {
  project: Project;
  onEdit: () => void;
  onProjectUpdate: (updatedProject: Project) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onEdit, onProjectUpdate }) => {
  const [newLabel, setNewLabel] = useState('');
  const [isAddingLabel, setIsAddingLabel] = useState(false);

  const handleAddLabel = async () => {
    if (!newLabel.trim()) return;

    const updatedLabels = [...(project.labels || []), newLabel.trim()];
    
    try {
      const updatedProject = await updateProject(project.id, { labels: updatedLabels });
      onProjectUpdate(updatedProject);
      setNewLabel('');
      setIsAddingLabel(false);
    } catch (error) {
      console.error('Failed to add label:', error);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
          {project.description && (
            <p className="text-gray-500 mt-1">{project.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={onEdit} variant="outline" className="flex gap-2">
            Edit Project
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 items-center">
        {project.labels?.map(label => (
          <Badge key={label} variant="outline" className="bg-gray-100 px-3 py-1">
            {label}
          </Badge>
        ))}
        
        <Dialog open={isAddingLabel} onOpenChange={setIsAddingLabel}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <Tags size={16} className="mr-1" />
              <span>Click here to create a label</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Label</DialogTitle>
              <DialogDescription>
                Create a new label to categorize your project.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Enter label name"
                className="mb-4"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddLabel}>Add Label</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectHeader;
