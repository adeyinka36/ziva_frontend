// components/GameFlow/RoundIntroScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  round: number;
  current: number;
  total: number;
}


const RoundIntroScreen: React.FC<Props> = ({ round, current, total }) => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-black">Round {round}</Text>
      <Text className="text-xl mt-2 text-[gray-700]">Question {current} of {total}</Text>
    </View>
  );
};

export default RoundIntroScreen;