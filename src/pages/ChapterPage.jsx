import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ROADMAP_DATA, CHAPTERS } from '../lib/mockData';
import { getChapterContent, completeModuleForUser, addXP, awardBadge } from '../lib/firestoreService';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import Quiz from '../components/learning/Quiz'; // Assuming quiz logic stays mock for now
import { BADGES } from '../lib/badges';

const ChapterPage = () => {
  const { pathId, moduleId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Static data from mock files
  const moduleInfo = Object.values(ROADMAP_DATA).flatMap(p => p.categories ? p.categories.flatMap(c => c.modules) : p.modules).find(m => m.id === moduleId);
  const chaptersInModule = CHAPTERS[moduleId] || [];
  const chapterData = chaptersInModule.find(c => c.id === chapterId);

  // Dynamic content from Firestore
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getChapterContent(chapterId)
      .then(data => {
        setContent(data?.content || null);
      })
      .catch(error => {
        console.error("Failed to fetch chapter content:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [chapterId]);

  // Navigation logic
  const currentChapterIndex = chaptersInModule.findIndex(c => c.id === chapterId);
  const isLastChapter = currentChapterIndex === chaptersInModule.length - 1;
  const prevChapter = currentChapterIndex > 0 ? chaptersInModule[currentChapterIndex - 1] : null;
  const nextChapter = !isLastChapter ? chaptersInModule[currentChapterIndex + 1] : null;

  const handleCompleteModule = async () => { /* ... (no changes here) */ };

  if (!moduleInfo) return <div>Module not found.</div>;

  const renderContent = () => {
    if (isLoading) {
      return <Card><CardContent className="p-8">Loading content...</CardContent></Card>;
    }
    
    // For now, quiz logic remains tied to mock data
    if (chapterData?.type === 'quiz') {
      const quizData = QUIZZES[CHAPTER_CONTENT[chapterId].quizId];
      return <Quiz quizData={quizData} onComplete={handleCompleteModule} />;
    }

    if (content) {
      return (
        <Card>
          <CardContent className="p-8 prose dark:prose-invert max-w-none">
            <h1>{chapterData?.title}</h1>
            <p>{content}</p>
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
        &larr; Back to Chapters in "{moduleInfo.title}"
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
