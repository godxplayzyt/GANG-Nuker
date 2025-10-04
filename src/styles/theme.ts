import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00d4ff',
    accent: '#ff6b6b',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    placeholder: '#8e8e93',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

export const colors = {
  primary: '#00d4ff',
  secondary: '#ff6b6b',
  background: '#0f0f23',
  surface: '#1a1a2e',
  surfaceLight: '#2a2a3e',
  text: '#ffffff',
  textSecondary: '#8e8e93',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  gradient: {
    primary: ['#00d4ff', '#0099cc'],
    secondary: ['#ff6b6b', '#ff4757'],
    background: ['#0f0f23', '#1a1a2e'],
    emergency: ['#ff4757', '#ff3742'],
  },
};

export const animations = {
  heartbeat: {
    duration: 1000,
    scale: 1.1,
  },
  pulse: {
    duration: 2000,
    opacity: 0.3,
  },
  glow: {
    duration: 3000,
    shadowOpacity: 0.8,
  },
};