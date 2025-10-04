import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useEmergency } from '../context/EmergencyContext';
import { useLocation } from '../context/LocationContext';
import { colors } from '../styles/theme';
import GlowEffect from '../components/GlowEffect';
import HeartbeatAnimation from '../components/HeartbeatAnimation';

const EmergencyScreen: React.FC = () => {
  const {
    emergencyContacts,
    isEmergencyMode,
    activateEmergencyMode,
    deactivateEmergencyMode,
    callPolice,
    sendEmergencySMS,
    shareLocationWithContacts,
  } = useEmergency();

  const { currentLocation, shareLocation } = useLocation();

  const emergencyAnim = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isEmergencyMode) {
      // Emergency pulse animation
      const emergencyAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(emergencyAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(emergencyAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );

      // Flash animation
      const flashAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(flashAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(flashAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ])
      );

      // Pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
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

      emergencyAnimation.start();
      flashAnimation.start();
      pulseAnimation.start();

      return () => {
        emergencyAnimation.stop();
        flashAnimation.stop();
        pulseAnimation.stop();
      };
    }
  }, [isEmergencyMode]);

  const handleActivateEmergency = () => {
    Alert.alert(
      'Activate Emergency Mode',
      'This will immediately contact police and emergency contacts. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Activate',
          onPress: activateEmergencyMode,
          style: 'destructive',
        },
      ]
    );
  };

  const handleCallPolice = () => {
    Alert.alert(
      'Call Police',
      'This will call the police emergency number (100). Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: callPolice,
          style: 'destructive',
        },
      ]
    );
  };

  const handleSendSMS = () => {
    Alert.alert(
      'Send Emergency SMS',
      'This will send an emergency message to all contacts. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send',
          onPress: sendEmergencySMS,
          style: 'destructive',
        },
      ]
    );
  };

  const handleShareLocation = async () => {
    try {
      await shareLocation();
      await shareLocationWithContacts();
      Alert.alert('Location Shared', 'Your location has been shared with emergency contacts.');
    } catch (error) {
      Alert.alert('Error', 'Failed to share location');
    }
  };

  const flashOpacity = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradient.background}
        style={styles.backgroundGradient}
      />

      {/* Emergency Flash Overlay */}
      {isEmergencyMode && (
        <Animated.View
          style={[
            styles.flashOverlay,
            {
              opacity: flashOpacity,
            },
          ]}
        />
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Mode</Text>
        <Text style={styles.subtitle}>
          {isEmergencyMode
            ? 'Emergency mode is ACTIVE'
            : 'Quick access to emergency services'}
        </Text>
      </View>

      {/* Emergency Status */}
      <View style={styles.statusContainer}>
        <Animated.View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: isEmergencyMode ? colors.error : colors.success,
              transform: [{ scale: emergencyAnim }],
            },
          ]}
        />
        <Text
          style={[
            styles.statusText,
            { color: isEmergencyMode ? colors.error : colors.success },
          ]}
        >
          {isEmergencyMode ? 'EMERGENCY ACTIVE' : 'System Normal'}
        </Text>
      </View>

      {/* Heartbeat Animation */}
      <View style={styles.heartbeatContainer}>
        <HeartbeatAnimation
          isActive={isEmergencyMode}
          size={120}
        />
      </View>

      {/* Main Emergency Button */}
      <View style={styles.mainButtonContainer}>
        <GlowEffect
          color={isEmergencyMode ? colors.error : colors.primary}
          intensity={isEmergencyMode ? 1 : 0.5}
        >
          <Animated.View
            style={[
              styles.mainButton,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.mainButtonTouchable}
              onPress={isEmergencyMode ? deactivateEmergencyMode : handleActivateEmergency}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isEmergencyMode
                    ? colors.gradient.emergency
                    : colors.gradient.primary
                }
                style={styles.mainButtonGradient}
              >
                <Text style={styles.mainButtonText}>
                  {isEmergencyMode ? 'DEACTIVATE' : 'EMERGENCY'}
                </Text>
                <Text style={styles.mainButtonSubtext}>
                  {isEmergencyMode ? 'EMERGENCY MODE' : 'ACTIVATE NOW'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </GlowEffect>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleCallPolice}
          >
            <LinearGradient
              colors={colors.gradient.secondary}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>🚔</Text>
              <Text style={styles.quickActionText}>Call Police</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleSendSMS}
          >
            <LinearGradient
              colors={colors.gradient.primary}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>📱</Text>
              <Text style={styles.quickActionText}>Send SMS</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleShareLocation}
          >
            <LinearGradient
              colors={colors.gradient.secondary}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>📍</Text>
              <Text style={styles.quickActionText}>Share Location</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => {
              // Navigate to contacts or add new emergency contact
              Alert.alert('Emergency Contacts', 'Manage your emergency contacts');
            }}
          >
            <LinearGradient
              colors={colors.gradient.primary}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>👥</Text>
              <Text style={styles.quickActionText}>Contacts</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.contactsContainer}>
        <Text style={styles.contactsTitle}>Emergency Contacts</Text>
        <ScrollView style={styles.contactsList}>
          {emergencyContacts.map((contact, index) => (
            <View key={contact.id} style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={styles.contactCallButton}
                  onPress={() => {
                    // Call contact
                    Alert.alert('Calling', `Calling ${contact.name}...`);
                  }}
                >
                  <Text style={styles.contactCallText}>📞</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.contactSmsButton}
                  onPress={() => {
                    // Send SMS to contact
                    Alert.alert('SMS', `Sending SMS to ${contact.name}...`);
                  }}
                >
                  <Text style={styles.contactSmsText}>💬</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Location Info */}
      {currentLocation && (
        <View style={styles.locationInfoContainer}>
          <Text style={styles.locationInfoTitle}>Current Location</Text>
          <Text style={styles.locationInfoText}>
            Lat: {currentLocation.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationInfoText}>
            Lng: {currentLocation.longitude.toFixed(6)}
          </Text>
          <Text style={styles.locationInfoText}>
            Accuracy: {currentLocation.accuracy.toFixed(1)}m
          </Text>
        </View>
      )}

      {/* Emergency Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Emergency Instructions</Text>
        <Text style={styles.instructionsText}>
          • Press the emergency button to activate emergency mode
        </Text>
        <Text style={styles.instructionsText}>
          • Your location will be automatically shared
        </Text>
        <Text style={styles.instructionsText}>
          • Police and emergency contacts will be notified
        </Text>
        <Text style={styles.instructionsText}>
          • Keep the app open for continuous monitoring
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
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.error,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    zIndex: 2,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    zIndex: 2,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  heartbeatContainer: {
    alignItems: 'center',
    marginBottom: 30,
    zIndex: 2,
  },
  mainButtonContainer: {
    alignItems: 'center',
    marginBottom: 30,
    zIndex: 2,
  },
  mainButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  mainButtonTouchable: {
    flex: 1,
  },
  mainButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  mainButtonSubtext: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    marginTop: 5,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    zIndex: 2,
  },
  quickActionsTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  quickActionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactsContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    zIndex: 2,
  },
  contactsTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  contactsList: {
    maxHeight: 200,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactPhone: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  contactActions: {
    flexDirection: 'row',
  },
  contactCallButton: {
    backgroundColor: colors.success,
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  contactCallText: {
    fontSize: 16,
  },
  contactSmsButton: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 20,
  },
  contactSmsText: {
    fontSize: 16,
  },
  locationInfoContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    zIndex: 2,
  },
  locationInfoTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  locationInfoText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    zIndex: 2,
  },
  instructionsTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionsText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 5,
  },
});

export default EmergencyScreen;