import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useEmergency } from '../context/EmergencyContext';
import { useLocation } from '../context/LocationContext';
import { useVoice } from '../context/VoiceContext';
import { useHealth } from '../context/HealthContext';
import { colors } from '../styles/theme';
import HeartbeatAnimation from '../components/HeartbeatAnimation';
import GlowEffect from '../components/GlowEffect';
import StatusIndicator from '../components/StatusIndicator';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { activateEmergencyMode, isEmergencyMode } = useEmergency();
  const { isTracking, startTracking } = useLocation();
  const { isListening, isEmergencyDetected } = useVoice();
  const { isMonitoring, healthData } = useHealth();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Start glow animation
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    // Start slide animation
    const slideAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    glowAnimation.start();
    slideAnimation.start();

    // Start location tracking
    startTracking();

    return () => {
      pulseAnimation.stop();
      glowAnimation.stop();
      slideAnimation.stop();
    };
  }, []);

  const handleEmergencyPress = () => {
    activateEmergencyMode();
  };

  const slideTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={colors.gradient.background}
        style={styles.backgroundGradient}
      />

      {/* Animated Background Elements */}
      <Animated.View
        style={[
          styles.backgroundElement1,
          {
            transform: [{ translateX: slideTranslateX }],
            opacity: glowOpacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundElement2,
          {
            transform: [{ translateX: slideTranslateX }],
            opacity: glowOpacity,
          },
        ]}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Women Safety App</Text>
        <Text style={styles.subtitle}>Made in India • Dev Roy • V-1</Text>
      </View>

      {/* Status Indicators */}
      <View style={styles.statusContainer}>
        <StatusIndicator
          title="Location"
          isActive={isTracking}
          color={colors.primary}
        />
        <StatusIndicator
          title="Voice AI"
          isActive={isListening}
          color={colors.secondary}
        />
        <StatusIndicator
          title="Health"
          isActive={isMonitoring}
          color={colors.success}
        />
      </View>

      {/* Heartbeat Animation */}
      <View style={styles.heartbeatContainer}>
        <HeartbeatAnimation
          isActive={isEmergencyMode || isEmergencyDetected}
          size={120}
        />
      </View>

      {/* Emergency Button */}
      <Animated.View
        style={[
          styles.emergencyButtonContainer,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <GlowEffect
          color={isEmergencyMode ? colors.error : colors.primary}
          intensity={isEmergencyMode ? 1 : 0.5}
        >
          <TouchableOpacity
            style={[
              styles.emergencyButton,
              isEmergencyMode && styles.emergencyButtonActive,
            ]}
            onPress={handleEmergencyPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                isEmergencyMode
                  ? colors.gradient.emergency
                  : colors.gradient.primary
              }
              style={styles.emergencyButtonGradient}
            >
              <Text style={styles.emergencyButtonText}>
                {isEmergencyMode ? 'EMERGENCY' : 'EMERGENCY'}
              </Text>
              <Text style={styles.emergencyButtonSubtext}>
                {isEmergencyMode ? 'ACTIVE' : 'PRESS'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </GlowEffect>
      </Animated.View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Location' as never)}
        >
          <Text style={styles.actionButtonText}>📍 Location</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('VoiceRecognition' as never)}
        >
          <Text style={styles.actionButtonText}>🎤 Voice AI</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('HealthMonitor' as never)}
        >
          <Text style={styles.actionButtonText}>❤️ Health</Text>
        </TouchableOpacity>
      </View>

      {/* Health Data Display */}
      {healthData && (
        <View style={styles.healthDataContainer}>
          <Text style={styles.healthDataTitle}>Health Status</Text>
          <View style={styles.healthDataRow}>
            <Text style={styles.healthDataText}>
              Heart Rate: {healthData.heartRate} BPM
            </Text>
            <Text style={styles.healthDataText}>
              Temperature: {healthData.bodyTemperature.toFixed(1)}°C
            </Text>
          </View>
          <Text style={styles.healthDataText}>
            Stress Level: {healthData.stressLevel.toFixed(0)}%
          </Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Advanced AI-Powered Safety System
        </Text>
        <Text style={styles.footerSubtext}>
          Real-time monitoring • Satellite tracking • Emergency response
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundElement1: {
    position: 'absolute',
    top: 100,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  backgroundElement2: {
    position: 'absolute',
    bottom: 200,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.secondary,
    opacity: 0.1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  heartbeatContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emergencyButtonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emergencyButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  emergencyButtonActive: {
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 25,
  },
  emergencyButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  emergencyButtonSubtext: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    marginTop: 5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  healthDataContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  healthDataTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  healthDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  healthDataText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footerText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  footerSubtext: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default HomeScreen;