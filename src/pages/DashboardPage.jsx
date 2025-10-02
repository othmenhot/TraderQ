import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getInProgressModules, getUserBadges } from '../lib/firestoreService';
import { BADGES } from '../lib/badges';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Star, Award, BarChart, CheckSquare, Wallet, TrendingUp } from 'lucide-react';

const XP_PER_LEVEL = 100;

// --- Inner Components ---

const StatCard = ({ icon: Icon, title, value, isCurrency = false }) => (
  <Card>
    <CardContent className="p-6 flex items-center space-x-4">
      <div className="bg-primary/10 text-primary p-3 rounded-lg">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{isCurrency ? `$${(value || 0).toLocaleString()}` : value}</p>
      </div>
    </CardContent>
  </Card>
);

const XPProgressBar = ({ xp = 0 }) => {
  const currentLevelXP = xp % XP_PER_LEVEL;
  const progressPercentage = (currentLevelXP / XP_PER_LEVEL) * 100;
  return (
    <div>
      <div className="flex justify-between text-sm text-muted-foreground mb-1">
        <span>Level Progress</span>
        <span>{currentLevelXP} / {XP_PER_LEVEL} XP</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2.5">
        <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
      </div>
    </div>
  );
};

const ProfileCard = ({ userProfile, badges }) => (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userProfile ? (
          <>
            <div className="text-center">
              <p className="text-4xl font-bold">{userProfile.level}</p>
              <p className="text-sm text-muted-foreground">Current Level</p>
            </div>
            <XPProgressBar xp={userProfile.xp} />
          </>
        ) : <p className="text-sm text-muted-foreground">Profile data not loaded.</p>}
        <div>
          <h4 className="font-semibold mb-2 mt-4">Badges</h4>
          <div className="flex flex-wrap gap-2">
            {badges && badges.length > 0 ? (
              badges.map(b => {
                const badgeInfo = BADGES[b.badgeId];
                if (!badgeInfo) return null;
                return <div key={badgeInfo.id} title={badgeInfo.name} className="text-3xl">{badgeInfo.icon}</div>;
              })
            ) : <p className="text-sm text-muted-foreground">No badges earned yet.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
const ContinueLearning = ({ modules = [] }) => (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Continue Your Quest</CardTitle>
        <CardDescription>You have {modules.length} module(s) in progress. Keep up the momentum!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.map(module => (
          <div key={module.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-all">
            <div>
              <h4 className="font-semibold">{module.title}</h4>
              <p className="text-sm text-muted-foreground">Return to your last lesson.</p>
            </div>
            <Link to={`/learn/${module.pathId}/${module.id}`}>
              <Button>Continue</Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
);

const StartFirstPath = () => (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Begin Your Journey</CardTitle>
        <CardDescription>Your adventure into the world of trading starts here. Choose your first path.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-all">
          <div>
            <h4 className="font-semibold mt-2">The Foundations of Trading</h4>
            <p className="text-sm text-muted-foreground">Learn the absolute basics to build a strong foundation.</p>
          </div>
          <Link to="/roadmap">
            <Button>Start Learning</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
);

const DashboardPage = () => {
  const { user, userProfile } = useAuth();
  const [inProgressModules, setInProgressModules] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([
        getInProgressModules(user.uid),
        getUserBadges(user.uid)
      ]).then(([modules, badges]) => {
        setInProgressModules(modules);
        setEarnedBadges(badges);
      }).catch(console.error).finally(() => setIsLoading(false));
    }
  }, [user]);

  const renderMainContent = () => {
    if (isLoading) {
      return <Card className="lg:col-span-2 h-64 flex items-center justify-center"><p>Loading your progress...</p></Card>;
    }
    if (inProgressModules.length > 0) {
      return <ContinueLearning modules={inProgressModules} />;
    }
    return <StartFirstPath />;
  };

  const simulation = userProfile?.simulation || { balance: 0, openPnl: 0 };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userProfile?.displayName || 'Trader'}!</h1>
          <p className="text-muted-foreground">Here's a snapshot of your journey so far.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={Star} title="Total XP" value={userProfile?.xp ?? 0} />
          <StatCard icon={BarChart} title="Current Level" value={userProfile?.level ?? 1} />
          <StatCard icon={Award} title="Badges Earned" value={earnedBadges.length} />
          <StatCard icon={Wallet} title="Wallet Balance" value={simulation.balance} isCurrency />
          <StatCard icon={TrendingUp} title="Open P&L" value={simulation.openPnl} isCurrency />
          <StatCard icon={CheckSquare} title="Modules Completed" value={userProfile?.completedModules?.length ?? 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderMainContent()}
          <ProfileCard userProfile={userProfile} badges={earnedBadges} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
