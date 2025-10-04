import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  shadow: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glowEffect: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  emergencyGlow: {
    shadowColor: colors.error,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 25,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    margin: 10,
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButton: {
    backgroundColor: colors.error,
    borderRadius: 50,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    color: colors.text,
    fontSize: 16,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  statusText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: 'bold',
  },
});