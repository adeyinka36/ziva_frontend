import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import QuestionIntroScreen from './QuestionIntroScreen';
import AnswerOptionsScreen from './AnswerOptionsScreen';
import { GameQuestionType } from '@/types/game';

export type GameStage = 'QUESTION_INTRO' | 'QUESTION_PHASE';

const GameFlowManager = ({ question }: { question: GameQuestionType }) => {
  const [stage, setStage] = useState<GameStage>('QUESTION_INTRO');

  if (!question?.id) return null;

  useEffect(() => {
    setStage('QUESTION_INTRO');
  }, [question.id]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (stage === 'QUESTION_INTRO') {
      timeout = setTimeout(() => setStage('QUESTION_PHASE'), 3000);
    }
    return () => clearTimeout(timeout);
  }, [stage]);

  const renderScreen = () => {
    switch (stage) {
      case 'QUESTION_INTRO':
        return (
          <QuestionIntroScreen
            current={question.currentQuestion}
            total={question.totalQuestions}
            topic={question.topic}
          />
        );
      case 'QUESTION_PHASE':
        return (
          <AnswerOptionsScreen
            question={question.question_text}
            questionId={question.id}
            options={Object.values(question.options)}
            correctAnswer={question.options[question.answer]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1">
      {renderScreen()}
    </View>
  );
};

export default GameFlowManager;
