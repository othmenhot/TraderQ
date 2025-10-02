import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTradingContext } from '../hooks/useTradingContextProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { Button } from '../components/ui/Button';
import { getInProgressModules, getUserBadges } from '../lib/firestoreService';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Star, TrendingUp, ChevronRight, DollarSign } from 'lucide-react';
import { BADGES } from '../lib/badges';

const XP_PER_LEVEL = 100;

const DashboardPage = () => {
  const { user, userProfile } = useAuth();
  const { totalPnl, balance } = useTradingContext();

  const { data: inProgressModules = [] } = useQuery({
    queryKey: ['inProgressModules', user?.uid],
    queryFn: () => getInProgressModules(user.uid),
    enabled: !!user,
  });

  const { data: userBadges = [] } = useQuery({
    queryKey: ['userBadges', user?.uid],
    queryFn: () => getUserBadges(user.uid),
    enabled: !!user,
  });

  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }
  
  const { xp, level, displayName } = userProfile;
  const xpForCurrentLevel = xp % XP_PER_LEVEL;
  const xpProgressPercentage = (xpForCurrentLevel / XP_PER_LEVEL) * 100;
  const badgeDetails = userBadges.map(b => BADGES.find(badge => badge.id === b.badgeId)).filter(Boolean);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {displayName || 'Trader'}!</h1>
            <p className="text-muted-foreground">Your learning and trading journey continues here.</p>
          </div>
          <div className="flex items-center gap-4">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">
                      ${(balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
              </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Live P&L</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${(totalPnl || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gamification Stats */}
        {/* ... (rest of the component is unchanged) ... */}

      </div>
    </div>
  );
};

export default DashboardPage;
