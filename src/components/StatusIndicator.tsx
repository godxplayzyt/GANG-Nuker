import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../styles/theme';

interface StatusIndicatorProps {
  title: string;
  isActive: boolean;
  color: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  title,
  isActive,
  color,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      );

      pulseAnimation.start();
      glowAnimation.start();

      return () => {
        pulseAnimation.stop();
        glowAnimation.stop();
      };
    }
  }, [isActive]);

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.8],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: isActive ? color : colors.surface,
            borderColor: color,
            transform: [{ scale: pulseAnim }],
            shadowColor: isActive ? color : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: shadowOpacity,
            shadowRadius: 10,
            elevation: isActive ? 10 : 0,
          },
        ]}
      >
        <View
          style={[
            styles.innerDot,
            {
              backgroundColor: isActive ? colors.text : colors.textSecondary,
            },
          ]}
        />
      </Animated.View>
      <Text
        style={[
          styles.title,
          {
            color: isActive ? color : colors.textSecondary,
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StatusIndicator;