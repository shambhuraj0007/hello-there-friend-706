import { X, MapPin, Calendar, User, MessageCircle, ThumbsUp, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Issue } from './IssueCard';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface IssueDetailsModalProps {
  issue: Issue;
  onClose: () => void;
  onSupport?: (issueId: string) => void;
  onComment?: (issueId: string, comment: string) => void;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isOfficial?: boolean;
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Municipal Officer',
    content: 'Thank you for reporting this issue. Our team has been notified and will address it within 48 hours.',
    timestamp: '2024-01-16T10:30:00Z',
    isOfficial: true,
  },
  {
    id: '2',
    author: 'Rajesh Kumar',
    content: 'I also noticed this issue yesterday. It\'s causing traffic problems during peak hours.',
    timestamp: '2024-01-16T08:15:00Z',
  },
];

export const IssueDetailsModal = ({ 
  issue, 
  onClose, 
  onSupport, 
  onComment 
}: IssueDetailsModalProps) => {
  const [newComment, setNewComment] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(12);

  const statusConfig = {
    pending: { color: 'bg-warning text-warning-foreground', label: 'Pending' },
    in_progress: { color: 'bg-primary text-primary-foreground', label: 'In Progress' },
    resolved: { color: 'bg-success text-success-foreground', label: 'Resolved' },
    rejected: { color: 'bg-destructive text-destructive-foreground', label: 'Rejected' }
  };

  const handleSupport = () => {
    setIsSupported(!isSupported);
    setSupportCount(prev => isSupported ? prev - 1 : prev + 1);
    onSupport?.(issue.id);
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onComment?.(issue.id, newComment);
      setNewComment('');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: issue.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-background rounded-t-xl sm:rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Issue Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-4 space-y-4">
            {/* Issue Image */}
            {issue.image && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Issue Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold text-foreground">
                  {issue.title}
                </h3>
                <Badge className={cn("flex-shrink-0", statusConfig[issue.status].color)}>
                  {statusConfig[issue.status].label}
                </Badge>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* Issue Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{issue.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Category: {issue.category}</span>
              </div>

              {issue.status === 'resolved' && issue.credits && (
                <div className="flex items-center gap-2 text-success">
                  <span className="font-medium">+{issue.credits} credits earned</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant={isSupported ? "default" : "outline"}
                onClick={handleSupport}
                className="flex-1"
              >
                <ThumbsUp className={cn("h-4 w-4 mr-2", isSupported && "fill-current")} />
                Support ({supportCount})
              </Button>
              
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Comments ({mockComments.length})
              </h4>

              {/* Comment Input */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  Post Comment
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {mockComments.map((comment) => (
                  <Card key={comment.id} className="p-3">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {comment.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.author}</span>
                          {comment.isOfficial && (
                            <Badge variant="secondary" className="text-xs">Official</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};