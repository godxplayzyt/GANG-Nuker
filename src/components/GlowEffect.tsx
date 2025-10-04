import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';

interface GlowEffectProps {
  children: React.ReactNode;
  color: string;
  intensity?: number;
  style?: ViewStyle;
}

const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  color,
  intensity = 0.5,
  style,
}) => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: intensity,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: intensity * 0.3,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    glowAnimation.start();
    pulseAnimation.start();

    return () => {
      glowAnimation.stop();
      pulseAnimation.stop();
    };
  }, [intensity]);

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, intensity],
  });

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: pulseAnim }],
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: shadowOpacity,
          shadowRadius: 20,
          elevation: 20,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default GlowEffect;