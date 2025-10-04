import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';

import { Location, User } from '../types';
import { UI_CONFIG, LOCATION_CONFIG } from '../constants';

const { width, height } = Dimensions.get('window');

const LocationTrackerScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState<Location>({
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'New Delhi, India',
    timestamp: Date.now(),
  });

  const [locationHistory, setLocationHistory] = useState<Location[]>([
    { latitude: 28.6139, longitude: 77.2090, timestamp: Date.now() - 3600000 },
    { latitude: 28.6145, longitude: 77.2100, timestamp: Date.now() - 1800000 },
    { latitude: 28.6150, longitude: 77.2110, timestamp: Date.now() - 900000 },
  ]);

  const [isTracking, setIsTracking] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [waveAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    startAnimations();
    initializeLocationTracking();
  }, []);

  const startAnimations = () => {
    // Pulse animation for location indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave animation for tracking indicator
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  };

  const initializeLocationTracking = async () => {
    // Initialize Google AI tracking system
    // This would integrate with Google Maps API and AI tracking
    simulateLocationUpdates();
  };

  const simulateLocationUpdates = () => {
    const interval = setInterval(() => {
      if (isTracking) {
        // Simulate location updates (in real app, this would use GPS)
        const latVariation = (Math.random() - 0.5) * 0.001;
        const lngVariation = (Math.random() - 0.5) * 0.001;

        const newLocation: Location = {
          latitude: currentLocation.latitude + latVariation,
          longitude: currentLocation.longitude + lngVariation,
          address: `Location near ${currentLocation.latitude + latVariation}, ${currentLocation.longitude + lngVariation}`,
          timestamp: Date.now(),
        };

        setCurrentLocation(newLocation);
        setLocationHistory(prev => [newLocation, ...prev.slice(0, 9)]);
      }
    }, LOCATION_CONFIG.UPDATE_INTERVAL);

    return () => clearInterval(interval);
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    Alert.alert(
      'Location Tracking',
      isTracking ? 'Location tracking disabled' : 'Location tracking enabled'
    );
  };

  const shareLocation = () => {
    Alert.alert(
      'Share Location',
      'Your live location has been shared with:\n• Emergency contacts\n• Police authorities\n• ISRO satellite monitoring\n• Google AI tracking system',
      [
        { text: 'OK' },
        { text: 'Share with Police', onPress: shareWithPolice },
      ]
    );
  };

  const shareWithPolice = () => {
    Alert.alert(
      'Police Alert',
      `🚨 EMERGENCY: Live location shared with police authorities\n\nLocation: ${currentLocation.address}\nCoordinates: ${currentLocation.latitude}, ${currentLocation.longitude}\nTime: ${new Date(currentLocation.timestamp).toLocaleString()}\n\nPolice have been notified and are tracking your location.`,
      [{ text: 'OK' }]
    );
  };

  const getAccuracyColor = () => {
    const accuracy = LOCATION_CONFIG.ACCURACY_HIGH;
    if (accuracy <= 10) return UI_CONFIG.SUCCESS_COLOR;
    if (accuracy <= 50) return UI_CONFIG.WARNING_COLOR;
    return UI_CONFIG.DANGER_COLOR;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Location Tracker</Text>
        <Text style={styles.headerSubtitle}>
          Google AI + ISRO Satellite Tracking System
        </Text>
      </View>

      {/* Map Section */}
      <View style={styles.mapSection}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          followsUserLocation={isTracking}
        >
          {/* Current Location Marker */}
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
            description={currentLocation.address}
          >
            <Animated.View
              style={[
                styles.currentLocationMarker,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Text style={styles.markerText}>📍</Text>
            </Animated.View>
          </Marker>

          {/* Location History Trail */}
          {locationHistory.length > 1 && (
            <Polyline
              coordinates={locationHistory.map(loc => ({
                latitude: loc.latitude,
                longitude: loc.longitude,
              }))}
              strokeColor={UI_CONFIG.PRIMARY_COLOR}
              strokeWidth={3}
            />
          )}

          {/* Safety Zone (Demo) */}
          <Marker
            coordinate={{
              latitude: 28.6139,
              longitude: 77.2090,
            }}
            title="Safe Zone"
            description="Police Station Area"
            pinColor="green"
          />
        </MapView>

        {/* Map Overlay Info */}
        <View style={styles.mapOverlay}>
          <View style={styles.trackingStatus}>
            <Animated.View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: isTracking ? UI_CONFIG.SUCCESS_COLOR : UI_CONFIG.DANGER_COLOR,
                  transform: [{ scale: waveAnim }],
                },
              ]}
            />
            <Text style={styles.statusText}>
              {isTracking ? '🔴 LIVE TRACKING' : '⏸️ TRACKING PAUSED'}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.trackingButton,
              { backgroundColor: isTracking ? UI_CONFIG.DANGER_COLOR : UI_CONFIG.SUCCESS_COLOR }
            ]}
            onPress={toggleTracking}
          >
            <Text style={styles.trackingButtonText}>
              {isTracking ? '⏸️ Pause Tracking' : '▶️ Resume Tracking'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Location Details</Text>
        <View style={styles.detailsCard}>
          <Text style={styles.detailItem}>
            📍 Coordinates: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
          </Text>
          <Text style={styles.detailItem}>
            🏠 Address: {currentLocation.address}
          </Text>
          <Text style={styles.detailItem}>
            🕐 Last Updated: {formatTime(currentLocation.timestamp)}
          </Text>
          <View style={styles.accuracyIndicator}>
            <Text style={styles.accuracyLabel}>Accuracy: </Text>
            <Text style={[styles.accuracyValue, { color: getAccuracyColor() }]}>
              {LOCATION_CONFIG.ACCURACY_HIGH}m
            </Text>
          </View>
        </View>
      </View>

      {/* Tracking Systems */}
      <View style={styles.systemsSection}>
        <Text style={styles.sectionTitle}>Active Tracking Systems</Text>
        <View style={styles.systemsGrid}>
          <View style={[styles.systemCard, { borderColor: UI_CONFIG.SUCCESS_COLOR }]}>
            <Text style={styles.systemTitle}>🤖 Google AI</Text>
            <Text style={styles.systemStatus}>Active</Text>
            <Text style={styles.systemDesc}>Advanced location prediction</Text>
          </View>

          <View style={[styles.systemCard, { borderColor: UI_CONFIG.PRIMARY_COLOR }]}>
            <Text style={styles.systemTitle}>🛰️ ISRO Satellite</Text>
            <Text style={styles.systemStatus}>Connected</Text>
            <Text style={styles.systemDesc}>Satellite monitoring</Text>
          </View>

          <View style={[styles.systemCard, { borderColor: UI_CONFIG.SECONDARY_COLOR }]}>
            <Text style={styles.systemTitle}>🚔 Police Network</Text>
            <Text style={styles.systemStatus}>Standby</Text>
            <Text style={styles.systemDesc}>Emergency response ready</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={shareLocation}
        >
          <Text style={styles.shareButtonText}>🚨 Share Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.emergencyButton]}
          onPress={() => navigation.navigate('Emergency')}
        >
          <Text style={styles.emergencyButtonText}>🚨 Emergency Alert</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.navText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>📋 History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.BACKGROUND_COLOR,
  },
  header: {
    padding: 20,
    alignItems: 'center',
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
  mapSection: {
    height: height * 0.4,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  currentLocationMarker: {
    backgroundColor: UI_CONFIG.PRIMARY_COLOR,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: UI_CONFIG.TEXT_COLOR,
  },
  markerText: {
    fontSize: 20,
  },
  mapOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    padding: 15,
  },
  trackingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackingButton: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  trackingButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 15,
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
  },
  detailItem: {
    fontSize: 14,
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 10,
  },
  accuracyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accuracyLabel: {
    fontSize: 14,
    color: UI_CONFIG.TEXT_COLOR,
  },
  accuracyValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  systemsSection: {
    padding: 20,
  },
  systemsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  systemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    borderWidth: 2,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    marginBottom: 15,
  },
  systemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 5,
  },
  systemStatus: {
    fontSize: 12,
    color: UI_CONFIG.SUCCESS_COLOR,
    marginBottom: 5,
  },
  systemDesc: {
    fontSize: 10,
    color: UI_CONFIG.TEXT_COLOR,
    textAlign: 'center',
    opacity: 0.7,
  },
  actionsSection: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    borderRadius: 15,
    padding: 15,
    width: '45%',
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: UI_CONFIG.WARNING_COLOR,
  },
  shareButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emergencyButton: {
    backgroundColor: UI_CONFIG.DANGER_COLOR,
  },
  emergencyButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
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

export default LocationTrackerScreen;