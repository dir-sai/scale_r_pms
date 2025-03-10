import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

type AnimationType = 'fade' | 'slide' | 'scale';

interface AnimationConfig {
  type: AnimationType;
  initialValue: number;
  finalValue: number;
  duration?: number;
  delay?: number;
  easing?: (value: number) => number;
}

export const useAnimation = ({
  type,
  initialValue,
  finalValue,
  duration = 300,
  delay = 0,
  easing = Easing.ease,
}: AnimationConfig) => {
  const animatedValue = useRef(new Animated.Value(initialValue)).current;

  useEffect(() => {
    const animation = Animated.timing(animatedValue, {
      toValue: finalValue,
      duration,
      delay,
      easing,
      useNativeDriver: true,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [animatedValue, finalValue, duration, delay, easing]);

  const value = animatedValue;

  const interpolate = (outputRange: number[] | string[]) =>
    animatedValue.interpolate({
      inputRange: [initialValue, finalValue],
      outputRange,
    });

  return {
    value,
    interpolate,
  };
}; 