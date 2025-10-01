import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ROADMAP_DATA, CHAPTERS, CHAPTER_CONTENT, QUIZZES } from '../lib/mockData';
import { completeModuleForUser, addXP, awardBadge } from '../lib/firestoreService';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import Quiz from '../components/learning/Quiz';
import { BADGES } from '../lib/badges';

const ChapterPage = () => {
  const { pathId, moduleId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Find module info from the new ROADMAP_DATA structure
  let moduleInfo;
  const pathData = ROADMAP_DATA[pathId];
  if (pathData) {
    if (pathData.categories) {
      for (const category of pathData.categories) {
        const foundModule = category.modules.find(m => m.id === moduleId);
        if (foundModule) { moduleInfo = foundModule; break; }
      }
    } else {
      moduleInfo = pathData.modules.find(m => m.id === moduleId);
    }
  }

  const chaptersInModule = CHAPTERS[moduleId] || [];
  const chapterData = chaptersInModule.find(c => c.id === chapterId);
  const chapterContent = CHAPTER_CONTENT[chapterId];

  const currentChapterIndex = chaptersInModule.findIndex(c => c.id === chapterId);
  const isLastChapter = currentChapterIndex === chaptersInModule.length - 1;
  const prevChapter = currentChapterIndex > 0 ? chaptersInModule[currentChapterIndex - 1] : null;
  const nextChapter = !isLastChapter ? chaptersInModule[currentChapterIndex + 1] : null;

  const handleCompleteModule = async () => {
    if (!user) return;
    try {
      await Promise.all([
        addXP(user.uid, 50),
        completeModuleForUser(user.uid, moduleId),
        awardBadge(user.uid, BADGES.completed_first_module.id),
      ]);
      navigate(`/roadmap`);
    } catch (error) {
      alert('Failed to complete module. Please try again.');
    }
  };
  
  if (!chapterContent || !moduleInfo) {
    return <div>Chapter content not found.</div>;
  }
  
  const renderContent = () => {
    if (chapterData?.type === 'quiz' && chapterContent.quizId) {
      const quizData = QUIZZES[chapterContent.quizId];
      return <Quiz quizData={quizData} onComplete={handleCompleteModule} />;
    }
    return (
      <Card>
        <CardContent className="p-8 prose dark:prose-invert max-w-none">
          <h1>{chapterData?.title}</h1>
          <p>{chapterContent.content}</p>
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
