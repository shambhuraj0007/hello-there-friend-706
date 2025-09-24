import { Plus, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom'; // Add this import

export const FloatingActionButton = ({ className }: { className?: string }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/report-issue');
  };

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className={cn(
        "fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "animate-scale-in z-40",
        className
      )}
    >
      <Camera className="h-6 w-6" />
    </Button>
  );
};