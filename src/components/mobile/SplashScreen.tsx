import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Start fade-in animation
    const fadeTimer = setTimeout(() => setFadeIn(true), 100);
    
    // Auto-navigate after 2 seconds
    const navigationTimer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navigationTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center">
      <div className={cn(
        "text-center transition-all duration-1000 transform",
        fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-4xl font-bold text-white">स</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">समाधान</h1>
          <p className="text-white/80 text-lg">Your Voice, Your City</p>
        </div>
        
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white"></div>
        </div>
      </div>
    </div>
  );
};