
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamMemberTasks from './TeamMemberTasks';
import { TeamMember, Task } from '@/types';
import TrialBanner from '../layout/TrialBanner';
import { toast } from 'sonner';

const TeamWorkDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overdue' | 'upcoming'>('overdue');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Create an AbortController to cancel requests when component unmounts
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('auth_token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        };
        
        // Fetch team members
        const teamMembersResponse = await axios.get('/api/team-members', {
          headers,
          signal: controller.signal
        });
        
        // Fetch tasks
        const tasksResponse = await axios.get('/api/tasks', {
          headers,
          signal: controller.signal
        });
        
        setTeamMembers(teamMembersResponse.data || []);
        setTasks(tasksResponse.data || []);
        setError(null);
      } catch (err) {
        // Only set error if the request wasn't aborted
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message);
        } else {
          console.error('Error fetching data:', err);
          setError('Failed to load data');
          toast.error('Failed to load team work data');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup function to abort any in-flight requests when component unmounts
    return () => {
      controller.abort();
    };
  }, []);

  // Create a special "Unassigned" category
  const unassignedMember = {
    id: 'unassigned',
    name: 'Unassigned',
    email: '',
    role: ''
  };

  const getTasksForTeamMember = (teamMemberId: string, status: 'overdue' | 'upcoming') => {
    const today = new Date();
    
    return tasks.filter(task => {
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
        
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        ) : (
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
              {teamMembers.map(member => (
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
              {teamMembers.map(member => (
                <TeamMemberTasks 
                  key={member.id} 
                  teamMember={member} 
                  tasks={getTasksForTeamMember(member.id, 'upcoming')} 
                  isLoading={isLoading} 
                />
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default TeamWorkDashboard;
