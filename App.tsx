import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/styles/theme';
import HomeScreen from './src/screens/HomeScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LocationScreen from './src/screens/LocationScreen';
import VoiceRecognitionScreen from './src/screens/VoiceRecognitionScreen';
import HealthMonitorScreen from './src/screens/HealthMonitorScreen';
import { LocationProvider } from './src/context/LocationContext';
import { VoiceProvider } from './src/context/VoiceContext';
import { HealthProvider } from './src/context/HealthContext';
import { EmergencyProvider } from './src/context/EmergencyContext';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        ]);

        const allGranted = Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED
        );

        setPermissionsGranted(allGranted);
      } catch (err) {
        console.warn(err);
        Alert.alert('Permission Error', 'Some permissions were not granted');
      }
    } else {
      setPermissionsGranted(true);
    }
  };

  if (!permissionsGranted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Requesting permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <LocationProvider>
        <VoiceProvider>
          <HealthProvider>
            <EmergencyProvider>
              <NavigationContainer>
                <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
                <Stack.Navigator
                  initialRouteName="Home"
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: '#1a1a2e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <Stack.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{ title: 'Women Safety App' }}
                  />
                  <Stack.Screen 
                    name="Emergency" 
                    component={EmergencyScreen}
                    options={{ title: 'Emergency Mode' }}
                  />
                  <Stack.Screen 
                    name="Location" 
                    component={LocationScreen}
                    options={{ title: 'Live Location' }}
                  />
                  <Stack.Screen 
                    name="VoiceRecognition" 
                    component={VoiceRecognitionScreen}
                    options={{ title: 'AI Voice Recognition' }}
                  />
                  <Stack.Screen 
                    name="HealthMonitor" 
                    component={HealthMonitorScreen}
                    options={{ title: 'Health Monitor' }}
                  />
                  <Stack.Screen 
                    name="Settings" 
                    component={SettingsScreen}
                    options={{ title: 'Settings' }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </EmergencyProvider>
          </HealthProvider>
        </VoiceProvider>
      </LocationProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;