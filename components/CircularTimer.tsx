import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Animated } from 'react-native';

interface CircularTimerProps {
  seconds: number;
  onComplete?: () => void;
}

const RADIUS = 50;
const STROKE_WIDTH = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CircularTimer: React.FC<CircularTimerProps> = ({ seconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start the circle animation
    Animated.timing(progress, {
      toValue: 1,
      duration: seconds * 1000,
      useNativeDriver: true,
    }).start();

    return () => clearInterval(interval);
  }, []);

  const animatedStrokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, CIRCUMFERENCE],
  });

  return (
    <View className="items-center justify-center">
      <Svg width={120} height={120}>
        <Circle
          stroke="#e6e6e6"
          fill="none"
          cx="60"
          cy="60"
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
        />
        <AnimatedCircle
          stroke="#00cc99"
          fill="none"
          cx="60"
          cy="60"
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${CIRCUMFERENCE}`}
          strokeDashoffset={animatedStrokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View className="absolute items-center justify-center">
        <Text className="text-3xl font-bold text-black">{timeLeft}</Text>
      </View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default CircularTimer;
