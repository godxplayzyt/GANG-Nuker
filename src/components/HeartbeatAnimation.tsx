import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

interface HeartbeatAnimationProps {
  isActive: boolean;
  size?: number;
}

const HeartbeatAnimation: React.FC<HeartbeatAnimationProps> = ({
  isActive,
  size = 100,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      // Intense heartbeat animation
      const heartbeatAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );

      const opacityAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );

      const rotationAnimation = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );

      heartbeatAnimation.start();
      opacityAnimation.start();
      rotationAnimation.start();

      return () => {
        heartbeatAnimation.stop();
        opacityAnimation.stop();
        rotationAnimation.stop();
      };
    } else {
      // Gentle pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      const opacityAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();
      opacityAnimation.start();

      return () => {
        pulseAnimation.stop();
        opacityAnimation.stop();
      };
    }
  }, [isActive]);

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer ring */}
      <Animated.View
        style={[
          styles.ring,
          styles.outerRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [
              { scale: scaleAnim },
              { rotate: rotation },
            ],
            opacity: opacityAnim,
          },
        ]}
      />
      
      {/* Middle ring */}
      <Animated.View
        style={[
          styles.ring,
          styles.middleRing,
          {
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: (size * 0.7) / 2,
            transform: [
              { scale: scaleAnim },
              { rotate: rotation },
            ],
            opacity: opacityAnim,
          },
        ]}
      />
      
      {/* Inner ring */}
      <Animated.View
        style={[
          styles.ring,
          styles.innerRing,
          {
            width: size * 0.4,
            height: size * 0.4,
            borderRadius: (size * 0.4) / 2,
            transform: [
              { scale: scaleAnim },
              { rotate: rotation },
            ],
            opacity: opacityAnim,
          },
        ]}
      />
      
      {/* Center dot */}
      <Animated.View
        style={[
          styles.centerDot,
          {
            width: size * 0.1,
            height: size * 0.1,
            borderRadius: (size * 0.1) / 2,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
  },
  outerRing: {
    borderColor: colors.error,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  middleRing: {
    borderColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  innerRing: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  centerDot: {
    backgroundColor: colors.text,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default HeartbeatAnimation;