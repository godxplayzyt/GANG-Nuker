import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import VoiceRecognitionScreen from './src/screens/VoiceRecognitionScreen';
import HealthMonitorScreen from './src/screens/HealthMonitorScreen';
import LocationTrackerScreen from './src/screens/LocationTrackerScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import navigation
import AppNavigator from './src/navigation/AppNavigator';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});

export default App;