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

import { HealthData } from '../types';
import { UI_CONFIG, HEALTH_THRESHOLDS } from '../constants';

const { width } = Dimensions.get('window');

const HealthMonitorScreen: React.FC = () => {
  const navigation = useNavigation();
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 75,
    temperature: 36.5,
    timestamp: Date.now(),
    isNormal: true,
  });

  const [isConnected, setIsConnected] = useState(true);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [heartAnim] = useState(new Animated.Value(1));
  const [tempAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    startAnimations();
    simulateHealthData();
  }, []);

  const startAnimations = () => {
    // Heart pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(heartAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Temperature animation (slower)
    Animated.loop(
      Animated.sequence([
        Animated.timing(tempAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(tempAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const simulateHealthData = () => {
    // Simulate real-time health data updates
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 10;
      const newHeartRate = Math.max(60, Math.min(100, 75 + variation));
      const newTemp = Math.max(35.5, Math.min(37.5, 36.5 + variation * 0.1));

      const isNormal =
        newHeartRate >= HEALTH_THRESHOLDS.HEART_RATE_MIN &&
        newHeartRate <= HEALTH_THRESHOLDS.HEART_RATE_MAX &&
        newTemp >= HEALTH_THRESHOLDS.TEMPERATURE_NORMAL_MIN &&
        newTemp <= HEALTH_THRESHOLDS.TEMPERATURE_NORMAL_MAX;

      setHealthData({
        heartRate: Math.round(newHeartRate),
        temperature: Math.round(newTemp * 10) / 10,
        timestamp: Date.now(),
        isNormal,
      });

      // Alert if abnormal readings
      if (!isNormal) {
        Alert.alert(
          'Health Alert',
          `Abnormal readings detected:\nHeart Rate: ${Math.round(newHeartRate)} bpm\nTemperature: ${Math.round(newTemp * 10) / 10}°C`,
          [{ text: 'OK' }]
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  };

  const getHeartRateColor = () => {
    if (healthData.heartRate < HEALTH_THRESHOLDS.HEART_RATE_MIN ||
        healthData.heartRate > HEALTH_THRESHOLDS.HEART_RATE_MAX) {
      return UI_CONFIG.DANGER_COLOR;
    }
    if (healthData.heartRate < 60 || healthData.heartRate > 90) {
      return UI_CONFIG.WARNING_COLOR;
    }
    return UI_CONFIG.SUCCESS_COLOR;
  };

  const getTemperatureColor = () => {
    if (healthData.temperature < HEALTH_THRESHOLDS.TEMPERATURE_NORMAL_MIN ||
        healthData.temperature > HEALTH_THRESHOLDS.TEMPERATURE_NORMAL_MAX) {
      return UI_CONFIG.DANGER_COLOR;
    }
    return UI_CONFIG.SUCCESS_COLOR;
  };

  const connectDevice = () => {
    setIsConnected(!isConnected);
    Alert.alert(
      'Device Connection',
      isConnected ? 'Disconnected from smartwatch' : 'Connected to smartwatch'
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Monitor</Text>
        <Text style={styles.headerSubtitle}>
          Real-time heart rate & temperature tracking
        </Text>
      </View>

      {/* Connection Status */}
      <View style={styles.connectionSection}>
        <TouchableOpacity
          style={[
            styles.connectButton,
            { backgroundColor: isConnected ? UI_CONFIG.SUCCESS_COLOR : UI_CONFIG.WARNING_COLOR }
          ]}
          onPress={connectDevice}
        >
          <Text style={styles.connectButtonText}>
            {isConnected ? '🔗 Connected' : '🔌 Connect Device'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.connectionStatus}>
          {isConnected ? 'Smartwatch connected and monitoring' : 'No device connected'}
        </Text>
      </View>

      {/* Health Metrics */}
      <View style={styles.metricsSection}>
        {/* Heart Rate */}
        <Animated.View
          style={[
            styles.metricCard,
            {
              transform: [{ scale: heartAnim }],
              borderColor: getHeartRateColor(),
            },
          ]}
        >
          <View style={styles.metricIcon}>
            <Text style={styles.metricIconText}>💓</Text>
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Heart Rate</Text>
            <Text style={[styles.metricValue, { color: getHeartRateColor() }]}>
              {healthData.heartRate} bpm
            </Text>
            <Text style={styles.metricStatus}>
              {healthData.heartRate >= 60 && healthData.heartRate <= 100 ? 'Normal' : 'Check Required'}
            </Text>
          </View>
        </Animated.View>

        {/* Temperature */}
        <Animated.View
          style={[
            styles.metricCard,
            {
              transform: [{ scale: tempAnim }],
              borderColor: getTemperatureColor(),
            },
          ]}
        >
          <View style={styles.metricIcon}>
            <Text style={styles.metricIconText}>🌡️</Text>
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Body Temperature</Text>
            <Text style={[styles.metricValue, { color: getTemperatureColor() }]}>
              {healthData.temperature}°C
            </Text>
            <Text style={styles.metricStatus}>
              {healthData.temperature >= 35.5 && healthData.temperature <= 37.5 ? 'Normal' : 'Check Required'}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Health Status */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Overall Health Status</Text>
        <View
          style={[
            styles.statusCard,
            { borderColor: healthData.isNormal ? UI_CONFIG.SUCCESS_COLOR : UI_CONFIG.DANGER_COLOR }
          ]}
        >
          <Text style={[styles.statusText, { color: healthData.isNormal ? UI_CONFIG.SUCCESS_COLOR : UI_CONFIG.DANGER_COLOR }]}>
            {healthData.isNormal ? '✅ All readings normal' : '⚠️ Abnormal readings detected'}
          </Text>
          <Text style={styles.statusTime}>
            Last updated: {new Date(healthData.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>

      {/* Health Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Health Monitoring Tips</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>• Wear your smartwatch snugly for accurate readings</Text>
          <Text style={styles.tipItem}>• Stay hydrated for better temperature readings</Text>
          <Text style={styles.tipItem}>• Regular exercise helps maintain normal heart rate</Text>
          <Text style={styles.tipItem}>• Consult a doctor if readings are consistently abnormal</Text>
        </View>
      </View>

      {/* Emergency Actions */}
      {!healthData.isNormal && (
        <View style={styles.emergencySection}>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => navigation.navigate('Emergency')}
          >
            <Text style={styles.emergencyButtonText}>🚨 Health Emergency</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.navText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>📊 History</Text>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: UI_CONFIG.PRIMARY_COLOR,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: UI_CONFIG.TEXT_COLOR,
    textAlign: 'center',
    opacity: 0.7,
  },
  connectionSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  connectButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  connectButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectionStatus: {
    fontSize: 14,
    color: UI_CONFIG.TEXT_COLOR,
    opacity: 0.7,
    textAlign: 'center',
  },
  metricsSection: {
    marginBottom: 30,
  },
  metricCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 2,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  metricIconText: {
    fontSize: 30,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 16,
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 5,
    opacity: 0.7,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metricStatus: {
    fontSize: 14,
    opacity: 0.8,
  },
  statusSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 15,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    borderWidth: 2,
    padding: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusTime: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
  tipsSection: {
    flex: 1,
  },
  tipsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
  },
  tipItem: {
    fontSize: 14,
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 10,
    lineHeight: 20,
  },
  emergencySection: {
    marginBottom: 20,
  },
  emergencyButton: {
    backgroundColor: UI_CONFIG.DANGER_COLOR,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navItem: {
    padding: 10,
  },
  navText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 16,
  },
});

export default HealthMonitorScreen;