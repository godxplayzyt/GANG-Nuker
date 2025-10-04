/**
 * Women Safety App - Dev Roy
 * Advanced Women Safety Solution with AI-powered protection
 * Made in India for Worldwide Safety
 * Version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import our custom components
import MainScreen from './src/screens/MainScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HealthMonitorScreen from './src/screens/HealthMonitorScreen';
import LocationTrackerScreen from './src/screens/LocationTrackerScreen';

// Import services
import VoiceRecognitionService from './src/services/VoiceRecognitionService';
import HealthMonitoringService from './src/services/HealthMonitoringService';
import LocationService from './src/services/LocationService';
import EmergencyService from './src/services/EmergencyService';

import { APP_CONFIG, UI_CONFIG } from './src/constants';

const Stack = createStackNavigator();
const { width, height } = Dimensions.get('window');

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [waveAnim] = useState(new Animated.Value(0));
  const [isDarkMode] = useState(true);

  // Initialize services
  useEffect(() => {
    initializeApp();
  }, []);

  // Start beat animations
  useEffect(() => {
    startBeatAnimation();
    startWaveAnimation();
  }, []);

  const initializeApp = async () => {
    try {
      // Request permissions
      if (Platform.OS === 'android') {
        await requestPermissions();
      }

      // Initialize services
      await VoiceRecognitionService.initialize();
      await HealthMonitoringService.initialize();
      await LocationService.initialize();
      await EmergencyService.initialize();

      setIsAppReady(true);
    } catch (error) {
      console.error('App initialization error:', error);
      Alert.alert('Error', 'Failed to initialize app. Please restart.');
    }
  };

  const requestPermissions = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const allGranted = Object.values(granted).every(
        (result) => result === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        Alert.alert('Permissions Required', 'Please grant all permissions for full functionality');
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const startBeatAnimation = () => {
    Animated.loop(
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
    ).start();
  };

  const startWaveAnimation = () => {
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  };

  if (!isAppReady) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Text style={styles.appTitle}>{APP_CONFIG.NAME}</Text>
          <Text style={styles.versionText}>v{APP_CONFIG.VERSION}</Text>
          <Text style={styles.developerText}>by {APP_CONFIG.DEVELOPER}</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.loadingWave,
            {
              transform: [
                {
                  translateX: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-width, width],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={UI_CONFIG.BACKGROUND_COLOR}
      />
      <NavigationContainer>
        <View style={styles.container}>
          {/* Background beat animation overlay */}
          <Animated.View
            style={[
              styles.beatOverlay,
              {
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.2],
                  outputRange: [0.1, 0.3],
                }),
              },
            ]}
          />

          <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
              headerStyle: {
                backgroundColor: UI_CONFIG.BACKGROUND_COLOR,
              },
              headerTintColor: UI_CONFIG.TEXT_COLOR,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              cardStyle: {
                backgroundColor: UI_CONFIG.BACKGROUND_COLOR,
              },
            }}
          >
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ title: `${APP_CONFIG.NAME} - Safety Dashboard` }}
            />
            <Stack.Screen
              name="Emergency"
              component={EmergencyScreen}
              options={{ title: 'Emergency Center' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Safety Settings' }}
            />
            <Stack.Screen
              name="HealthMonitor"
              component={HealthMonitorScreen}
              options={{ title: 'Health Monitor' }}
            />
            <Stack.Screen
              name="LocationTracker"
              component={LocationTrackerScreen}
              options={{ title: 'Live Location Tracker' }}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.BACKGROUND_COLOR,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: UI_CONFIG.PRIMARY_COLOR,
    textAlign: 'center',
    marginBottom: 10,
  },
  versionText: {
    fontSize: 16,
    color: UI_CONFIG.TEXT_COLOR,
    textAlign: 'center',
    marginBottom: 5,
  },
  developerText: {
    fontSize: 14,
    color: UI_CONFIG.SECONDARY_COLOR,
    textAlign: 'center',
  },
  loadingWave: {
    position: 'absolute',
    bottom: 100,
    width: 4,
    height: 4,
    backgroundColor: UI_CONFIG.PRIMARY_COLOR,
    borderRadius: 2,
  },
  beatOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: UI_CONFIG.PRIMARY_COLOR,
    zIndex: -1,
  },
});

export default App;
