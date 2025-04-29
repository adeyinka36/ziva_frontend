import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import CircularTimer from '@/components/CircularTimer';
import { CheckCircleIcon, XCircleIcon } from "react-native-heroicons/solid"; 
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import useSocket from '@/hooks/useSocket';
import { useGame } from '@/hooks/useGame';
import { useAuth } from '@/contexts/auth';

interface Props {
  question: string;
  questionId: string;
  options: string[];
  correctAnswer: string;
}
interface Results {
  question_id: string,
  question: string,
  answer: string,
  correct: boolean
}

const { width } = Dimensions.get('window');

const AnswerOptionsScreen: React.FC<Props> = ({ question, questionId, options, correctAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const animations = useRef(options.map(() => new Animated.Value(0))).current; // one animation per option
  const socket  = useSocket();
  const {currentGame} = useGame();
  const {user} = useAuth();
  const [results, setResults] = useState<Results[]>([])

  useEffect(() => {
    // Animate options in one by one
    Animated.stagger(150, animations.map((anim, idx) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      });
    })).start();

    const revealTimeout = setTimeout(() => {
      setRevealed(true);
    }, 7000);

    return () => {
      clearTimeout(revealTimeout);
    };
  }, []);


  const handleSelection = (opt: string) => {
    if(currentGame?.id) {
      setSelected(opt);
      socket.emit('game_answer', {
        gameId: currentGame.id,
        playerId: user.id,
        questionId: questionId,
        correct: opt === correctAnswer,
        questionText: question
      });
    }
  }

  const renderResultText = () => {
    if (revealed) {
      const isCorrect = selected === correctAnswer;
      return (
        <View className="flex-row justify-center items-center mb-4">
        {isCorrect ? (
          <>
            <CheckCircleIcon size={wp(20)} color="#ffff00" />
          </>
        ) : (
          <>
            <XCircleIcon size={wp(20)} color="#ff0000" />
          </>
        )}
      </View>
      );
    }
    return <CircularTimer seconds={7}/>;
  };

  const getBackgroundColor = (opt: string) => {
    if (!revealed) {
      return selected === opt ? 'bg-yellow' : 'bg-white';
    }

    if (selected === opt && correctAnswer === opt) return 'bg-yellow'; // correct selected
    if (selected === opt && correctAnswer !== opt) return 'bg-secondary'; // wrong selected
    if (correctAnswer === opt) return 'bg-yellow'; // correct answer
    if (selected !== opt && revealed && correctAnswer !== opt) return 'bg-white'; // unselected wrong option hidden

    return 'bg-white';
  };

  return (
    <View className="flex-1 bg-primary m-4 justify-between">
      {/* Question Box */}
      <View className="bg-yellow rounded-xl p-4 mb-8 mx-2">
        <Text className="text-black text-2xl font-semibold text-center">{question}</Text>
      </View>

      {/* Correct/Incorrect Text */}
      {renderResultText()}

      {/* Options Grid */}
      <View className=" flex-wrap justify-between bg-primary">
        {options.map((opt, idx) => {
          const fromDirection = idx % 2 === 0 ? -width : width; // left or right
          const translateX = animations[idx].interpolate({
            inputRange: [0, 1],
            outputRange: [fromDirection, 0],
          });

          return (
            <Animated.View
              key={idx}
              style={{
                transform: [{ translateX }],
                width: '100%',
                marginBottom: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => handleSelection(opt)}
                disabled={selected != null}
                className={`h-20 rounded-xl justify-center items-center ${getBackgroundColor(opt)} `}
              >
                <Text className="text-black text-center font-medium text-2xl">{opt}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

export default AnswerOptionsScreen;
