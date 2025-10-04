import { Alert, Linking, Platform } from 'react-native';

/**
 * Format timestamp to readable time string
 */
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString();
};

/**
 * Format timestamp to readable date and time string
 */
export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return Math.round(distance * 1000); // Return distance in meters
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Check if a coordinate is within a specified radius
 */
export const isWithinRadius = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radiusMeters: number
): boolean => {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= radiusMeters;
};

/**
 * Generate a random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

/**
 * Debounce function to limit function calls
 */
export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function to limit function calls
 */
export const throttle = (func: Function, delay: number) => {
  let inThrottle: boolean;
  return (...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), delay);
    }
  };
};

/**
 * Validate phone number format
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate string to specified length
 */
export const truncate = (str: string, length: number): string => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

/**
 * Make a phone call
 */
export const makePhoneCall = async (phoneNumber: string): Promise<void> => {
  try {
    const url = `tel:${phoneNumber}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', `Cannot call ${phoneNumber}`);
    }
  } catch (error) {
    console.error('Phone call error:', error);
    Alert.alert('Error', 'Failed to make phone call');
  }
};

/**
 * Send SMS
 */
export const sendSMS = async (phoneNumber: string, message: string): Promise<void> => {
  try {
    const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', `Cannot send SMS to ${phoneNumber}`);
    }
  } catch (error) {
    console.error('SMS error:', error);
    Alert.alert('Error', 'Failed to send SMS');
  }
};

/**
 * Get battery level (mock for demo)
 */
export const getBatteryLevel = async (): Promise<number> => {
  // In production, use react-native-device-info or similar
  return Math.floor(Math.random() * 100) + 1;
};

/**
 * Get network status (mock for demo)
 */
export const getNetworkStatus = (): 'wifi' | 'cellular' | 'none' => {
  // In production, use NetInfo from @react-native-community/netinfo
  const statuses: Array<'wifi' | 'cellular' | 'none'> = ['wifi', 'cellular', 'none'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

/**
 * Format duration in milliseconds to readable string
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Generate random color
 */
export const randomColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if value is empty
 */
export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Sleep function for delays
 */
export const sleep = (milliseconds: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};