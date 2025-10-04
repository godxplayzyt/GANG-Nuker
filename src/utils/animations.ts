// Animation utilities for the Women Safety App

import { Animated } from 'react-native';

export const createPulseAnimation = (
  animatedValue: Animated.Value,
  minScale: number = 1,
  maxScale: number = 1.2,
  duration: number = 1000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: maxScale,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: minScale,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ])
  );
};

export const createHeartbeatAnimation = (
  animatedValue: Animated.Value,
  baseScale: number = 1,
  beatScale: number = 1.3,
  duration: number = 1000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: beatScale,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: baseScale,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: beatScale * 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: baseScale,
        duration: 400,
        useNativeDriver: true,
      }),
    ])
  );
};

export const createGlowAnimation = (
  animatedValue: Animated.Value,
  minOpacity: number = 0.3,
  maxOpacity: number = 0.8,
  duration: number = 2000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: maxOpacity,
        duration: duration / 2,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValue, {
        toValue: minOpacity,
        duration: duration / 2,
        useNativeDriver: false,
      }),
    ])
  );
};

export const createSlideAnimation = (
  animatedValue: Animated.Value,
  minTranslate: number = -20,
  maxTranslate: number = 20,
  duration: number = 3000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ])
  );
};

export const createRotationAnimation = (
  animatedValue: Animated.Value,
  duration: number = 2000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
    })
  );
};

export const createFlashAnimation = (
  animatedValue: Animated.Value,
  minOpacity: number = 0,
  maxOpacity: number = 0.3,
  duration: number = 300
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: maxOpacity,
        duration: duration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValue, {
        toValue: minOpacity,
        duration: duration,
        useNativeDriver: false,
      }),
    ])
  );
};

export const createWaveAnimation = (
  animatedValues: Animated.Value[],
  baseHeight: number = 10,
  maxHeight: number = 40,
  duration: number = 1000
): Animated.CompositeAnimation[] => {
  return animatedValues.map((animatedValue, index) => {
    const delay = index * 100;
    const heightVariation = (maxHeight - baseHeight) / animatedValues.length;
    
    return Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animatedValue, {
          toValue: baseHeight + (heightVariation * (index + 1)),
          duration: duration / 2,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: baseHeight,
          duration: duration / 2,
          useNativeDriver: false,
        }),
      ])
    );
  });
};

export const createFadeInAnimation = (
  animatedValue: Animated.Value,
  duration: number = 500
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration: duration,
    useNativeDriver: true,
  });
};

export const createFadeOutAnimation = (
  animatedValue: Animated.Value,
  duration: number = 500
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration: duration,
    useNativeDriver: true,
  });
};

export const createScaleAnimation = (
  animatedValue: Animated.Value,
  fromScale: number = 0,
  toScale: number = 1,
  duration: number = 300
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: toScale,
    duration: duration,
    useNativeDriver: true,
  });
};

export const createBounceAnimation = (
  animatedValue: Animated.Value,
  duration: number = 1000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.2,
        duration: duration / 4,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0.8,
        duration: duration / 4,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1.1,
        duration: duration / 4,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration / 4,
        useNativeDriver: true,
      }),
    ])
  );
};

export const createShakeAnimation = (
  animatedValue: Animated.Value,
  intensity: number = 10,
  duration: number = 500
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: intensity,
        duration: duration / 8,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -intensity,
        duration: duration / 8,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: intensity,
        duration: duration / 8,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -intensity,
        duration: duration / 8,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: intensity,
        duration: duration / 8,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -intensity,
        duration: duration / 8,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: intensity,
        duration: duration / 8,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: duration / 8,
        useNativeDriver: true,
      }),
    ])
  );
};

export const interpolateRotation = (animatedValue: Animated.Value): Animated.AnimatedInterpolation => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
};

export const interpolateScale = (
  animatedValue: Animated.Value,
  minScale: number = 0.8,
  maxScale: number = 1.2
): Animated.AnimatedInterpolation => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [minScale, maxScale],
  });
};

export const interpolateOpacity = (
  animatedValue: Animated.Value,
  minOpacity: number = 0,
  maxOpacity: number = 1
): Animated.AnimatedInterpolation => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [minOpacity, maxOpacity],
  });
};

export const interpolateTranslateX = (
  animatedValue: Animated.Value,
  minTranslate: number = -20,
  maxTranslate: number = 20
): Animated.AnimatedInterpolation => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [minTranslate, maxTranslate],
  });
};

export const interpolateTranslateY = (
  animatedValue: Animated.Value,
  minTranslate: number = -20,
  maxTranslate: number = 20
): Animated.AnimatedInterpolation => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [minTranslate, maxTranslate],
  });
};

export const interpolateColor = (
  animatedValue: Animated.Value,
  colors: string[]
): Animated.AnimatedInterpolation => {
  return animatedValue.interpolate({
    inputRange: colors.map((_, index) => index / (colors.length - 1)),
    outputRange: colors,
  });
};