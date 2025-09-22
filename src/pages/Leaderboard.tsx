import React from 'react';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, Medal, Award, Star, TrendingUp } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  issuesReported: number;
  issuesResolved: number;
  rank: number;
  badge: string;
}

const mockLeaderboardData: LeaderboardUser[] = [
  {
    id: '1',
    name: 'राज पटेल',
    points: 850,
    issuesReported: 45,
    issuesResolved: 38,
    rank: 1,
    badge: 'Champion'
  },
  {
    id: '2', 
    name: 'प्रिया शर्मा',
    points: 720,
    issuesReported: 38,
    issuesResolved: 32,
    rank: 2,
    badge: 'Hero'
  },
  {
    id: '3',
    name: 'अमित कुमार',
    points: 650,
    issuesReported: 35,
    issuesResolved: 28,
    rank: 3,
    badge: 'Defender'
  },
  {
    id: '4',
    name: 'सुनीता देवी',
    points: 580,
    issuesReported: 30,
    issuesResolved: 25,
    rank: 4,
    badge: 'Guardian'
  },
  {
    id: '5',
    name: 'विकास जैन',
    points: 520,
    issuesReported: 28,
    issuesResolved: 22,
    rank: 5,
    badge: 'Advocate'
  }
];

export const Leaderboard = () => {
  const { t } = useLanguage();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getBadgeColor = (rank: number) => {
    if (rank <= 3) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    if (rank <= 10) return 'bg-gradient-to-r from-blue-400 to-purple-500';
    return 'bg-gradient-to-r from-gray-400 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader 
        title={t('leaderboard')}
        showBack={true}
      />
      
      {/* Top Section */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/5 p-6 m-4 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            {t('topCitizens')}
          </h2>
          <div className="flex items-center text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 mr-1" />
            {t('thisMonth')}
          </div>
        </div>
        
        {/* Your Rank Card */}
        <Card className="bg-white/50 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>YU</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{t('yourRank')}</h3>
                  <p className="text-sm text-muted-foreground">245 {t('points')}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">#12</div>
                <Badge variant="secondary" className="text-xs">
                  {t('citizen')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard List */}
      <div className="px-4 space-y-3">
        <h3 className="text-lg font-semibold mb-4">{t('topPerformers')}</h3>
        
        {mockLeaderboardData.map((user) => (
          <Card key={user.id} className="border-l-4 border-l-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-center">
                    {getRankIcon(user.rank)}
                    <span className="text-xs font-bold mt-1">#{user.rank}</span>
                  </div>
                  
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{user.name}</h4>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{user.issuesReported} {t('reported')}</span>
                      <span>{user.issuesResolved} {t('resolved')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">{user.points}</div>
                  <Badge 
                    className={`text-xs text-white ${getBadgeColor(user.rank)}`}
                  >
                    {user.badge}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Tips */}
      <div className="px-4 mt-6">
        <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-primary" />
              {t('earnPoints')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>{t('reportIssue')}</span>
              <span className="font-semibold text-primary">+10 {t('points')}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('verifyReport')}</span>
              <span className="font-semibold text-primary">+5 {t('points')}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('issueResolved')}</span>
              <span className="font-semibold text-primary">+20 {t('points')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};