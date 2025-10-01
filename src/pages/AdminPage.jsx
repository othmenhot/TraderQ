import React, { useState } from 'react';
import { ROADMAP_DATA, CHAPTERS } from '../lib/mockData';
import { generateChapterContent } from '../lib/geminiService';
import { updateChapterContent } from '../lib/firestoreService'; // Import the new function
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';

const AdminPage = () => {
  const [generatedContent, setGeneratedContent] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [savingStates, setSavingStates] = useState({});

  const handleGenerate = async (chapterId, chapterTitle) => {
    setLoadingStates(prev => ({ ...prev, [chapterId]: true }));
    try {
      const content = await generateChapterContent(chapterTitle);
      setGeneratedContent(prev => ({ ...prev, [chapterId]: content }));
    } catch (error) {
      alert(`Error generating content: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [chapterId]: false }));
    }
  };

  const handleSave = async (chapterId) => {
    setSavingStates(prev => ({ ...prev, [chapterId]: 'saving' }));
    try {
      const content = generatedContent[chapterId];
      await updateChapterContent(chapterId, content);
      setSavingStates(prev => ({ ...prev, [chapterId]: 'success' }));
    } catch (error) {
      setSavingStates(prev => ({ ...prev, [chapterId]: 'error' }));
      alert(`Error saving content: ${error.message}`);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Content Generation</h1>
      
      {Object.values(ROADMAP_DATA).map(path => (
        <Card key={path.id}>
          <CardHeader><CardTitle>{path.name}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {(path.categories || [{ modules: path.modules }]).map((category, index) => (
              <div key={index} className="space-y-2">
                {category.name && <h3 className="font-semibold text-lg">{category.name}</h3>}
                {category.modules.map(module => (
                  <div key={module.id} className="pl-4 border-l-2 space-y-2">
                    <h4 className="font-medium">{module.title}</h4>
                    {(CHAPTERS[module.id] || []).map(chapter => (
                      <div key={chapter.id} className="pl-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">{chapter.title}</p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleGenerate(chapter.id, chapter.title)}
                            disabled={loadingStates[chapter.id]}
                          >
                            {loadingStates[chapter.id] ? 'Generating...' : 'Generate Content'}
                          </Button>
                        </div>
                        {generatedContent[chapter.id] && (
                          <div className="space-y-2">
                            <Textarea 
                              value={generatedContent[chapter.id]} 
                              onChange={(e) => setGeneratedContent(prev => ({...prev, [chapter.id]: e.target.value}))}
                              className="bg-secondary/50 h-32"
                            />
                            <Button 
                              size="sm" 
                              onClick={() => handleSave(chapter.id)}
                              disabled={savingStates[chapter.id] === 'saving'}
                            >
                              {savingStates[chapter.id] === 'saving' ? 'Saving...' : 
                               savingStates[chapter.id] === 'success' ? 'Saved!' : 
                               savingStates[chapter.id] === 'error' ? 'Retry Save' : 'Save to DB'}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminPage;
