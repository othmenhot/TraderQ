import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getModuleById, getChaptersForModule, getChapterContent, completeModuleForUser, addXP, awardBadge } from '../lib/firestoreService';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import Quiz from '../components/learning/Quiz';
import { BADGES } from '../lib/badges';

const ChapterPage = () => {
  const { pathId, moduleId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [moduleInfo, setModuleInfo] = useState(null);
  const [chaptersInModule, setChaptersInModule] = useState([]);
  const [chapterContent, setChapterContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChapterData = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const [modInfo, chapsInMod, chapContent] = await Promise.all([
        getModuleById(pathId, moduleId),
        getChaptersForModule(pathId, moduleId),
        getChapterContent(chapterId)
      ]);
      setModuleInfo(modInfo);
      setChaptersInModule(chapsInMod);
      setChapterContent(chapContent);
    } catch (error) {
      console.error("Failed to fetch chapter data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pathId, moduleId, chapterId, user]);

  useEffect(() => {
    fetchChapterData();
  }, [fetchChapterData]);

  const currentChapterIndex = chaptersInModule.findIndex(c => c.id === chapterId);
  const chapterData = chaptersInModule[currentChapterIndex];
  const isLastChapter = currentChapterIndex === chaptersInModule.length - 1;
  const prevChapter = currentChapterIndex > 0 ? chaptersInModule[currentChapterIndex - 1] : null;
  const nextChapter = !isLastChapter ? chaptersInModule[currentChapterIndex + 1] : null;

  const handleCompleteModule = async () => {
    if (!user || !moduleInfo) return;
    try {
      await completeModuleForUser(user.uid, moduleId);
      await addXP(user.uid, 50); // XP for completing a module
      
      const badgeToAward = BADGES.find(b => b.modules.includes(moduleId));
      if (badgeToAward) {
        await awardBadge(user.uid, badgeToAward.id);
      }
      
      alert(`Module "${moduleInfo.title}" completed!`);
      navigate(`/learn/${pathId}`);
    } catch (error) {
      console.error("Failed to complete module:", error);
      alert("There was an error completing the module.");
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Card><CardContent className="p-8">Loading content...</CardContent></Card>;
    }
    
    if (chapterData?.type === 'quiz' && chapterContent?.quizId) {
      // Assuming a Quiz component that fetches its own data based on quizId
      return <Quiz quizId={chapterContent.quizId} onComplete={handleCompleteModule} />;
    }

    if (chapterContent?.content) {
      return (
        <Card>
          <CardContent className="p-8 prose dark:prose-invert max-w-none">
            <h1>{chapterData?.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: chapterContent.content }} />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <h1 className="text-2xl font-semibold mb-2">{chapterData?.title}</h1>
          <p>Content for this chapter is coming soon!</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Link to={`/learn/${pathId}/${moduleId}`} className="text-sm text-primary hover:underline">
        &larr; Back to Chapters in "{moduleInfo?.title || 'Module'}"
      </Link>
      
      {renderContent()}

      {chapterData?.type !== 'quiz' && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(`/learn/${pathId}/${moduleId}/${prevChapter.id}`)} disabled={!prevChapter}>
            Previous Chapter
          </Button>
          {isLastChapter ? (
            <Button onClick={handleCompleteModule}>Complete Module</Button>
          ) : (
            <Button onClick={() => navigate(`/learn/${pathId}/${moduleId}/${nextChapter.id}`)} disabled={!nextChapter}>
              Next Chapter
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChapterPage;
