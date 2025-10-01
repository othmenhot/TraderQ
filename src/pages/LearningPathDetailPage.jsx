import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLearningPathById, getModulesForPath, getUserProgressForPath, startModuleForUser, addXP } from '../lib/firestoreService';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const LearningPathDetailPage = () => {
  const { pathId } = useParams();
  const { user } = useAuth();
  
  const [path, setPath] = useState(null);
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPathDetails = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [pathData, modulesData, progressData] = await Promise.all([
        getLearningPathById(pathId),
        getModulesForPath(pathId),
        getUserProgressForPath(user.uid, pathId)
      ]);
      
      if (pathData) {
        setPath(pathData);
        setModules(modulesData);
        setProgress(progressData);
      } else {
        setError('Learning path not found.');
      }
    } catch (err) {
      setError('Failed to load learning path details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pathId, user]);

  useEffect(() => {
    fetchPathDetails();
  }, [fetchPathDetails]);

  const handleStartModule = async (moduleId) => {
    if (progress[moduleId]) return;
    try {
      setProgress(prev => ({ ...prev, [moduleId]: { status: 'in-progress' } }));
      await Promise.all([
        startModuleForUser(user.uid, pathId, moduleId),
        addXP(user.uid, 10)
      ]);
    } catch (error) {
      setProgress(prev => {
        const newState = { ...prev };
        delete newState[moduleId];
        return newState;
      });
      alert('Could not start module. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading path details...</div>;
  }
  if (error) {
    return <div className="text-destructive">{error}</div>;
  }
  if (!path) {
    return <div>Learning path not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-4 mb-2">
          <h1 className="text-4xl font-bold">{path.name}</h1>
          {path.is_premium && <Badge variant="destructive">Premium</Badge>}
        </div>
        <p className="text-lg text-muted-foreground">{path.description}</p>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Modules in this Path</h2>
        {modules.map((module, index) => {
          const moduleProgress = progress[module.id];
          const status = moduleProgress?.status;
          return (
            <Card key={module.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-muted-foreground mr-4">{index + 1}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{module.title}</h3>
                      {status === 'in-progress' && <Badge variant="secondary">In Progress</Badge>}
                      {status === 'completed' && <Badge>Completed</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{module.chapterCount} Chapters</p>
                  </div>
                </div>
                <Link to={`/learn/${pathId}/${module.id}`}>
                  <Button 
                    variant={status ? 'secondary' : 'outline'}
                    onClick={() => handleStartModule(module.id)}
                  >
                    {status === 'in-progress' ? 'Continue' : status === 'completed' ? 'Review' : 'Start Module'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPathDetailPage;
