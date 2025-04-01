
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, BriefcaseBusiness, Folder, Users, BarChart, Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { user, loading } = useAuth();
  
  // Redirect to login if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth/login" />;
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        {loading ? (
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
                      <span className="font-semibold text-red-500">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due today</span>
                      <span className="font-semibold">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due this week</span>
                      <span className="font-semibold">7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed</span>
                      <span className="font-semibold text-green-500">12</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View all tasks
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
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">On track</span>
                      <span className="font-semibold text-green-500">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">At risk</span>
                      <span className="font-semibold text-amber-500">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delayed</span>
                      <span className="font-semibold text-red-500">1</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View all projects
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
                      <span className="font-semibold">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active clients</span>
                      <span className="font-semibold">18</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New this month</span>
                      <span className="font-semibold text-green-500">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Requiring attention</span>
                      <span className="font-semibold text-amber-500">2</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View all clients
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Quick Actions Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-auto py-6 flex flex-col items-center gap-2">
                  <Folder className="h-6 w-6" />
                  <span>New Project</span>
                </Button>
                <Button className="h-auto py-6 flex flex-col items-center gap-2" variant="outline">
                  <Users className="h-6 w-6" />
                  <span>Add Client</span>
                </Button>
                <Button className="h-auto py-6 flex flex-col items-center gap-2" variant="outline">
                  <BarChart className="h-6 w-6" />
                  <span>View Reports</span>
                </Button>
                <Button className="h-auto py-6 flex flex-col items-center gap-2" variant="outline">
                  <Lightbulb className="h-6 w-6" />
                  <span>Create Template</span>
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
                  <Button className="bg-jetpack-blue hover:bg-blue-700">
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
