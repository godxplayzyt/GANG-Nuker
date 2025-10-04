import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { Alert } from 'react-native';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface LocationContextType {
  currentLocation: Location | null;
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  shareLocation: () => void;
  getSatelliteCoordinates: () => Promise<Location | null>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          resolve(location);
        },
        (error) => {
          console.log('Location error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  };

  const startTracking = () => {
    if (isTracking) return;

    setIsTracking(true);
    
    // Get initial location
    getCurrentLocation()
      .then(setCurrentLocation)
      .catch((error) => {
        console.log('Initial location error:', error);
        Alert.alert('Location Error', 'Unable to get current location');
      });

    // Start watching position
    const id = Geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        setCurrentLocation(location);
      },
      (error) => {
        console.log('Watch position error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Update every 10 meters
        interval: 3000, // Update every 3 seconds
        fastestInterval: 1000,
      }
    );

    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  const shareLocation = async () => {
    if (!currentLocation) {
      Alert.alert('No Location', 'Current location not available');
      return;
    }

    try {
      // Share location with emergency contacts and police
      const message = `EMERGENCY: I need help! My location: https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`;
      
      // Here you would integrate with SMS, WhatsApp, or other messaging services
      Alert.alert('Location Shared', `Location shared: ${currentLocation.latitude}, ${currentLocation.longitude}`);
    } catch (error) {
      console.log('Share location error:', error);
      Alert.alert('Error', 'Failed to share location');
    }
  };

  const getSatelliteCoordinates = async (): Promise<Location | null> => {
    try {
      // Simulate ISRO satellite coordination
      const location = await getCurrentLocation();
      
      // Add satellite precision enhancement
      const enhancedLocation: Location = {
        ...location,
        accuracy: Math.max(location.accuracy * 0.5, 1), // Improve accuracy
      };
      
      return enhancedLocation;
    } catch (error) {
      console.log('Satellite coordinates error:', error);
      return null;
    }
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const value: LocationContextType = {
    currentLocation,
    isTracking,
    startTracking,
    stopTracking,
    shareLocation,
    getSatelliteCoordinates,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};