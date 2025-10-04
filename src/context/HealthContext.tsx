import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';

interface HealthData {
  heartRate: number;
  bodyTemperature: number;
  stressLevel: number;
  timestamp: number;
}

interface HealthContextType {
  healthData: HealthData | null;
  isMonitoring: boolean;
  isConnected: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  connectToDevice: (deviceId: string) => Promise<void>;
  disconnectDevice: () => void;
  availableDevices: Device[];
  scanForDevices: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

interface HealthProviderProps {
  children: ReactNode;
}

export const HealthProvider: React.FC<HealthProviderProps> = ({ children }) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
  const [manager] = useState(() => new BleManager());
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      console.log('BLE State:', state);
      if (state === 'PoweredOn') {
        scanForDevices();
      }
    }, true);

    return () => {
      subscription.remove();
      manager.destroy();
    };
  }, [manager]);

  const scanForDevices = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Scan error:', error);
        return;
      }

      if (device && device.name && device.name.includes('Watch')) {
        setAvailableDevices(prev => {
          const exists = prev.find(d => d.id === device.id);
          if (!exists) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      const device = await manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      
      setConnectedDevice(device);
      setIsConnected(true);
      
      // Start monitoring health data
      startHealthMonitoring(device);
      
      Alert.alert('Connected', 'Successfully connected to smartwatch');
    } catch (error) {
      console.log('Connection error:', error);
      Alert.alert('Connection Error', 'Failed to connect to device');
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
        setIsConnected(false);
        setIsMonitoring(false);
        setHealthData(null);
      } catch (error) {
        console.log('Disconnect error:', error);
      }
    }
  };

  const startHealthMonitoring = async (device: Device) => {
    try {
      // Heart Rate Service UUID
      const heartRateService = '0000180D-0000-1000-8000-00805F9B34FB';
      const heartRateCharacteristic = '00002A37-0000-1000-8000-00805F9B34FB';
      
      // Temperature Service UUID (custom)
      const temperatureService = '00001809-0000-1000-8000-00805F9B34FB';
      const temperatureCharacteristic = '00002A1C-0000-1000-8000-00805F9B34FB';

      setIsMonitoring(true);

      // Monitor heart rate
      device.monitorCharacteristicForService(
        heartRateService,
        heartRateCharacteristic,
        (error, characteristic) => {
          if (error) {
            console.log('Heart rate monitoring error:', error);
            return;
          }
          
          if (characteristic?.value) {
            const heartRate = characteristic.value[1]; // Heart rate is usually in the second byte
            updateHealthData({ heartRate });
          }
        }
      );

      // Monitor temperature
      device.monitorCharacteristicForService(
        temperatureService,
        temperatureCharacteristic,
        (error, characteristic) => {
          if (error) {
            console.log('Temperature monitoring error:', error);
            return;
          }
          
          if (characteristic?.value) {
            const temperature = characteristic.value[0] + (characteristic.value[1] / 100);
            updateHealthData({ bodyTemperature: temperature });
          }
        }
      );

    } catch (error) {
      console.log('Health monitoring error:', error);
      Alert.alert('Monitoring Error', 'Failed to start health monitoring');
    }
  };

  const updateHealthData = (newData: Partial<HealthData>) => {
    setHealthData(prev => {
      const updated = {
        ...prev,
        ...newData,
        timestamp: Date.now(),
      } as HealthData;

      // Calculate stress level based on heart rate and temperature
      const stressLevel = calculateStressLevel(updated.heartRate, updated.bodyTemperature);
      updated.stressLevel = stressLevel;

      // Check for emergency conditions
      if (stressLevel > 80 || updated.heartRate > 120 || updated.bodyTemperature > 38.5) {
        Alert.alert(
          'Health Alert!',
          'Abnormal health readings detected. Consider activating emergency mode.',
          [{ text: 'OK' }]
        );
      }

      return updated;
    });
  };

  const calculateStressLevel = (heartRate: number, temperature: number): number => {
    // Simple stress calculation based on heart rate and temperature
    const normalHeartRate = 70;
    const normalTemperature = 36.5;
    
    const heartRateStress = Math.max(0, (heartRate - normalHeartRate) / normalHeartRate * 100);
    const temperatureStress = Math.max(0, (temperature - normalTemperature) / normalTemperature * 100);
    
    return Math.min(heartRateStress + temperatureStress, 100);
  };

  const startMonitoring = () => {
    if (connectedDevice) {
      startHealthMonitoring(connectedDevice);
    } else {
      Alert.alert('No Device', 'Please connect to a smartwatch first');
    }
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setHealthData(null);
  };

  const value: HealthContextType = {
    healthData,
    isMonitoring,
    isConnected,
    startMonitoring,
    stopMonitoring,
    connectToDevice,
    disconnectDevice,
    availableDevices,
    scanForDevices,
  };

  return (
    <HealthContext.Provider value={value}>
      {children}
    </HealthContext.Provider>
  );
};