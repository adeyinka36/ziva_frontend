import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';

interface GameOverScreenProps {
  didWin: boolean;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ didWin }) => {
  const router = useRouter();
  const [fireConfetti, setFireConfetti] = useState(true);

  const playAgain = () => {
    // Implement
  };

  const goHome = () => {
    router.replace('/home');
  };

  useEffect(() => {
    if (didWin) {
      const interval = setInterval(() => {
        setFireConfetti(true);
      }, 3000); // 🎉 Fire confetti every 3 seconds

      return () => clearInterval(interval);
    }
  }, [didWin]);

  return (
    <View className="flex-1 justify-around items-center bg-primary px-6">
      {/* 🎉 Confetti */}
      {didWin && fireConfetti && (
        <ConfettiCannon
          count={100}
          origin={{ x: wp(50), y: 0 }}
          fallSpeed={3000}
          fadeOut
          explosionSpeed={500}
          onAnimationEnd={() => setFireConfetti(false)} // reset after each shot
        />
      )}

      {/* Circular Border */}
      <View
        className="justify-center items-center border-2 rounded-full"
        style={{
          width: wp(60),
          height: wp(60),
          borderColor: 'yellow',
          borderWidth: 6,
          padding: wp(1),
        }}
      >
        <Text
          className="text-black font-bold text-center"
          style={{ fontSize: wp(8) }}
        >
          {didWin ? '🏆 You Won!' : '😞 You Lost'}
        </Text>
      </View>

      {/* Buttons */}
      <View className="flex justify-around w-100">
        <TouchableOpacity
          onPress={playAgain}
          className="bg-yellow px-8 py-4 rounded-full mb-2"
        >
          <Text
            className="text-black font-bold text-center"
            style={{ fontSize: wp(5) }}
          >
            Play Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goHome}
          className="bg-secondary px-8 py-4 rounded-full"
        >
          <Text
            className="text-white font-bold text-center"
            style={{ fontSize: wp(5) }}
          >
            Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GameOverScreen;
