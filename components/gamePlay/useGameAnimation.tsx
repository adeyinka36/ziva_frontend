import { useMemo, useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export function useGameAnimation(playerCount: number = 0) {
  const startBtnScale = useRef(new Animated.Value(1)).current;

  // ✅ Immediately available bounce values on first render
  const bounceAnimations = useMemo(() => {
    return Array.from({ length: playerCount }, () => new Animated.Value(0));
  }, [playerCount]);

  useEffect(() => {
    bounceAnimations.forEach((_, i) => startBounce(i));
    startButtonPulse();
  }, [bounceAnimations]);

  const startBounce = (index: number) => {
    const bounceVal = bounceAnimations[index];
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
