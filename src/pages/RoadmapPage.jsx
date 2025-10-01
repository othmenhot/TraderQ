import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROADMAP_DATA } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

// Lock Icon component
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
  </svg>
);

// --- Inner Components for the Roadmap ---

const ModuleCard = ({ module, userXp, pathId }) => {
  const isLocked = userXp < module.xpRequired;
  
  return (
    <div className="relative pl-10">
      {/* The connecting line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
      {/* The dot on the line */}
      <div className={cn(
        "absolute left-4 top-4 h-3 w-3 rounded-full -translate-x-1/2",
        isLocked ? "bg-muted" : "bg-primary"
      )}></div>
      
      <Card className={cn("mb-8", isLocked && "bg-muted/50 opacity-70")}>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{module.title}</h3>
            <p className="text-sm text-muted-foreground">{module.description}</p>
          </div>
          <Link to={isLocked ? '#' : `/learn/${pathId}/${module.id}`}>
            <Button disabled={isLocked}>
              {isLocked ? <LockIcon /> : null}
              {isLocked ? `${module.xpRequired} XP` : 'Start'}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

const SpecializationCard = ({ path }) => (
  <Card>
    <CardHeader>
      <CardTitle>{path.name}</CardTitle>
      <CardDescription>{path.description}</CardDescription>
    </CardHeader>
    <CardContent>
      {/* In the future, this button would link to the path's own roadmap */}
      <Button variant="secondary" className="w-full" disabled>Coming Soon</Button>
    </CardContent>
  </Card>
);

// --- Main Roadmap Page ---

const RoadmapPage = () => {
  const { userProfile } = useAuth();
  const userXp = userProfile?.xp ?? 0;

  const fundamentalPath = ROADMAP_DATA['trader-path'];
  const specializationPaths = Object.values(ROADMAP_DATA).filter(p => p.type === 'specialization');

  // Check if the user has enough XP to unlock specializations
  const totalFundamentalXp = 600; // 0+100+200+300+400+500
  const specializationsUnlocked = userXp >= totalFundamentalXp;

  return (
    <div className="space-y-12">
      {/* Section 1: Fundamental Path */}
      <section>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">{fundamentalPath.name}</h1>
          <p className="text-lg text-muted-foreground">{fundamentalPath.description}</p>
        </div>
        
        {fundamentalPath.categories.map(category => (
          <div key={category.name} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 ml-10">{category.name}</h2>
            {category.modules.map(module => (
              <ModuleCard key={module.id} module={module} userXp={userXp} pathId={fundamentalPath.id} />
            ))}
          </div>
        ))}
      </section>

      {/* Section 2: Specializations */}
      <section className="relative text-center p-8 border-t">
        <h2 className="text-3xl font-bold">Choose Your Career Path</h2>
        <p className="text-muted-foreground mb-8">
          {specializationsUnlocked ? "You've mastered the basics. Now, choose your specialization." : `Complete the Trader's Path (${userXp}/${totalFundamentalXp} XP) to unlock these careers.`}
        </p>
        
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity",
          !specializationsUnlocked && "opacity-40"
        )}>
          {specializationPaths.map(path => (
            <SpecializationCard key={path.id} path={path} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default RoadmapPage;
