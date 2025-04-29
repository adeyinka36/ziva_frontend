// components/GameFlow/QuestionIntroScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import BoxText from '@/components/BoxText';

interface Props {
  current: number;
  total: number;
  topic: string;
}


const QuestionIntroScreen: React.FC<Props> = ({ current, total, topic }) => {
    const text = `Question ${current} of ${total}`
  return (
    
    <View className="justify-around  items-center bg-primary flex-1">
      <BoxText text={text} color='bg-yellow' size={10} />
      <BoxText text={topic} color='bg-yellow' size={10} />
    </View>
  );
};

export default QuestionIntroScreen;