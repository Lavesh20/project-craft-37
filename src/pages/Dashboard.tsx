import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarClock, BriefcaseBusiness, Folder, 
  Users, BarChart, Lightbulb, TrendingUp 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchClients } from '@/services/apiClient';
import DashboardChart from '@/components/dashboard/DashboardChart';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  // Fetch projects data
  const { 
    data: projects = [], 
    isLoading: projectsLoading,
    error: projectsError
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  // Fetch clients data
  const {
    data: clients = [],
    isLoading: clientsLoading,
    error: clientsError
  } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  // Make sure we provide default arrays for all data
  const projectsData = Array.isArray(projects) ? projects : [];
  const clientsData = Array.isArray(clients) ? clients : [];

  // Show error toast if data fetching fails
  useEffect(() => {
    if (projectsError || clientsError) {
      toast({
        title: "Data loading error",
        description: "Some dashboard data couldn't be loaded. Showing available information.",
        variant: "destructive"
      });
    }
  }, [projectsError, clientsError, toast]);
  
  // Determine overall loading state
  const isLoading = loading || projectsLoading || clientsLoading;
  
  // Calculate dashboard metrics
  const calculateMetrics = () => {
    if (!Array.isArray(projectsData)) return { overdue: 0, dueToday: 0, dueWeek: 0, completed: 0 };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    
    const overdue = projectsData.filter(project => {
      const dueDate = new Date(project.dueDate);
      return dueDate < today && project.status !== 'Completed';
    }).length;
    
    const dueToday = projectsData.filter(project => {
      const dueDate = new Date(project.dueDate);
      return dueDate.toDateString() === today.toDateString();
    }).length;
    
    const dueWeek = projectsData.filter(project => {
      const dueDate = new Date(project.dueDate);
      return dueDate > today && dueDate <= endOfWeek;
    }).length;
    
    const completed = projectsData.filter(project => 
      project.status === 'Completed'
    ).length;
    
    return { overdue, dueToday, dueWeek, completed };
  };
  
  const calculateProjectStatus = () => {
    if (!Array.isArray(projectsData)) return { active: 0, onTrack: 0, atRisk: 0, delayed: 0 };
    
    const active = projectsData.filter(p => p.status !== 'Completed').length;
    const onTrack = projectsData.filter(p => p.status === 'In Progress').length;
    const atRisk = projectsData.filter(p => p.status === 'At Risk').length;
    const delayed = projectsData.filter(p => p.status === 'Delayed').length;
    
    return { active, onTrack, atRisk, delayed };
  };
  
  const calculateClientMetrics = () => {
    if (!Array.isArray(clientsData)) return { total: 0, active: 0, new: 0, attention: 0 };
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const total = clientsData.length;
    const active = total > 0 ? Math.floor(total * 0.75) : 0; // Assuming 75% are active
    const newClients = clientsData.filter(client => {
      return new Date(client.createdAt || Date.now()) > oneMonthAgo;
    }).length;
    const attention = total > 0 ? Math.floor(total * 0.1) : 0; // Assuming 10% need attention
    
    return { total, active, new: newClients, attention };
  };
  
  // Calculate all metrics
  const taskMetrics = calculateMetrics();
  const projectStatus = calculateProjectStatus();
  const clientMetrics = calculateClientMetrics();
  
  // Redirect to login if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth/login" />;
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-64 rounded-lg" />
            </div>
          </div>
        ) : (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
              <p className="text-gray-600">Here's an overview of your workflow</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Tasks Overview */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Tasks Overview</CardTitle>
                    <CalendarClock className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardDescription>Your tasks for this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overdue</span>
                      <span className="font-semibold text-red-500">{taskMetrics.overdue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due today</span>
                      <span className="font-semibold">{taskMetrics.dueToday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due this week</span>
                      <span className="font-semibold">{taskMetrics.dueWeek}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed</span>
                      <span className="font-semibold text-green-500">{taskMetrics.completed}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/my-work">View all tasks</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Projects Status */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Projects Status</CardTitle>
                    <BriefcaseBusiness className="h-5 w-5 text-purple-500" />
                  </div>
                  <CardDescription>Your active projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active projects</span>
                      <span className="font-semibold">{projectStatus.active}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">On track</span>
                      <span className="font-semibold text-green-500">{projectStatus.onTrack}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">At risk</span>
                      <span className="font-semibold text-amber-500">{projectStatus.atRisk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delayed</span>
                      <span className="font-semibold text-red-500">{projectStatus.delayed}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/projects">View all projects</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Client Activity */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Client Activity</CardTitle>
                    <Users className="h-5 w-5 text-indigo-500" />
                  </div>
                  <CardDescription>Recent client updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total clients</span>
                      <span className="font-semibold">{clientMetrics.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active clients</span>
                      <span className="font-semibold">{clientMetrics.active}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New this month</span>
                      <span className="font-semibold text-green-500">{clientMetrics.new}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Requiring attention</span>
                      <span className="font-semibold text-amber-500">{clientMetrics.attention}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/clients">View all clients</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Chart Section */}
            <section className="mb-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Project Activity</CardTitle>
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardDescription>Project completion over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <DashboardChart projects={projectsData} />
                  </div>
                </CardContent>
              </Card>
            </section>
            
            {/* Quick Actions Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-auto py-6 flex flex-col items-center gap-2" asChild>
                  <Link to="/projects/new">
                    <Folder className="h-6 w-6" />
                    <span>New Project</span>
                  </Link>
                </Button>
                <Button className="h-auto py-6 flex flex-col items-center gap-2" variant="outline" asChild>
                  <Link to="/clients/new">
                    <Users className="h-6 w-6" />
                    <span>Add Client</span>
                  </Link>
                </Button>
                <Button className="h-auto py-6 flex flex-col items-center gap-2" variant="outline" asChild>
                  <Link to="/reports">
                    <BarChart className="h-6 w-6" />
                    <span>View Reports</span>
                  </Link>
                </Button>
                <Button className="h-auto py-6 flex flex-col items-center gap-2" variant="outline" asChild>
                  <Link to="/templates/new">
                    <Lightbulb className="h-6 w-6" />
                    <span>Create Template</span>
                  </Link>
                </Button>
              </div>
            </section>
            
            {/* Account Status */}
            <section>
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">
                    Current Plan: <span className="font-semibold">{user?.planStatus}</span>
                  </p>
                  {user?.planStatus === 'Free trial' && user?.trialDays && (
                    <p className="text-amber-600">
                      Your trial ends in {user.trialDays} days. Upgrade now to continue using all features.
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    {user?.planStatus === 'Free trial' ? 'Upgrade Now' : 'Manage Subscription'}
                  </Button>
                </CardFooter>
              </Card>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
