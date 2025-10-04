import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Location, SafetyAlert } from '../types';
import { UI_CONFIG, EMERGENCY_SERVICES } from '../constants';

const EmergencyScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState<Location>({
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'New Delhi, India',
    timestamp: Date.now(),
  });

  const [emergencyAlerts, setEmergencyAlerts] = useState<SafetyAlert[]>([
    {
      id: '1',
      type: 'voice',
      severity: 'critical',
      message: 'Voice threat detected: "Help, police!"',
      location: currentLocation,
      timestamp: Date.now() - 300000, // 5 minutes ago
      isResolved: false,
    },
  ]);

  const [pulseAnim] = useState(new Animated.Value(1));
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const callEmergencyService = async (number: string) => {
    try {
      const url = `tel:${number}`;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot call ${number}`);
      }
    } catch (error) {
      console.error('Call error:', error);
      Alert.alert('Error', 'Failed to make emergency call');
    }
  };

  const sendLocationToPolice = () => {
    Alert.alert(
      'Location Shared',
      `Your live location has been shared with police and emergency contacts.\n\nLocation: ${currentLocation.address}\nCoordinates: ${currentLocation.latitude}, ${currentLocation.longitude}`,
      [{ text: 'OK' }]
    );
  };

  const resolveAlert = (alertId: string) => {
    setEmergencyAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isResolved: true } : alert
      )
    );
  };

  const triggerAutoCall = () => {
    setCountdown(10);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          callEmergencyService(EMERGENCY_SERVICES.POLICE_INDIA);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.emergencyIcon,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Text style={styles.emergencyIconText}>🚨</Text>
        </Animated.View>
        <Text style={styles.headerTitle}>EMERGENCY CENTER</Text>
        <Text style={styles.headerSubtitle}>Immediate Response Active</Text>
      </View>

      {/* Active Alerts */}
      <View style={styles.alertsSection}>
        <Text style={styles.sectionTitle}>Active Alerts</Text>
        {emergencyAlerts.filter(alert => !alert.isResolved).map((alert) => (
          <View key={alert.id} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Text style={[styles.alertType, { color: UI_CONFIG.DANGER_COLOR }]}>
                {alert.type.toUpperCase()} ALERT
              </Text>
              <TouchableOpacity
                style={styles.resolveButton}
                onPress={() => resolveAlert(alert.id)}
              >
                <Text style={styles.resolveButtonText}>Resolve</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.alertMessage}>{alert.message}</Text>
            <Text style={styles.alertLocation}>
              📍 {alert.location.address}
            </Text>
            <Text style={styles.alertTime}>
              🕐 {new Date(alert.timestamp).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      {/* Emergency Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Emergency Actions</Text>

        <TouchableOpacity
          style={[styles.actionButton, styles.primaryAction]}
          onPress={sendLocationToPolice}
        >
          <Text style={styles.primaryActionText}>📍 Share Live Location</Text>
        </TouchableOpacity>

        <View style={styles.emergencyNumbers}>
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() => callEmergencyService(EMERGENCY_SERVICES.POLICE_INDIA)}
          >
            <Text style={styles.callButtonText}>📞 Call Police (100)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() => callEmergencyService(EMERGENCY_SERVICES.EMERGENCY_MEDICAL)}
          >
            <Text style={styles.callButtonText}>🏥 Medical Emergency (108)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() => callEmergencyService(EMERGENCY_SERVICES.WOMEN_HELPLINE)}
          >
            <Text style={styles.callButtonText}>👩 Women Helpline (181)</Text>
          </TouchableOpacity>
        </View>

        {/* Auto Emergency Call */}
        <TouchableOpacity
          style={[styles.actionButton, styles.autoCallButton]}
          onPress={triggerAutoCall}
        >
          <Text style={styles.autoCallButtonText}>
            ⏰ Auto Call in {countdown !== null ? `${countdown}s` : '10s'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Safety Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Safety Tips</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>• Stay in public areas if possible</Text>
          <Text style={styles.tipItem}>• Keep your phone charged and location on</Text>
          <Text style={styles.tipItem}>• Share your location with trusted contacts</Text>
          <Text style={styles.tipItem}>• Use the app's voice recognition feature</Text>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.bottomButton, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back to Safety</Text>
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
  emergencyIcon: {
    marginBottom: 15,
  },
  emergencyIconText: {
    fontSize: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: UI_CONFIG.DANGER_COLOR,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: UI_CONFIG.TEXT_COLOR,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.8,
  },
  alertsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 15,
  },
  alertCard: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: UI_CONFIG.DANGER_COLOR,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resolveButton: {
    backgroundColor: UI_CONFIG.SUCCESS_COLOR,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resolveButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertMessage: {
    fontSize: 16,
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 8,
  },
  alertLocation: {
    fontSize: 14,
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 4,
    opacity: 0.8,
  },
  alertTime: {
    fontSize: 12,
    color: UI_CONFIG.TEXT_COLOR,
    opacity: 0.6,
  },
  actionsSection: {
    marginBottom: 30,
  },
  actionButton: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 5,
  },
  primaryAction: {
    backgroundColor: UI_CONFIG.PRIMARY_COLOR,
  },
  primaryActionText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emergencyNumbers: {
    gap: 10,
  },
  callButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: UI_CONFIG.DANGER_COLOR,
  },
  callButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  autoCallButton: {
    backgroundColor: UI_CONFIG.WARNING_COLOR,
    marginTop: 10,
  },
  autoCallButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
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
  bottomActions: {
    marginTop: 'auto',
  },
  bottomButton: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: UI_CONFIG.SECONDARY_COLOR,
  },
  backButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EmergencyScreen;