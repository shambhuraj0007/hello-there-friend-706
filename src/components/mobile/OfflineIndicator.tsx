import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      // Hide the "back online" indicator after 3 seconds
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show indicator initially if offline
    if (!navigator.onLine) {
      setShowIndicator(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showIndicator) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-fade-in">
      <Card className={cn(
        "p-3 flex items-center gap-3 shadow-lg",
        isOnline 
          ? "bg-success text-success-foreground" 
          : "bg-warning text-warning-foreground"
      )}>
        {isOnline ? (
          <Wifi className="h-5 w-5" />
        ) : (
          <WifiOff className="h-5 w-5" />
        )}
        
        <div className="flex-1">
          <p className="font-medium text-sm">
            {isOnline ? 'Back Online' : 'No Internet Connection'}
          </p>
          <p className="text-xs opacity-90">
            {isOnline 
              ? 'Your reports will now sync automatically' 
              : 'Your reports will be saved and synced when connection is restored'
            }
          </p>
        </div>
      </Card>
    </div>
  );
};