import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import VoiceRecognitionScreen from '../screens/VoiceRecognitionScreen';
import HealthMonitorScreen from '../screens/HealthMonitorScreen';
import LocationTrackerScreen from '../screens/LocationTrackerScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
  Main: undefined;
  Emergency: undefined;
  VoiceRecognition: undefined;
  HealthMonitor: undefined;
  LocationTracker: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Voice') {
            iconName = 'mic';
          } else if (route.name === 'Health') {
            iconName = 'favorite';
          } else if (route.name === 'Location') {
            iconName = 'location-on';
          } else {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff6b6b',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#16213e',
          borderTopColor: '#ff6b6b',
          borderTopWidth: 2,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Voice"
        component={VoiceRecognitionScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Health"
        component={HealthMonitorScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Location"
        component={LocationTrackerScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{
          title: 'Emergency Alert',
          headerStyle: {
            backgroundColor: '#ff4757',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;