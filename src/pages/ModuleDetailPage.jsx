import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getModuleById, getChaptersForModule } from '../lib/firestoreService';

const ModuleDetailPage = () => {
  const { pathId, moduleId } = useParams();
  const [moduleInfo, setModuleInfo] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        setLoading(true);
        const moduleData = await getModuleById(pathId, moduleId);
        setModuleInfo(moduleData);
        if (moduleData) {
          const chaptersData = await getChaptersForModule(pathId, moduleId);
          setChapters(chaptersData);
        }
      } catch (error) {
        console.error("Failed to fetch module details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [pathId, moduleId]);

  if (loading) {
    return <div>Loading module...</div>;
  }

  if (!moduleInfo) {
    return <div>Module not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <Link to={`/learn/${pathId}`} className="text-sm text-primary hover:underline">
          &larr; Back to Learning Path
        </Link>
        <h1 className="text-4xl font-bold mt-2">{moduleInfo.title}</h1>
        <p className="text-lg text-muted-foreground">
          Complete all chapters to finish this module.
        </p>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Chapters</h2>
        {chapters.map((chapter, index) => (
          <Card key={chapter.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-muted-foreground mr-4">{index + 1}</div>
                <div>
                  <h3 className="font-semibold">{chapter.title}</h3>
                </div>
              </div>
              <Link to={`/learn/${pathId}/${moduleId}/${chapter.id}`}>
                <Button>Start</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        {chapters.length === 0 && (
          <p className="text-muted-foreground">No chapters available for this module yet.</p>
        )}
      </div>
    </div>
  );
};

export default ModuleDetailPage;
