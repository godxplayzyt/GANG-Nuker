import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useHealth } from '../context/HealthContext';
import { useEmergency } from '../context/EmergencyContext';
import { colors } from '../styles/theme';
import GlowEffect from '../components/GlowEffect';
import HeartbeatAnimation from '../components/HeartbeatAnimation';

const HealthMonitorScreen: React.FC = () => {
  const {
    healthData,
    isMonitoring,
    isConnected,
    startMonitoring,
    stopMonitoring,
    connectToDevice,
    disconnectDevice,
    availableDevices,
    scanForDevices,
  } = useHealth();

  const { activateEmergencyMode } = useEmergency();

  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const tempAnim = useRef(new Animated.Value(0)).current;
  const stressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (healthData) {
      // Heart rate pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: (60 / healthData.heartRate) * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: (60 / healthData.heartRate) * 1000,
            useNativeDriver: true,
          }),
        ])
      );

      // Temperature animation
      const tempAnimation = Animated.timing(tempAnim, {
        toValue: healthData.bodyTemperature / 40, // Normalize to 0-1
        duration: 1000,
        useNativeDriver: false,
      });

      // Stress level animation
      const stressAnimation = Animated.timing(stressAnim, {
        toValue: healthData.stressLevel / 100,
        duration: 1000,
        useNativeDriver: false,
      });

      pulseAnimation.start();
      tempAnimation.start();
      stressAnimation.start();

      // Check for emergency conditions
      if (
        healthData.stressLevel > 80 ||
        healthData.heartRate > 120 ||
        healthData.bodyTemperature > 38.5
      ) {
        Alert.alert(
          'Health Alert!',
          'Abnormal health readings detected. Would you like to activate emergency mode?',
          [
            {
              text: 'Activate Emergency',
              onPress: activateEmergencyMode,
              style: 'destructive',
            },
            {
              text: 'Continue Monitoring',
              style: 'cancel',
            },
          ]
        );
      }

      return () => {
        pulseAnimation.stop();
      };
    }
  }, [healthData]);

  const handleConnectDevice = async (deviceId: string) => {
    setSelectedDevice(deviceId);
    await connectToDevice(deviceId);
  };

  const handleDisconnectDevice = async () => {
    await disconnectDevice();
    setSelectedDevice(null);
  };

  const getHealthStatus = () => {
    if (!healthData) return 'Unknown';
    
    if (healthData.stressLevel > 80 || healthData.heartRate > 120) {
      return 'Critical';
    } else if (healthData.stressLevel > 60 || healthData.heartRate > 100) {
      return 'Warning';
    } else {
      return 'Normal';
    }
  };

  const getHealthColor = () => {
    const status = getHealthStatus();
    switch (status) {
      case 'Critical':
        return colors.error;
      case 'Warning':
        return colors.warning;
      default:
        return colors.success;
    }
  };

  const tempColor = tempAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [colors.primary, colors.warning, colors.error],
  });

  const stressColor = stressAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [colors.success, colors.warning, colors.error],
  });

  const renderDevice = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.deviceItem,
        selectedDevice === item.id && styles.deviceItemSelected,
      ]}
      onPress={() => handleConnectDevice(item.id)}
    >
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradient.background}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Monitor</Text>
        <Text style={styles.subtitle}>
          Smartwatch integration with real-time monitoring
        </Text>
      </View>

      {/* Connection Status */}
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Connection:</Text>
          <Text
            style={[
              styles.statusValue,
              { color: isConnected ? colors.success : colors.error },
            ]}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Monitoring:</Text>
          <Text
            style={[
              styles.statusValue,
              { color: isMonitoring ? colors.success : colors.textSecondary },
            ]}
          >
            {isMonitoring ? 'Active' : 'Inactive'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Health Status:</Text>
          <Text
            style={[
              styles.statusValue,
              { color: getHealthColor() },
            ]}
          >
            {getHealthStatus()}
          </Text>
        </View>
      </View>

      {/* Available Devices */}
      <View style={styles.devicesContainer}>
        <View style={styles.devicesHeader}>
          <Text style={styles.devicesTitle}>Available Devices</Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={scanForDevices}
          >
            <Text style={styles.scanButtonText}>Scan</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={availableDevices}
          renderItem={renderDevice}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.devicesList}
        />
      </View>

      {/* Health Data Display */}
      {healthData && (
        <View style={styles.healthDataContainer}>
          <Text style={styles.healthDataTitle}>Current Health Data</Text>
          
          {/* Heart Rate */}
          <View style={styles.healthMetric}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Heart Rate</Text>
              <Animated.View
                style={[
                  styles.metricIndicator,
                  {
                    backgroundColor: colors.primary,
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
            </View>
            <Text style={styles.metricValue}>{healthData.heartRate} BPM</Text>
            <View style={styles.metricBar}>
              <View
                style={[
                  styles.metricBarFill,
                  {
                    width: `${Math.min((healthData.heartRate / 120) * 100, 100)}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          </View>

          {/* Body Temperature */}
          <View style={styles.healthMetric}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Body Temperature</Text>
              <Animated.View
                style={[
                  styles.metricIndicator,
                  {
                    backgroundColor: tempColor,
                  },
                ]}
              />
            </View>
            <Text style={styles.metricValue}>
              {healthData.bodyTemperature.toFixed(1)}°C
            </Text>
            <View style={styles.metricBar}>
              <Animated.View
                style={[
                  styles.metricBarFill,
                  {
                    width: `${(healthData.bodyTemperature / 40) * 100}%`,
                    backgroundColor: tempColor,
                  },
                ]}
              />
            </View>
          </View>

          {/* Stress Level */}
          <View style={styles.healthMetric}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Stress Level</Text>
              <Animated.View
                style={[
                  styles.metricIndicator,
                  {
                    backgroundColor: stressColor,
                  },
                ]}
              />
            </View>
            <Text style={styles.metricValue}>
              {healthData.stressLevel.toFixed(0)}%
            </Text>
            <View style={styles.metricBar}>
              <Animated.View
                style={[
                  styles.metricBarFill,
                  {
                    width: `${healthData.stressLevel}%`,
                    backgroundColor: stressColor,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      {/* Heartbeat Animation */}
      <View style={styles.heartbeatContainer}>
        <HeartbeatAnimation
          isActive={getHealthStatus() === 'Critical'}
          size={100}
        />
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        {isConnected ? (
          <View style={styles.connectedControls}>
            <TouchableOpacity
              style={[
                styles.controlButton,
                isMonitoring ? styles.stopButton : styles.startButton,
              ]}
              onPress={isMonitoring ? stopMonitoring : startMonitoring}
            >
              <LinearGradient
                colors={
                  isMonitoring
                    ? colors.gradient.secondary
                    : colors.gradient.primary
                }
                style={styles.controlButtonGradient}
              >
                <Text style={styles.controlButtonText}>
                  {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={handleDisconnectDevice}
            >
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.disconnectedControls}>
            <Text style={styles.disconnectedText}>
              Connect to a smartwatch to start monitoring
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          • Monitors heart rate, body temperature, and stress levels
        </Text>
        <Text style={styles.infoText}>
          • Automatically detects emergency health conditions
        </Text>
        <Text style={styles.infoText}>
          • Real-time data updates every second
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
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusLabel: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  devicesContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  devicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  devicesTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  scanButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  devicesList: {
    maxHeight: 80,
  },
  deviceItem: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    minWidth: 120,
  },
  deviceItemSelected: {
    borderColor: colors.success,
    backgroundColor: colors.surfaceLight,
  },
  deviceName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  deviceId: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  healthDataContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  healthDataTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  healthMetric: {
    marginBottom: 20,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  metricValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  metricBar: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  heartbeatContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  connectedControls: {
    alignItems: 'center',
  },
  controlButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 15,
    width: '100%',
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
  disconnectButton: {
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  disconnectButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  disconnectedControls: {
    alignItems: 'center',
  },
  disconnectedText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
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

export default HealthMonitorScreen;