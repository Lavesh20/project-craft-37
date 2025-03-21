
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Comment, TeamMember } from '@/types';
import { fetchComments, createComment, fetchTeamMembers } from '@/services/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';

interface CommentsSectionProps {
  projectId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ projectId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch team members for user info
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers
  });

  // Load comments
  useEffect(() => {
    loadComments();
  }, [projectId]);

  const loadComments = async () => {
    try {
      const data = await fetchComments(projectId);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  // Handle new comment submission
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setSubmitting(true);
      await createComment(projectId, newComment);
      setNewComment('');
      loadComments(); // Refresh comments
    } catch (error) {
      console.error('Failed to create comment:', error);
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
              Comment
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
