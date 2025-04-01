
import React, { useState, useEffect } from 'react';
import { User, Users, CreditCard, Mail, Edit, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { mockData } from '@/services/mock';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TeamMemberInvite } from '@/types/account';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const AccountContent = () => {
  const { toast } = useToast();
  const { user, loading, updateProfile, logout } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Member' | 'Viewer'>('Member');
  const [pendingInvites, setPendingInvites] = useState<TeamMemberInvite[]>([]);
  
  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      });
    }
  }, [user]);
  
  const teamMembers = mockData.teamMembers || [];

  // Redirect to login if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth/login" />;
  }

  const handleEditAccount = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      });
    }
    setEditDialogOpen(true);
  };

  const handleSaveAccount = async () => {
    try {
      const success = await updateProfile(formData.name, formData.email);
      if (success) {
        setEditDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account details",
        variant: "destructive"
      });
    }
  };

  const handleUpgradeAccount = () => {
    toast({
      title: "Upgrade Account",
      description: "Payment processing will be implemented when backend is available.",
    });
  };

  const handleInviteMember = () => {
    setInviteDialogOpen(true);
  };

  const handleSendInvite = async () => {
    try {
      // Email validation
      if (!inviteEmail || !inviteEmail.includes('@')) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive"
        });
        return;
      }
      
      // This will be implemented when backend is available
      // await axios.post('/api/team/invite', { email: inviteEmail, role: inviteRole });
      
      // For now, update the local state
      const newInvite: TeamMemberInvite = {
        id: `invite-${Date.now()}`,
        email: inviteEmail,
        role: inviteRole,
        invitedAt: new Date()
      };
      
      setPendingInvites(prev => [...prev, newInvite]);
      
      toast({
        title: "Invite Sent",
        description: `Team member invitation has been sent to ${inviteEmail}.`,
      });
      
      setInviteEmail('');
      setInviteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive"
      });
    }
  };

  const handleCancelInvite = (inviteId: string) => {
    try {
      setPendingInvites(prev => prev.filter(invite => invite.id !== inviteId));
      
      toast({
        title: "Invite Cancelled",
        description: "The invitation has been cancelled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive"
      });
    }
  };

  const handleManageMembers = () => {
    toast({
      title: "Manage Team Members",
      description: "Team management functionality will be implemented when backend is available.",
    });
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account</h1>
        <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
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
                  <div>{user?.name.charAt(0)}</div>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{user?.name}</h3>
                  <p className="text-gray-500 flex items-center">
                    <Mail className="h-4 w-4 mr-1" /> {user?.email}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Plan Status</div>
                    <div className="font-medium">{user?.planStatus}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Role</div>
                    <div className="font-medium">{user?.role}</div>
                  </div>
                </div>
                
                {user?.planStatus === "Free trial" && user?.trialDays && (
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Free trial</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Your free trial expires in {user.trialDays} days
                        </p>
                      </div>
                      <Button onClick={handleUpgradeAccount}>Upgrade account</Button>
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Seats (includes all active team members and pending invitations)</div>
                  <div className="font-medium">{teamMembers.length + pendingInvites.length}</div>
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
              {pendingInvites.length > 0 ? (
                <ul className="space-y-3 mb-4">
                  {pendingInvites.map((invite) => (
                    <li key={invite.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium text-sm">{invite.email}</p>
                        <p className="text-xs text-gray-500">Role: {invite.role}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCancelInvite(invite.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Cancel
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mb-3">No pending invitations</p>
              )}
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
        Last edited {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()} by {user?.name}
      </div>

      {/* Edit Account Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAccount}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Team Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input 
                id="invite-email" 
                type="email" 
                placeholder="colleague@example.com"
                value={inviteEmail} 
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <select
                id="invite-role"
                className="w-full p-2 border rounded-md"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'Admin' | 'Member' | 'Viewer')}
              >
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
                <option value="Viewer">Viewer</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {inviteRole === 'Admin' && 'Can manage all settings and invite users'}
                {inviteRole === 'Member' && 'Can view and edit projects but not manage account settings'}
                {inviteRole === 'Viewer' && 'Can only view projects'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendInvite}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountContent;
