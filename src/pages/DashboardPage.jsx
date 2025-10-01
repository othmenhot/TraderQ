import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getInProgressModules, getUserBadges } from '../lib/firestoreService';
import { seedDatabase } from '../lib/seedDatabase';
import { BADGES } from '../lib/badges';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const XP_PER_LEVEL = 100;

// --- Main Component ---

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
      }).catch(error => {
        console.error("Failed to fetch dashboard data:", error);
      }).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const isGuest = user?.isAnonymous;

  const renderMainContent = () => {
    if (isLoading) {
      return <Card className="lg:col-span-2 h-48 flex items-center justify-center"><p>Loading your progress...</p></Card>;
    }
    if (inProgressModules.length > 0) {
      return <ContinueLearning modules={inProgressModules} />;
    }
    return <StartFirstPath />;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back{isGuest ? ", Guest" : ""}!
        </h1>
        <p className="text-muted-foreground">
          Let's continue your journey to becoming a trading master.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderMainContent()}
        <ProfileCard userProfile={userProfile} badges={earnedBadges} />
      </div>
      
      <AdminToolsCard />
    </div>
  );
};

// --- Inner Components ---

const AdminToolsCard = () => {
  const handleSeedClick = () => {
    if (window.confirm('Are you sure you want to seed the database? This will overwrite existing data.')) {
      seedDatabase();
    }
  };

  return (
    <Card className="bg-destructive/10 border-destructive/50">
      <CardHeader>
        <CardTitle>Admin Tools</CardTitle>
        <CardDescription>This is a temporary developer tool. Click to populate Firestore.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={handleSeedClick}>
          Seed Database
        </Button>
      </CardContent>
    </Card>
  );
};

const ProfileCard = ({ userProfile, badges }) => (
  <Card>
    <CardHeader>
      <CardTitle>Your Profile</CardTitle>
      <CardDescription>A summary of your achievements.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {userProfile ? (
        <>
          <div className="flex justify-between font-semibold">
            <span>Level</span>
            <span>{userProfile.level}</span>
          </div>
          <XPProgressBar xp={userProfile.xp} />
        </>
      ) : <p className="text-sm text-muted-foreground">Profile data could not be loaded.</p>}
      <div>
        <h4 className="font-semibold mb-2">Badges</h4>
        <div className="flex flex-wrap gap-2">
          {badges && badges.length > 0 ? (
            badges.map(b => {
              const badgeInfo = BADGES[b.badgeId];
              if (!badgeInfo) return null;
              return <div key={badgeInfo.id} title={badgeInfo.name} className="text-2xl">{badgeInfo.icon}</div>;
            })
          ) : <p className="text-sm text-muted-foreground">No badges earned yet.</p>}
        </div>
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
        <span>Progress to Next Level</span>
        <span>{currentLevelXP} / {XP_PER_LEVEL} XP</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2.5">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }} />
      </div>
    </div>
  );
};

const ContinueLearning = ({ modules = [] }) => (
  <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle>Continue Learning</CardTitle>
      <CardDescription>You have {modules.length} module(s) in progress. Keep it up!</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {modules.map(module => (
        <div key={module.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
          <div>
            <h4 className="font-semibold">{module.title}</h4>
            <p className="text-sm text-muted-foreground">Continue where you left off.</p>
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
      <CardTitle>Start Your First Learning Path</CardTitle>
      <CardDescription>Begin with the fundamentals.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
        <div>
          <Badge variant="secondary">Foundation</Badge>
          <h4 className="font-semibold mt-2">The Foundations of Trading</h4>
        </div>
        <Link to="/roadmap">
          <Button>Start Learning</Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

export default DashboardPage;
