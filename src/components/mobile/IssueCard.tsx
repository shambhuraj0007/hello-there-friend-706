import { MapPin, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  location: string;
  image?: string;
  createdAt: string;
  credits?: number;
}

interface IssueCardProps {
  issue: Issue;
  onClick?: (issue: Issue) => void;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'bg-warning text-warning-foreground',
    label: 'Pending'
  },
  in_progress: {
    icon: AlertCircle,
    color: 'bg-primary text-primary-foreground',
    label: 'In Progress'
  },
  resolved: {
    icon: CheckCircle,
    color: 'bg-success text-success-foreground',
    label: 'Resolved'
  },
  rejected: {
    icon: XCircle,
    color: 'bg-destructive text-destructive-foreground',
    label: 'Rejected'
  }
};

export const IssueCard = ({ issue, onClick }: IssueCardProps) => {
  const statusInfo = statusConfig[issue.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card 
      className="p-4 mb-3 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onClick?.(issue)}
    >
      <div className="flex gap-3">
        {issue.image && (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <img 
              src={issue.image} 
              alt={issue.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-foreground truncate">
              {issue.title}
            </h3>
            <Badge className={cn("flex-shrink-0 text-xs", statusInfo.color)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {issue.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{issue.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {issue.status === 'resolved' && issue.credits && (
                <span className="text-success font-medium">
                  +{issue.credits} credits
                </span>
              )}
              <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};