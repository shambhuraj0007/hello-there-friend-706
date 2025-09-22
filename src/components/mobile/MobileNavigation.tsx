import { Home, FileText, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'reports', label: t('myReports'), icon: FileText },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'profile', label: t('profile'), icon: User },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-1", isActive && "fill-primary/20")} />
              <span className="text-xs font-medium">{tab.label}</span>
              {tab.id === 'notifications' && (
                <div className="absolute top-1 right-1/4 w-2 h-2 bg-destructive rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};