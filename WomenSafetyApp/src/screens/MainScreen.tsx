import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  User,
  Location,
  HealthData,
  SafetyAlert,
  VoiceRecognitionResult,
} from '../types';
import { UI_CONFIG, APP_CONFIG } from '../constants';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Main: undefined;
  Emergency: undefined;
  Settings: undefined;
  HealthMonitor: undefined;
  LocationTracker: undefined;
};

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const MainScreen: React.FC = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'User',
    phone: '+91XXXXXXXXXX',
    emergencyContacts: [],
    location: {
      latitude: 0,
      longitude: 0,
      timestamp: Date.now(),
    },
    isActive: true,
  });

  const [currentLocation, setCurrentLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
    timestamp: Date.now(),
  });

  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 75,
    temperature: 36.5,
    timestamp: Date.now(),
    isNormal: true,
  });

  const [voiceStatus, setVoiceStatus] = useState<string>('Listening...');
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [waveAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    startAnimations();
    initializeServices();
  }, []);

  const startAnimations = () => {
    // Pulse animation for safety indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave animation for location indicator
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  };

  const initializeServices = async () => {
    // Initialize location tracking
    // Initialize voice recognition
    // Initialize health monitoring
    // These would be actual service calls in production
  };

  const handleEmergencyButton = () => {
    Alert.alert(
      'Emergency Alert',
      'Are you sure you want to trigger emergency response?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'YES, EMERGENCY!', style: 'destructive', onPress: triggerEmergency },
      ]
    );
  };

  const triggerEmergency = () => {
    // Trigger emergency response
    const emergencyAlert: SafetyAlert = {
      id: Date.now().toString(),
      type: 'manual',
      severity: 'critical',
      message: 'Manual emergency trigger',
      location: currentLocation,
      timestamp: Date.now(),
      isResolved: false,
    };

    setSafetyAlerts(prev => [emergencyAlert, ...prev]);
    navigation.navigate('Emergency');
  };

  const getStatusColor = () => {
    if (safetyAlerts.length > 0 && safetyAlerts[0].severity === 'critical') {
      return UI_CONFIG.DANGER_COLOR;
    }
    return healthData.isNormal ? UI_CONFIG.SUCCESS_COLOR : UI_CONFIG.WARNING_COLOR;
  };

  const getStatusText = () => {
    if (safetyAlerts.length > 0) {
      return `${safetyAlerts.length} Active Alert${safetyAlerts.length > 1 ? 's' : ''}`;
    }
    return healthData.isNormal ? 'Safe & Protected' : 'Health Warning';
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>{APP_CONFIG.NAME}</Text>
        <Text style={styles.tagline}>Made in India • Worldwide Safety</Text>
      </View>

      {/* Status Dashboard */}
      <View style={styles.dashboard}>
        {/* Safety Status Card */}
        <Animated.View
          style={[
            styles.statusCard,
            {
              borderColor: getStatusColor(),
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.statusIndicator}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor() },
              ]}
            />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.emergencyButton]}
            onPress={handleEmergencyButton}
          >
            <Text style={styles.emergencyButtonText}>🚨 EMERGENCY</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('LocationTracker')}
            >
              <Text style={styles.actionButtonText}>📍 Live Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('HealthMonitor')}
            >
              <Text style={styles.actionButtonText}>💓 Health Monitor</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Real-time Monitoring */}
        <View style={styles.monitoringSection}>
          <Text style={styles.sectionTitle}>Real-time Monitoring</Text>

          <View style={styles.monitoringGrid}>
            {/* Voice Recognition Status */}
            <View style={styles.monitorCard}>
              <Text style={styles.monitorTitle}>Voice Recognition</Text>
              <Text style={[styles.monitorValue, { color: UI_CONFIG.SECONDARY_COLOR }]}>
                {voiceStatus}
              </Text>
            </View>

            {/* Location Status */}
            <Animated.View style={styles.monitorCard}>
              <Text style={styles.monitorTitle}>Live Location</Text>
              <Text style={[styles.monitorValue, { color: UI_CONFIG.SUCCESS_COLOR }]}>
                Active
              </Text>
              <Animated.View
                style={[
                  styles.waveIndicator,
                  {
                    transform: [
                      {
                        scale: waveAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1.2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </Animated.View>

            {/* Health Status */}
            <View style={styles.monitorCard}>
              <Text style={styles.monitorTitle}>Health Status</Text>
              <Text style={[styles.monitorValue, { color: healthData.isNormal ? UI_CONFIG.SUCCESS_COLOR : UI_CONFIG.WARNING_COLOR }]}>
                {healthData.isNormal ? 'Normal' : 'Check Required'}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Alerts */}
        {safetyAlerts.length > 0 && (
          <View style={styles.alertsSection}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            {safetyAlerts.slice(0, 3).map((alert) => (
              <View key={alert.id} style={styles.alertItem}>
                <Text style={[styles.alertText, { color: UI_CONFIG.DANGER_COLOR }]}>
                  {alert.message}
                </Text>
                <Text style={styles.alertTime}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.navText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.BACKGROUND_COLOR,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: UI_CONFIG.PRIMARY_COLOR,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    color: UI_CONFIG.TEXT_COLOR,
    marginTop: 5,
    opacity: 0.8,
  },
  dashboard: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 2,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickActions: {
    marginBottom: 30,
  },
  emergencyButton: {
    backgroundColor: UI_CONFIG.DANGER_COLOR,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 8,
    shadowColor: UI_CONFIG.DANGER_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emergencyButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    flex: 0.48,
    elevation: 4,
  },
  actionButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  monitoringSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 15,
  },
  monitoringGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  monitorCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    position: 'relative',
  },
  monitorTitle: {
    fontSize: 14,
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 8,
    opacity: 0.7,
  },
  monitorValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  waveIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    backgroundColor: UI_CONFIG.SUCCESS_COLOR,
    borderRadius: 4,
  },
  alertsSection: {
    flex: 1,
  },
  alertItem: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: UI_CONFIG.DANGER_COLOR,
  },
  alertText: {
    fontSize: 14,
    marginBottom: 5,
  },
  alertTime: {
    fontSize: 12,
    color: UI_CONFIG.TEXT_COLOR,
    opacity: 0.6,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navItem: {
    padding: 10,
  },
  navText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 14,
  },
});

export default MainScreen;