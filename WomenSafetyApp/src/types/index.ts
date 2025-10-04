// Women Safety App Types
export interface User {
  id: string;
  name: string;
  phone: string;
  emergencyContacts: EmergencyContact[];
  location: Location;
  isActive: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: number;
}

export interface HealthData {
  heartRate: number;
  temperature: number;
  timestamp: number;
  isNormal: boolean;
}

export interface VoiceAlert {
  id: string;
  type: 'threat' | 'help' | 'emergency';
  confidence: number;
  timestamp: number;
  location: Location;
}

export interface SafetyAlert {
  id: string;
  type: 'voice' | 'health' | 'location' | 'manual';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: Location;
  timestamp: number;
  isResolved: boolean;
}

export interface PoliceStation {
  id: string;
  name: string;
  phone: string;
  location: Location;
  distance: number;
}

export interface AppSettings {
  voiceRecognitionEnabled: boolean;
  healthMonitoringEnabled: boolean;
  locationTrackingEnabled: boolean;
  autoEmergencyCall: boolean;
  emergencyCallDelay: number; // in seconds
  voiceUpdateInterval: number; // in seconds
}

// Animation and UI Types
export interface BeatAnimation {
  id: string;
  type: 'pulse' | 'wave' | 'breathe';
  duration: number;
  intensity: number;
  color: string;
}

// AI and Recognition Types
export interface VoiceRecognitionResult {
  text: string;
  confidence: number;
  isThreat: boolean;
  threatLevel: 'none' | 'low' | 'medium' | 'high';
  timestamp: number;
}

export interface ThreatPattern {
  id: string;
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  keywords: string[];
  responses: string[];
}