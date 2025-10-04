import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export const usePulseAnimation = (duration: number = 2000) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [pulseAnim, duration]);

  return pulseAnim;
};

export const useWaveAnimation = (duration: number = 3000) => {
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.sin),
      })
    );

    animation.start();

    return () => animation.stop();
  }, [waveAnim, duration]);

  return waveAnim;
};

export const useBreatheAnimation = (duration: number = 4000) => {
  const breatheAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.2,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [breatheAnim, duration]);

  return breatheAnim;
};

export const useShakeAnimation = () => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { shakeAnim, triggerShake };
};

export const useFadeInAnimation = (duration: number = 1000) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [fadeAnim, duration]);

  return fadeAnim;
};

export const useSlideInAnimation = (direction: 'left' | 'right' | 'top' | 'bottom' = 'left', duration: number = 500) => {
  const slideAnim = useRef(new Animated.Value(direction === 'left' ? -100 : direction === 'right' ? 100 : direction === 'top' ? -100 : 100)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [slideAnim, duration]);

  const getStyle = () => {
    switch (direction) {
      case 'left':
      case 'right':
        return { transform: [{ translateX: slideAnim }] };
      case 'top':
      case 'bottom':
        return { transform: [{ translateY: slideAnim }] };
    }
  };

  return { slideAnim, animatedStyle: getStyle() };
};