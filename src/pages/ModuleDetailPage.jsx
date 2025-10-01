import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROADMAP_DATA, CHAPTERS } from '../lib/mockData'; // <-- Correct import
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const ModuleDetailPage = () => {
  const { pathId, moduleId } = useParams();
  
  // Find the specific module by searching through the new ROADMAP_DATA structure
  let moduleInfo;
  const pathData = ROADMAP_DATA[pathId];
  if (pathData) {
    if (pathData.categories) { // Fundamental path
      for (const category of pathData.categories) {
        const foundModule = category.modules.find(m => m.id === moduleId);
        if (foundModule) {
          moduleInfo = foundModule;
          break;
        }
      }
    } else { // Specialization paths
      moduleInfo = pathData.modules.find(m => m.id === moduleId);
    }
  }
  
  const chapters = CHAPTERS[moduleId] || [];

  if (!moduleInfo) {
    return <div>Module not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <Link to={`/roadmap`} className="text-sm text-primary hover:underline">
          &larr; Back to Roadmap
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
