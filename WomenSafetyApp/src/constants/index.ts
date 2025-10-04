import { ThreatPattern } from '../types';

// App Configuration
export const APP_CONFIG = {
  NAME: 'Women Safety App',
  VERSION: '1.0.0',
  DEVELOPER: 'Dev Roy',
  COUNTRY: 'India',
  DESCRIPTION: 'Advanced Women Safety Solution with AI-powered protection'
};

// Emergency Keywords and Patterns
export const EMERGENCY_KEYWORDS = [
  'help', 'rape', 'attack', 'danger', 'police', 'emergency',
  'save me', 'call police', '911', '100', 'madad', 'bachao',
  'threat', 'kill', 'die', 'murder', 'assault', 'violence'
];

export const THREAT_PATTERNS: ThreatPattern[] = [
  {
    id: '1',
    pattern: 'help.*police|police.*help',
    severity: 'high',
    keywords: ['help', 'police', 'emergency'],
    responses: ['Police emergency activated', 'Sending location to authorities']
  },
  {
    id: '2',
    pattern: 'attack|rape|assault',
    severity: 'critical',
    keywords: ['attack', 'rape', 'assault', 'violence'],
    responses: ['CRITICAL ALERT: Immediate danger detected', 'Emergency services notified']
  },
  {
    id: '3',
    pattern: 'kill|die|murder',
    severity: 'critical',
    keywords: ['kill', 'die', 'murder', 'death'],
    responses: ['CRITICAL THREAT: Life danger detected', 'All emergency contacts notified']
  },
  {
    id: '4',
    pattern: 'threat|danger|scared',
    severity: 'medium',
    keywords: ['threat', 'danger', 'scared', 'afraid'],
    responses: ['Potential threat detected', 'Monitoring situation']
  }
];

// Animation Constants
export const ANIMATION_CONFIG = {
  BEAT_ANIMATION_DURATION: 2000,
  PULSE_INTENSITY: 1.2,
  WAVE_SPEED: 0.8,
  BREATHE_CYCLE: 4000
};

// Health Monitoring Constants
export const HEALTH_THRESHOLDS = {
  HEART_RATE_MIN: 50,
  HEART_RATE_MAX: 200,
  HEART_RATE_DANGER_MIN: 40,
  HEART_RATE_DANGER_MAX: 220,
  TEMPERATURE_NORMAL_MIN: 35.0,
  TEMPERATURE_NORMAL_MAX: 37.5,
  TEMPERATURE_DANGER_MIN: 32.0,
  TEMPERATURE_DANGER_MAX: 40.0
};

// Location and GPS Constants
export const LOCATION_CONFIG = {
  UPDATE_INTERVAL: 3000, // 3 seconds
  FASTEST_INTERVAL: 2000,
  ACCURACY_HIGH: 10, // meters
  ACCURACY_MEDIUM: 50,
  DISTANCE_FILTER: 5 // meters
};

// Voice Recognition Constants
export const VOICE_CONFIG = {
  UPDATE_INTERVAL: 3000, // 3 seconds
  CONFIDENCE_THRESHOLD: 0.7,
  SILENCE_THRESHOLD: 2000, // 2 seconds
  MAX_AUDIO_DURATION: 10000 // 10 seconds
};

// Emergency Services
export const EMERGENCY_SERVICES = {
  POLICE_INDIA: '100',
  EMERGENCY_MEDICAL: '108',
  FIRE: '101',
  WOMEN_HELPLINE: '181',
  CHILD_HELPLINE: '1098'
};

// UI Constants
export const UI_CONFIG = {
  PRIMARY_COLOR: '#FF1744',
  SECONDARY_COLOR: '#2196F3',
  SUCCESS_COLOR: '#4CAF50',
  WARNING_COLOR: '#FF9800',
  DANGER_COLOR: '#F44336',
  BACKGROUND_COLOR: '#000000',
  TEXT_COLOR: '#FFFFFF',
  ACCENT_COLOR: '#9C27B0'
};

// ISRO Satellite Configuration (Mock for demo)
export const ISRO_CONFIG = {
  SATELLITE_API_BASE: 'https://isro-gps-tracking.herokuapp.com/api',
  UPDATE_INTERVAL: 5000,
  ACCURACY_LEVEL: 'high'
};

// Google AI Integration
export const GOOGLE_AI_CONFIG = {
  API_KEY: 'your_google_ai_api_key',
  MODEL: 'gemini-pro',
  TRACKING_MODEL: 'location-tracker-v2',
  CONFIDENCE_THRESHOLD: 0.85
};