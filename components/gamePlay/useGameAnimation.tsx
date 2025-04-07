import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function useGameAnimation(playerCount: number) {
  const bounceAnimations = useRef<Animated.Value[]>([]);
  const startBtnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    bounceAnimations.current = Array(playerCount)
      .fill(null)
      .map(() => new Animated.Value(0));

    bounceAnimations.current.forEach((_, i) => startBounce(i));
    startButtonPulse();
  }, [playerCount]);

  

  const startBounce = (index: number) => {
    const bounceVal = bounceAnimations.current[index];
    bounceVal.setValue(50);
    Animated.sequence([
      Animated.timing(bounceVal, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceVal, {
            toValue: -5,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounceVal, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  };

  const startButtonPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(startBtnScale, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(startBtnScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  return { bounceAnimations, startBtnScale };
}
