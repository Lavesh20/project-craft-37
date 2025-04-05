
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Comment, TeamMember } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CommentsSectionProps {
  projectId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ projectId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load comments and team members
  useEffect(() => {
    // Create an AbortController to cancel requests when component unmounts
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        };
        
        // Fetch comments for this project
        const commentsResponse = await axios.get(`/api/projects/${projectId}/comments`, {
          headers,
          signal: controller.signal
        });
        
        // Fetch team members for user info
        const teamMembersResponse = await axios.get('/api/team-members', {
          headers,
          signal: controller.signal
        });
        
        setComments(commentsResponse.data || []);
        setTeamMembers(teamMembersResponse.data || []);
        setError(null);
      } catch (err) {
        // Only set error if the request wasn't aborted
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message);
        } else {
          console.error('Error fetching data:', err);
          setError('Failed to load comments');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup function to abort any in-flight requests when component unmounts
    return () => {
      controller.abort();
    };
  }, [projectId]);

  // Handle new comment submission
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setSubmitting(true);
      const token = localStorage.getItem('auth_token');
      
      // Create new comment
      await axios.post(`/api/projects/${projectId}/comments`, 
        { content: newComment, projectId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        }
      );
      
      setNewComment('');
      
      // Refresh comments
      const response = await axios.get(`/api/projects/${projectId}/comments`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      setComments(response.data || []);
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Failed to create comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to get team member by ID
  const getTeamMemberById = (memberId: string): TeamMember | undefined => {
    return teamMembers.find(member => member.id === memberId);
  };

  // Helper to get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get current user (for now, hardcoded to user-1)
  const currentUser = getTeamMemberById('user-1');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading comments...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">{error}</div>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline" 
            className="mx-auto block mt-2"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 mb-6">
          <Avatar className="h-8 w-8">
            {currentUser && (
              <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[100px]"
            />
            <Button 
              onClick={handleSubmitComment} 
              disabled={!newComment.trim() || submitting}
              className="bg-jetpack-blue hover:bg-blue-700"
            >
              {submitting ? 'Posting...' : 'Comment'}
            </Button>
          </div>
        </div>

        {comments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => {
              const author = getTeamMemberById(comment.authorId);
              return (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    {author && (
                      <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">
                        {author ? author.name : 'Unknown User'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <div className="mt-1 text-gray-700">
                      {comment.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentsSection;
