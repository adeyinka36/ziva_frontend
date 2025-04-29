// components/GameFlow/QuestionDisplayScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  question: string;
}


const QuestionDisplayScreen: React.FC<Props> = ({ question }) => {
  return (
    <View className="flex-1 items-center justify-center bg-primary px-4">
      <Text className="text-2xl font-semibold text-center text-black">{question}</Text>
    </View>
  );
};


export default QuestionDisplayScreen;