
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamMemberTasks from './TeamMemberTasks';
import { fetchTeamMembers, getTasks } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import TrialBanner from '../layout/TrialBanner';

const TeamWorkDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overdue' | 'upcoming'>('overdue');
  
  const { data: teamMembers = [], isLoading: teamMembersLoading } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers,
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const isLoading = teamMembersLoading || tasksLoading;

  // Ensure we have arrays
  const teamMembersArray = Array.isArray(teamMembers) ? teamMembers : [];
  const tasksArray = Array.isArray(tasks) ? tasks : [];

  // Create a special "Unassigned" category
  const unassignedMember = {
    id: 'unassigned',
    name: 'Unassigned',
    email: '',
    role: ''
  };

  const getTasksForTeamMember = (teamMemberId: string, status: 'overdue' | 'upcoming') => {
    const today = new Date();
    
    return tasksArray.filter(task => {
      const dueDate = new Date(task.dueDate);
      
      if (teamMemberId === 'unassigned') {
        if (!task.assigneeId) {
          if (status === 'overdue') {
            return dueDate < today;
          } else {
            return dueDate >= today;
          }
        }
        return false;
      } else if (task.assigneeId === teamMemberId) {
        if (status === 'overdue') {
          return dueDate < today;
        } else {
          return dueDate >= today;
        }
      }
      return false;
    });
  };

  return (
    <div className="container mx-auto p-0">
      <TrialBanner />

      <div className="px-6">
        <h1 className="text-2xl font-bold mb-6">Team Work</h1>
        
        <Tabs 
          defaultValue="overdue" 
          onValueChange={(value) => setActiveTab(value as 'overdue' | 'upcoming')}
          className="space-y-4"
        >
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger 
              value="overdue" 
              className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Overdue Work
            </TabsTrigger>
            <TabsTrigger 
              value="upcoming" 
              className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Upcoming Work
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overdue" className="space-y-6 mt-4">
            {/* Show Unassigned tasks first */}
            <TeamMemberTasks 
              teamMember={unassignedMember} 
              tasks={getTasksForTeamMember('unassigned', 'overdue')} 
              isLoading={isLoading} 
            />
            
            {/* Then show tasks for each team member */}
            {teamMembersArray.map(member => (
              <TeamMemberTasks 
                key={member.id} 
                teamMember={member} 
                tasks={getTasksForTeamMember(member.id, 'overdue')} 
                isLoading={isLoading} 
              />
            ))}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-6 mt-4">
            {/* Show Unassigned tasks first */}
            <TeamMemberTasks 
              teamMember={unassignedMember} 
              tasks={getTasksForTeamMember('unassigned', 'upcoming')} 
              isLoading={isLoading} 
            />
            
            {/* Then show tasks for each team member */}
            {teamMembersArray.map(member => (
              <TeamMemberTasks 
                key={member.id} 
                teamMember={member} 
                tasks={getTasksForTeamMember(member.id, 'upcoming')} 
                isLoading={isLoading} 
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamWorkDashboard;
