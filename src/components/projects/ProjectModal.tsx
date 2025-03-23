
import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus } from 'lucide-react';
import { fetchClients, fetchTeamMembers, fetchTemplates, createProject, updateProject } from '@/services/api';
import { Client, TeamMember, CreateProjectFormData, Project, Template } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

interface ProjectModalProps {
  onClose: () => void;
  projectToEdit?: Project; // Make this optional to support both create and edit modes
}

const ProjectModal: React.FC<ProjectModalProps> = ({ onClose, projectToEdit }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    projectToEdit ? parseISO(projectToEdit.dueDate) : new Date()
  );
  const [newClientName, setNewClientName] = useState('');
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);
  
  const isEditMode = !!projectToEdit;
  
  const [formData, setFormData] = useState<CreateProjectFormData>({
    name: '',
    description: '',
    clientId: '',
    assigneeId: '',
    teamMemberIds: [],
    repeating: false,
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'Not Started' // Add the missing status field with a default value
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [clientsData, teamMembersData, templatesData] = await Promise.all([
          fetchClients(),
          fetchTeamMembers(),
          fetchTemplates()
        ]);
        setClients(clientsData);
        setTeamMembers(teamMembersData);
        setTemplates(templatesData);
        
        // If in edit mode, populate form with project data
        if (projectToEdit) {
          setFormData({
            name: projectToEdit.name,
            description: projectToEdit.description || '',
            clientId: projectToEdit.clientId || '',
            assigneeId: projectToEdit.assigneeId || '',
            teamMemberIds: projectToEdit.teamMemberIds || [],
            repeating: projectToEdit.repeating || false,
            frequency: projectToEdit.frequency,
            dueDate: projectToEdit.dueDate,
            status: projectToEdit.status
          });
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [projectToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRepeatingChange = (isRepeating: boolean) => {
    setFormData(prev => ({ ...prev, repeating: isRepeating }));
  };

  const handleTeamMemberSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, teamMemberIds: selectedOptions }));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setFormData(prev => ({ ...prev, dueDate: format(newDate, 'yyyy-MM-dd') }));
    }
  };
  
  const handleTemplateSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId === "" ? undefined : templateId);
    
    if (templateId) {
      // Find the selected template
      const selectedTemplate = templates.find(t => t.id === templateId);
      
      if (selectedTemplate) {
        // Pre-fill team members from the template
        setFormData(prev => ({
          ...prev,
          teamMemberIds: selectedTemplate.teamMemberIds || []
        }));
      }
    }
  };
  
  const handleCreateClient = async () => {
    if (!newClientName.trim()) {
      toast.error('Client name is required');
      return;
    }
    
    try {
      const newClient = {
        name: newClientName,
        description: '',
        priority: 'None' as const,
        services: [],
        isActive: true
      };
      
      const createdClient = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      }).then(res => res.json());
      
      setClients(prev => [...prev, createdClient]);
      setFormData(prev => ({ ...prev, clientId: createdClient.id }));
      setNewClientName('');
      setIsClientDialogOpen(false);
      toast.success('Client created successfully');
    } catch (error) {
      console.error('Failed to create client:', error);
      toast.error('Failed to create client');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }
    
    if (!formData.clientId) {
      toast.error('Client selection is required');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Create project object from form data
      const projectData = {
        ...formData,
        frequency: formData.frequency as 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Custom' | undefined,
        templateId: selectedTemplateId
      };
      
      if (isEditMode && projectToEdit) {
        // Update existing project
        await updateProject(projectToEdit.id, projectData);
        toast.success('Project updated successfully');
      } else {
        // Create new project
        await createProject(projectData);
        toast.success('Project created successfully');
      }
      
      onClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} project:`, error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} project`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content p-6">
          <div className="text-center py-8">Loading form data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditMode ? 'Edit Project' : 'New Project'}
              </h2>
              <button 
                type="button" 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {!isEditMode && (
              <div className="space-y-2">
                <label htmlFor="templateId" className="block text-sm font-medium text-gray-700">
                  Start from a Template
                </label>
                <select
                  id="templateId"
                  name="templateId"
                  value={selectedTemplateId || ""}
                  onChange={handleTemplateSelection}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Don't use a template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                {selectedTemplateId && (
                  <p className="text-xs text-gray-500">
                    Using a template will pre-populate certain fields and create tasks based on the template.
                  </p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name<span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Type your project name here..."
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Type your project description here..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                  Client<span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    id="clientId"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select an option</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  
                  <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        New Client
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Client</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="newClientName" className="block text-sm font-medium">
                              Client Name<span className="text-red-500">*</span>
                            </label>
                            <Input
                              id="newClientName"
                              value={newClientName}
                              onChange={(e) => setNewClientName(e.target.value)}
                              placeholder="Enter client name"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsClientDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="button" 
                          onClick={handleCreateClient}
                          disabled={!newClientName.trim()}
                        >
                          Create Client
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700">
                  Project Assignee
                </label>
                <select
                  id="assigneeId"
                  name="assigneeId"
                  value={formData.assigneeId}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a Team Member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="teamMemberIds" className="block text-sm font-medium text-gray-700">
                Team Members
              </label>
              <select
                id="teamMemberIds"
                name="teamMemberIds"
                multiple
                value={formData.teamMemberIds}
                onChange={handleTeamMemberSelection}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-32"
              >
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">Press ctrl or ⌘ to select multiple</p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Is this a repeating project?<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`py-2 px-4 border rounded-md transition-colors ${
                    formData.repeating
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700'
                  }`}
                  onClick={() => handleRepeatingChange(true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 border rounded-md transition-colors ${
                    !formData.repeating
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700'
                  }`}
                  onClick={() => handleRepeatingChange(false)}
                >
                  No, this is a one-off
                </button>
              </div>
            </div>
            
            {formData.repeating && (
              <div className="space-y-2">
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                  Frequency<span className="text-red-500">*</span>
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required={formData.repeating}
                >
                  <option value="">Click to set a recurring date</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Schedule starts<span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-left font-normal"
                  >
                    {date ? format(date, 'MM/dd/yyyy') : 'Select date'}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 pointer-events-auto">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-jetpack-blue hover:bg-blue-700 transition-colors"
              disabled={submitting}
            >
              {submitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Project' : 'Create Project')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
