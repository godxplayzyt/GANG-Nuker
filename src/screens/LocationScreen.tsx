import React, { useEffect, useRef, useState } from 'react';
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
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocation } from '../context/LocationContext';
import { useEmergency } from '../context/EmergencyContext';
import { colors } from '../styles/theme';
import GlowEffect from '../components/GlowEffect';
import HeartbeatAnimation from '../components/HeartbeatAnimation';

const LocationScreen: React.FC = () => {
  const {
    currentLocation,
    isTracking,
    startTracking,
    stopTracking,
    shareLocation,
    getSatelliteCoordinates,
  } = useLocation();

  const { shareLocationWithContacts } = useEmergency();

  const [satelliteLocation, setSatelliteLocation] = useState<any>(null);
  const [isSatelliteMode, setIsSatelliteMode] = useState(false);

  const mapRef = useRef<MapView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const satelliteAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for tracking status
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
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

    // Satellite animation
    const satelliteAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(satelliteAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(satelliteAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    if (isTracking) {
      pulseAnimation.start();
      satelliteAnimation.start();
    } else {
      pulseAnimation.stop();
      satelliteAnimation.stop();
    }

    return () => {
      pulseAnimation.stop();
      satelliteAnimation.stop();
    };
  }, [isTracking]);

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [currentLocation]);

  const handleToggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  const handleSatelliteMode = async () => {
    try {
      const satelliteCoords = await getSatelliteCoordinates();
      if (satelliteCoords) {
        setSatelliteLocation(satelliteCoords);
        setIsSatelliteMode(true);
        Alert.alert(
          'Satellite Mode Activated',
          'ISRO satellite coordinates obtained with enhanced precision.'
        );
      } else {
        Alert.alert('Error', 'Unable to get satellite coordinates');
      }
    } catch (error) {
      console.log('Satellite mode error:', error);
      Alert.alert('Error', 'Failed to activate satellite mode');
    }
  };

  const handleShareLocation = async () => {
    try {
      await shareLocation();
      await shareLocationWithContacts();
      Alert.alert('Location Shared', 'Your location has been shared with emergency contacts and police.');
    } catch (error) {
      console.log('Share location error:', error);
      Alert.alert('Error', 'Failed to share location');
    }
  };

  const satelliteOpacity = satelliteAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const satelliteScale = satelliteAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradient.background}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Live Location Tracking</Text>
        <Text style={styles.subtitle}>
          Real-time GPS with ISRO satellite coordination
        </Text>
      </View>

      {/* Status */}
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Tracking:</Text>
          <Animated.View
            style={[
              styles.statusIndicator,
              {
                backgroundColor: isTracking ? colors.success : colors.error,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <Text
            style={[
              styles.statusValue,
              { color: isTracking ? colors.success : colors.error },
            ]}
          >
            {isTracking ? 'Active' : 'Inactive'}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Satellite Mode:</Text>
          <Animated.View
            style={[
              styles.statusIndicator,
              {
                backgroundColor: isSatelliteMode ? colors.primary : colors.textSecondary,
                opacity: satelliteOpacity,
                transform: [{ scale: satelliteScale }],
              },
            ]}
          />
          <Text
            style={[
              styles.statusValue,
              { color: isSatelliteMode ? colors.primary : colors.textSecondary },
            ]}
          >
            {isSatelliteMode ? 'ISRO Active' : 'Standard GPS'}
          </Text>
        </View>

        {currentLocation && (
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Accuracy:</Text>
            <Text style={styles.statusValue}>
              {currentLocation.accuracy.toFixed(1)}m
            </Text>
          </View>
        )}
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {currentLocation ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
            mapType="hybrid"
          >
            {/* Current Location Marker */}
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Your Location"
              description={`Accuracy: ${currentLocation.accuracy.toFixed(1)}m`}
              pinColor={colors.primary}
            />

            {/* Satellite Enhanced Location Marker */}
            {satelliteLocation && (
              <Marker
                coordinate={{
                  latitude: satelliteLocation.latitude,
                  longitude: satelliteLocation.longitude,
                }}
                title="ISRO Satellite Location"
                description={`Enhanced accuracy: ${satelliteLocation.accuracy.toFixed(1)}m`}
                pinColor={colors.secondary}
              />
            )}
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>
              {isTracking ? 'Getting location...' : 'Location tracking inactive'}
            </Text>
          </View>
        )}
      </View>

      {/* Location Details */}
      {currentLocation && (
        <View style={styles.locationDetailsContainer}>
          <Text style={styles.locationDetailsTitle}>Location Details</Text>
          
          <View style={styles.locationRow}>
            <Text style={styles.locationLabel}>Latitude:</Text>
            <Text style={styles.locationValue}>
              {currentLocation.latitude.toFixed(6)}
            </Text>
          </View>
          
          <View style={styles.locationRow}>
            <Text style={styles.locationLabel}>Longitude:</Text>
            <Text style={styles.locationValue}>
              {currentLocation.longitude.toFixed(6)}
            </Text>
          </View>
          
          <View style={styles.locationRow}>
            <Text style={styles.locationLabel}>Accuracy:</Text>
            <Text style={styles.locationValue}>
              {currentLocation.accuracy.toFixed(1)} meters
            </Text>
          </View>
          
          <View style={styles.locationRow}>
            <Text style={styles.locationLabel}>Timestamp:</Text>
            <Text style={styles.locationValue}>
              {new Date(currentLocation.timestamp).toLocaleTimeString()}
            </Text>
          </View>

          {satelliteLocation && (
            <>
              <Text style={styles.satelliteTitle}>ISRO Satellite Enhancement</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationLabel}>Enhanced Accuracy:</Text>
                <Text style={styles.locationValue}>
                  {satelliteLocation.accuracy.toFixed(1)} meters
                </Text>
              </View>
            </>
          )}
        </View>
      )}

      {/* Heartbeat Animation */}
      <View style={styles.heartbeatContainer}>
        <HeartbeatAnimation
          isActive={isTracking && isSatelliteMode}
          size={80}
        />
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            isTracking ? styles.stopButton : styles.startButton,
          ]}
          onPress={handleToggleTracking}
        >
          <LinearGradient
            colors={
              isTracking
                ? colors.gradient.secondary
                : colors.gradient.primary
            }
            style={styles.controlButtonGradient}
          >
            <Text style={styles.controlButtonText}>
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.satelliteButton}
          onPress={handleSatelliteMode}
        >
          <LinearGradient
            colors={colors.gradient.primary}
            style={styles.satelliteButtonGradient}
          >
            <Text style={styles.satelliteButtonText}>
              {isSatelliteMode ? 'ISRO Active' : 'Activate ISRO'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareLocation}
        >
          <LinearGradient
            colors={colors.gradient.secondary}
            style={styles.shareButtonGradient}
          >
            <Text style={styles.shareButtonText}>Share Location</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          • Real-time GPS tracking with 3-second updates
        </Text>
        <Text style={styles.infoText}>
          • ISRO satellite coordination for enhanced precision
        </Text>
        <Text style={styles.infoText}>
          • Automatic location sharing with emergency contacts
        </Text>
        <Text style={styles.infoText}>
          • Google Maps integration for live tracking
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
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
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
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    color: colors.textSecondary,
    fontSize: 16,
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  mapContainer: {
    height: 250,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  mapPlaceholderText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  locationDetailsContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  locationDetailsTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  locationLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  locationValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  satelliteTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  heartbeatContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  controlButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 15,
  },
  startButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.success,
  },
  stopButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.error,
  },
  controlButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  controlButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  satelliteButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 15,
  },
  satelliteButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  satelliteButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  shareButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  shareButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 5,
  },
});

export default LocationScreen;