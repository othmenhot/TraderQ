import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { cn } from '../../lib/utils';

const Quiz = ({ quizData, onComplete }) => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quizData.questions[activeQuestion];

  const handleSelectAnswer = (option) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleNext = () => {
    if (activeQuestion < quizData.questions.length - 1) {
      setActiveQuestion(prev => prev + 1);
    } else {
      // Finish the quiz and calculate score
      let finalScore = 0;
      quizData.questions.forEach(q => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          finalScore++;
        }
      });
      setScore(finalScore);
      setIsFinished(true);
      onComplete(finalScore / quizData.questions.length); // Pass score percentage
    }
  };

  if (isFinished) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
          <CardDescription>You have completed the "{quizData.title}".</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">Your Score: {score} / {quizData.questions.length}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quizData.title}</CardTitle>
        <CardDescription>Question {activeQuestion + 1} of {quizData.questions.length}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="font-semibold text-lg">{currentQuestion.text}</p>
        <div className="space-y-2">
          {currentQuestion.options.map(option => (
            <button
              key={option}
              onClick={() => handleSelectAnswer(option)}
              className={cn(
                'w-full text-left p-3 border rounded-md transition-colors',
                selectedAnswers[currentQuestion.id] === option
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestion.id]}>
          {activeQuestion < quizData.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Quiz;
