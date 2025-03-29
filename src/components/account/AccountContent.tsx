
import React from 'react';
import { User, Users, CreditCard, Mail, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { mockData } from '@/services/mock';
import { useToast } from '@/hooks/use-toast';

const AccountContent = () => {
  const { toast } = useToast();
  const user = {
    name: "Vyas",
    email: "laveshvyas20@gmail.com",
    planStatus: "Free trial",
    role: "Admin",
    avatar: ""
  };

  const teamMembers = mockData.teamMembers || [];

  const handleEditAccount = () => {
    toast({
      title: "Edit Account",
      description: "Account editing functionality will be implemented soon.",
    });
  };

  const handleUpgradeAccount = () => {
    toast({
      title: "Upgrade Account",
      description: "Upgrade functionality will be implemented soon.",
    });
  };

  const handleInviteMember = () => {
    toast({
      title: "Invite Sent",
      description: "Team member invitation has been sent.",
    });
  };

  const handleManageMembers = () => {
    toast({
      title: "Manage Team Members",
      description: "Team management functionality will be implemented soon.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Account Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Account Details</h2>
                <Button variant="outline" size="sm" onClick={handleEditAccount}>
                  <Edit className="h-4 w-4 mr-2" /> Edit Account
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16 rounded-full bg-primary text-white text-lg uppercase">
                  <div>{user.name.charAt(0)}</div>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{user.name}</h3>
                  <p className="text-gray-500 flex items-center">
                    <Mail className="h-4 w-4 mr-1" /> {user.email}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Plan Status</div>
                    <div className="font-medium">{user.planStatus}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Role</div>
                    <div className="font-medium">{user.role}</div>
                  </div>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Free trial</h4>
                      <p className="text-sm text-gray-600 mt-1">Your free trial expires in 5 days</p>
                    </div>
                    <Button onClick={handleUpgradeAccount}>Upgrade account</Button>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Seats (includes all active team members and pending invitations)</div>
                  <div className="font-medium">1</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Team Members Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold">Pending Invitations</h3>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full justify-start text-blue-600" 
                onClick={handleInviteMember}
              >
                <Users className="h-4 w-4 mr-2" />
                Invite a team member
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold">Team Members</h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {teamMembers.length === 0 ? (
                  <li className="text-gray-500 text-sm">No team members</li>
                ) : (
                  teamMembers.map((member, index) => (
                    <li key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <Avatar className="h-8 w-8 bg-primary text-white">
                        <div>{member.name.charAt(0)}</div>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member.name}</p>
                        <p className="text-sm text-gray-500 truncate">{member.email || "No email"}</p>
                      </div>
                      <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {member.role || "Member"}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleManageMembers}
              >
                Manage team members
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-500 text-center">
        Last edited Mar 20, 2023 at 03:18 PM by Vyas
      </div>
    </div>
  );
};

export default AccountContent;
