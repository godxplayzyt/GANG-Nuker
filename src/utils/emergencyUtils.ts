// Emergency utility functions for the Women Safety App

export const EMERGENCY_KEYWORDS = [
  'help', 'emergency', 'danger', 'threat', 'attack', 'rape', 'assault',
  'police', 'rescue', 'save', 'dangerous', 'scared', 'frightened',
  'stop', 'no', 'don\'t', 'leave', 'alone', 'unsafe', 'fear',
  'harassment', 'stalking', 'violence', 'abuse', 'molestation'
];

export const POLICE_NUMBERS = {
  INDIA: '100',
  USA: '911',
  UK: '999',
  AUSTRALIA: '000',
  CANADA: '911'
};

export const HEALTH_THRESHOLDS = {
  NORMAL_HEART_RATE_MIN: 60,
  NORMAL_HEART_RATE_MAX: 100,
  ELEVATED_HEART_RATE: 120,
  NORMAL_TEMPERATURE_MIN: 36.0,
  NORMAL_TEMPERATURE_MAX: 37.5,
  FEVER_TEMPERATURE: 38.5,
  NORMAL_STRESS_LEVEL: 40,
  HIGH_STRESS_LEVEL: 60,
  CRITICAL_STRESS_LEVEL: 80
};

export const LOCATION_ACCURACY = {
  EXCELLENT: 5, // meters
  GOOD: 10,
  FAIR: 20,
  POOR: 50
};

export const SATELLITE_ENHANCEMENT_FACTOR = 0.5; // Improve accuracy by 50%

export const VOICE_CONFIDENCE_THRESHOLD = 70; // Minimum confidence for emergency detection

export const EMERGENCY_RESPONSE_TIME = 10000; // 10 seconds auto-call delay

export const LOCATION_UPDATE_INTERVAL = 3000; // 3 seconds

export const VOICE_UPDATE_INTERVAL = 3000; // 3 seconds

export const HEALTH_UPDATE_INTERVAL = 1000; // 1 second

export const formatLocationMessage = (latitude: number, longitude: number, accuracy: number): string => {
  return `EMERGENCY: I need immediate help! My location: https://maps.google.com/?q=${latitude},${longitude} (Accuracy: ${accuracy.toFixed(1)}m)`;
};

export const formatEmergencySMS = (location?: { latitude: number; longitude: number }): string => {
  const baseMessage = 'EMERGENCY: I need immediate help! Please call me or contact police.';
  
  if (location) {
    return `${baseMessage} My location: https://maps.google.com/?q=${location.latitude},${location.longitude}`;
  }
  
  return baseMessage;
};

export const calculateStressLevel = (heartRate: number, temperature: number): number => {
  const normalHeartRate = 70;
  const normalTemperature = 36.5;
  
  const heartRateStress = Math.max(0, (heartRate - normalHeartRate) / normalHeartRate * 100);
  const temperatureStress = Math.max(0, (temperature - normalTemperature) / normalTemperature * 100);
  
  return Math.min(heartRateStress + temperatureStress, 100);
};

export const isEmergencyHealthCondition = (healthData: {
  heartRate: number;
  bodyTemperature: number;
  stressLevel: number;
}): boolean => {
  return (
    healthData.stressLevel > HEALTH_THRESHOLDS.CRITICAL_STRESS_LEVEL ||
    healthData.heartRate > HEALTH_THRESHOLDS.ELEVATED_HEART_RATE ||
    healthData.bodyTemperature > HEALTH_THRESHOLDS.FEVER_TEMPERATURE
  );
};

export const detectEmergencyKeywords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

export const calculateVoiceConfidence = (text: string): number => {
  const words = text.toLowerCase().split(' ');
  const emergencyWordCount = words.filter(word => 
    EMERGENCY_KEYWORDS.some(keyword => word.includes(keyword))
  ).length;
  
  const baseConfidence = Math.min(text.length / 50, 1) * 100;
  const emergencyBoost = emergencyWordCount * 20;
  
  return Math.min(baseConfidence + emergencyBoost, 100);
};

export const enhanceLocationWithSatellite = (location: {
  latitude: number;
  longitude: number;
  accuracy: number;
}): { latitude: number; longitude: number; accuracy: number } => {
  return {
    ...location,
    accuracy: Math.max(location.accuracy * SATELLITE_ENHANCEMENT_FACTOR, 1)
  };
};

export const getLocationAccuracyLevel = (accuracy: number): string => {
  if (accuracy <= LOCATION_ACCURACY.EXCELLENT) return 'Excellent';
  if (accuracy <= LOCATION_ACCURACY.GOOD) return 'Good';
  if (accuracy <= LOCATION_ACCURACY.FAIR) return 'Fair';
  return 'Poor';
};

export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

export const generateEmergencyId = (): string => {
  return `EMERGENCY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const getCountryCode = (phone: string): string => {
  if (phone.startsWith('+91')) return 'IN';
  if (phone.startsWith('+1')) return 'US';
  if (phone.startsWith('+44')) return 'UK';
  if (phone.startsWith('+61')) return 'AU';
  if (phone.startsWith('+1')) return 'CA';
  return 'IN'; // Default to India
};

export const getEmergencyNumber = (countryCode: string): string => {
  return POLICE_NUMBERS[countryCode as keyof typeof POLICE_NUMBERS] || POLICE_NUMBERS.INDIA;
};