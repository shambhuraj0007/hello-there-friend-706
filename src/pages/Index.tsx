import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { SplashScreen } from '@/components/mobile/SplashScreen';
import { OnboardingScreen } from '@/components/mobile/OnboardingScreen';
import { AuthScreen } from '@/components/mobile/AuthScreen';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { Sidebar } from '@/components/Sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';
import { IssueCard, Issue } from '@/components/mobile/IssueCard';
import { MapView } from '@/components/mobile/MapView';
import { SearchAndFilter, FilterOptions } from '@/components/mobile/SearchAndFilter';
import { IssueDetailsModal } from '@/components/mobile/IssueDetailsModal';
import { NotificationCenter } from '@/components/mobile/NotificationCenter';
import { ReportIssueWizard } from '@/components/mobile/ReportIssueWizard';
import { OfflineIndicator } from '@/components/mobile/OfflineIndicator';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { MapPin, Camera, Users, Award, Search, Filter } from "lucide-react";
import { useCapacitor } from '@/hooks/useCapacitor';
import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues and potential vehicle damage',
    category: 'Roads',
    status: 'pending',
    location: 'Main Street, Downtown',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Broken Street Light',
    description: 'Street light not working, creating safety concerns for pedestrians',
    category: 'Lighting',
    status: 'resolved',
    location: 'Park Avenue, Block 5',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
    createdAt: '2024-01-10',
    credits: 5,
  },
  {
    id: '3',
    title: 'Garbage Overflow',
    description: 'Overflowing garbage bin attracting pests and creating unhygienic conditions',
    category: 'Sanitation',
    status: 'in_progress',
    location: 'Market Square',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    createdAt: '2024-01-12',
  },
];

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showMapView, setShowMapView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({ categories: [], statuses: [] });
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showReportWizard, setShowReportWizard] = useState(false);
  const { isNative, takePicture, getCurrentPosition, hapticFeedback } = useCapacitor();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Check if user has seen onboarding
  useEffect(() => {
    // Show splash screen first
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    } else {
      setIsAuthenticated(true); // Mock authentication for demo
    }
    }, 2000);

    return () => clearTimeout(splashTimer);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
    setIsAuthenticated(true); // Mock authentication
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleReportIssue = async () => {
    await hapticFeedback();
    setShowReportWizard(true);
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleCompleteReportWizard = () => {
    setShowReportWizard(false);

    // Navigate to homepage (if not already there)
    if (activeTab !== 'home') {
      setActiveTab('home');
    }

    // Show success toast
    toast({
      title: 'Report Submitted',
      description: 'Your civic issue has been successfully submitted.',
      duration: 2000,
    });
  };

  const handleCancelReportWizard = () => {
    setShowReportWizard(false);
  };

  // Filter issues based on search and filters
  const filteredIssues = mockIssues.filter(issue => {
    const matchesSearch = searchQuery === '' || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeFilters.categories.length === 0 ||
      activeFilters.categories.includes(issue.category);

    const matchesStatus = activeFilters.statuses.length === 0 ||
      activeFilters.statuses.includes(issue.status);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleRefresh = async () => {
    // Simulate API call to refresh data
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app, this would fetch fresh data from the API
    console.log('Refreshing data...');
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const renderHomeTab = () => (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="pb-20">
        <MobileHeader 
          title={t('appTitle')}
          showMenu={true}
          onMenu={() => {}}
        />
        
        {/* Search and Filter */}
        <div className="px-4 py-2">
          <SearchAndFilter
            onSearch={setSearchQuery}
            onFilter={setActiveFilters}
            searchQuery={searchQuery}
            activeFilters={activeFilters}
          />
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/5 p-6 m-4 rounded-xl">
          <h2 className="text-xl font-bold text-foreground mb-2">
            {t('makeVoiceHeard')}
          </h2>
          <p className="text-muted-foreground mb-4">
            {t('reportDescription')}
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">1000+</div>
              <div className="text-xs text-muted-foreground">{t('reported')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">750+</div>
              <div className="text-xs text-muted-foreground">{t('resolved')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">₹50K+</div>
              <div className="text-xs text-muted-foreground">{t('earned')}</div>
            </div>
          </div>
        </div>

        {/* Map/List Toggle */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {showMapView ? t('issueMap') : t('recentIssues')}
            </h3>
            <Button variant="ghost" size="sm">
              {filteredIssues.length} {t('issues')}
            </Button>
          </div>
          
          {showMapView ? (
            <MapView
              issues={filteredIssues}
              onIssueSelect={handleIssueClick}
              showList={!showMapView}
              onToggleView={() => setShowMapView(!showMapView)}
            />
          ) : (
            <div className="space-y-3">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t('noIssuesFound')}</p>
                </div>
              ) : (
                filteredIssues.map((issue) => (
                  <IssueCard 
                    key={issue.id} 
                    issue={issue} 
                    onClick={handleIssueClick}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </PullToRefresh>
  );

  const renderReportsTab = () => (
    <div className="pb-20">
      <MobileHeader title={t('myReports')} />
      <div className="px-4 py-6">
        <div className="space-y-3">
          {filteredIssues.filter(issue => ['pending', 'resolved'].includes(issue.status)).map((issue) => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              onClick={handleIssueClick}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="pb-20">
      <MobileHeader title={t('notifications')} />
      <div className="px-4 py-6">
        <NotificationCenter 
          onNotificationClick={(notification) => {
            if (notification.issueId) {
              const issue = mockIssues.find(i => i.id === notification.issueId);
              if (issue) {
                setSelectedIssue(issue);
              }
            }
          }}
        />
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="pb-20">
      <MobileHeader title={t('profile')} />
      <div className="px-4 py-6 space-y-6">
        {/* Credits Wallet */}
        <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">{t('creditsWallet')}</h3>
          <div className="text-3xl font-bold mb-1">125</div>
          <p className="text-primary-foreground/80">{t('availableCredits')}</p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button className="w-full justify-start" variant="outline">
            <Award className="mr-3 h-5 w-5" />
            {t('redeemCredits')}
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Users className="mr-3 h-5 w-5" />
            {t('inviteFriends')}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeTab();
      case 'reports':
        return renderReportsTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'profile':
        return renderProfileTab();
      default:
        return renderHomeTab();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <OfflineIndicator />
      
      {/* Sidebar overlay for menu */}
      <div className="fixed top-4 left-4 z-50">
        <Sidebar />
      </div>
      
      {renderActiveTab()}
      
      <FloatingActionButton onClick={handleReportIssue} />
      
      <MobileNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Modals */}
      {selectedIssue && (
        <IssueDetailsModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onSupport={(issueId) => console.log('Support issue:', issueId)}
          onComment={(issueId, comment) => console.log('Comment:', issueId, comment)}
        />
      )}

      {showReportWizard && (
        <ReportIssueWizard
          onComplete={handleCompleteReportWizard}
          onCancel={handleCancelReportWizard}
        />
      )}
    </div>
  );
};

export default Index;