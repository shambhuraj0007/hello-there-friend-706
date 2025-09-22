import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Trophy, 
  Droplets, 
  Home as HomeIcon, 
  FileText, 
  Phone, 
  Languages,
  Menu,
  Award,
  CreditCard,
  PhoneCall
} from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { EmergencyModal } from '@/components/EmergencyModal';
import { AnonymousReportModal } from '@/components/AnonymousReportModal';

interface SidebarProps {
  onNavigate?: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const [showEmergency, setShowEmergency] = useState(false);
  const [showAnonymousReport, setShowAnonymousReport] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    window.location.href = path;
  };

  const sidebarItems = [
    {
      id: 'leaderboard',
      label: t('leaderboard'),
      icon: Trophy,
      onClick: () => handleNavigation('/leaderboard'),
    },
    {
      id: 'water-bills',
      label: t('payWaterBills'),
      icon: Droplets,
      onClick: () => handleNavigation('/pay-water-bills'),
    },
    {
      id: 'home-bills',
      label: t('payHomeBills'),
      icon: HomeIcon,
      onClick: () => handleNavigation('/pay-home-bills'),
    },
    {
      id: 'anonymous-report',
      label: t('anonymousReport'),
      icon: FileText,
      onClick: () => setShowAnonymousReport(true),
    },
    {
      id: 'emergency',
      label: t('emergency'),
      icon: Phone,
      onClick: () => setShowEmergency(true),
      className: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    },
  ];

  const languageOptions = [
    { code: 'en' as Language, label: 'English', flag: '🇺🇸' },
    { code: 'hi' as Language, label: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr' as Language, label: 'मराठी', flag: '🇮🇳' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">
          {t('appTitle')}
        </h2>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${item.className || ''}`}
              onClick={item.onClick}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </div>

      {/* Language Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-sidebar-foreground mb-2 flex items-center">
            <Languages className="mr-2 h-4 w-4" />
            {t('changeLanguage')}
          </h3>
          <div className="space-y-1">
            {languageOptions.map((option) => (
              <Button
                key={option.code}
                variant={language === option.code ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start text-xs ${
                  language === option.code 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
                onClick={() => handleLanguageChange(option.code)}
              >
                <span className="mr-2">{option.flag}</span>
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-sidebar">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Emergency Modal */}
      {showEmergency && (
        <EmergencyModal 
          onClose={() => setShowEmergency(false)} 
        />
      )}

      {/* Anonymous Report Modal */}
      {showAnonymousReport && (
        <AnonymousReportModal 
          onClose={() => setShowAnonymousReport(false)} 
        />
      )}
    </>
  );
};