import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useVoice } from '../context/VoiceContext';
import { useEmergency } from '../context/EmergencyContext';
import { colors } from '../styles/theme';
import GlowEffect from '../components/GlowEffect';
import HeartbeatAnimation from '../components/HeartbeatAnimation';

const VoiceRecognitionScreen: React.FC = () => {
  const {
    isListening,
    isRecognizing,
    recognizedText,
    confidence,
    startListening,
    stopListening,
    isEmergencyDetected,
    emergencyKeywords,
  } = useVoice();

  const { activateEmergencyMode } = useEmergency();

  const waveAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Wave animation for listening state
    const waveAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Text animation
    const textAnimation = Animated.timing(textAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    });

    if (isListening) {
      waveAnimation.start();
      textAnimation.start();
    } else {
      waveAnimation.stop();
      textAnim.setValue(0);
    }

    return () => {
      waveAnimation.stop();
    };
  }, [isListening]);

  useEffect(() => {
    if (isEmergencyDetected) {
      Alert.alert(
        'Emergency Detected!',
        'Emergency keywords detected in your speech. Would you like to activate emergency mode?',
        [
          {
            text: 'Activate Emergency',
            onPress: activateEmergencyMode,
            style: 'destructive',
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  }, [isEmergencyDetected]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const waveHeight1 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 30],
  });

  const waveHeight2 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 40],
  });

  const waveHeight3 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 35],
  });

  const textOpacity = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const textTranslateY = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradient.background}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AI Voice Recognition</Text>
        <Text style={styles.subtitle}>
          Advanced voice analysis with emergency detection
        </Text>
      </View>

      {/* Voice Visualizer */}
      <View style={styles.visualizerContainer}>
        <GlowEffect
          color={isListening ? colors.primary : colors.textSecondary}
          intensity={isListening ? 0.8 : 0.3}
        >
          <View style={styles.visualizer}>
            <Animated.View
              style={[
                styles.waveBar,
                { height: waveHeight1 },
                { backgroundColor: isListening ? colors.primary : colors.textSecondary },
              ]}
            />
            <Animated.View
              style={[
                styles.waveBar,
                { height: waveHeight2 },
                { backgroundColor: isListening ? colors.secondary : colors.textSecondary },
              ]}
            />
            <Animated.View
              style={[
                styles.waveBar,
                { height: waveHeight3 },
                { backgroundColor: isListening ? colors.primary : colors.textSecondary },
              ]}
            />
            <Animated.View
              style={[
                styles.waveBar,
                { height: waveHeight2 },
                { backgroundColor: isListening ? colors.secondary : colors.textSecondary },
              ]}
            />
            <Animated.View
              style={[
                styles.waveBar,
                { height: waveHeight1 },
                { backgroundColor: isListening ? colors.primary : colors.textSecondary },
              ]}
            />
          </View>
        </GlowEffect>
      </View>

      {/* Status */}
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text
            style={[
              styles.statusValue,
              {
                color: isListening
                  ? colors.success
                  : isRecognizing
                  ? colors.warning
                  : colors.textSecondary,
              },
            ]}
          >
            {isListening
              ? 'Listening'
              : isRecognizing
              ? 'Recognizing'
              : 'Stopped'}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Confidence:</Text>
          <Text style={styles.statusValue}>{confidence.toFixed(0)}%</Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Emergency:</Text>
          <Text
            style={[
              styles.statusValue,
              { color: isEmergencyDetected ? colors.error : colors.success },
            ]}
          >
            {isEmergencyDetected ? 'DETECTED' : 'Normal'}
          </Text>
        </View>
      </View>

      {/* Recognized Text */}
      {recognizedText && (
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.textLabel}>Recognized Text:</Text>
          <ScrollView style={styles.textScrollView}>
            <Text style={styles.recognizedText}>{recognizedText}</Text>
          </ScrollView>
        </Animated.View>
      )}

      {/* Emergency Keywords */}
      <View style={styles.keywordsContainer}>
        <Text style={styles.keywordsTitle}>Emergency Keywords:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.keywordsRow}>
            {emergencyKeywords.map((keyword, index) => (
              <View
                key={index}
                style={[
                  styles.keywordChip,
                  {
                    backgroundColor: recognizedText
                      ?.toLowerCase()
                      .includes(keyword.toLowerCase())
                      ? colors.error
                      : colors.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.keywordText,
                    {
                      color: recognizedText
                        ?.toLowerCase()
                        .includes(keyword.toLowerCase())
                        ? colors.text
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {keyword}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.toggleButton,
            isListening && styles.toggleButtonActive,
          ]}
          onPress={handleToggleListening}
        >
          <LinearGradient
            colors={
              isListening
                ? colors.gradient.secondary
                : colors.gradient.primary
            }
            style={styles.controlButtonGradient}
          >
            <Text style={styles.controlButtonText}>
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {isEmergencyDetected && (
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={activateEmergencyMode}
          >
            <LinearGradient
              colors={colors.gradient.emergency}
              style={styles.emergencyButtonGradient}
            >
              <Text style={styles.emergencyButtonText}>
                ACTIVATE EMERGENCY MODE
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Heartbeat Animation */}
      <View style={styles.heartbeatContainer}>
        <HeartbeatAnimation
          isActive={isEmergencyDetected}
          size={80}
        />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          • Voice recognition updates every 3 seconds
        </Text>
        <Text style={styles.infoText}>
          • AI filters false alarms automatically
        </Text>
        <Text style={styles.infoText}>
          • Emergency keywords trigger alerts
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
    paddingBottom: 30,
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
  visualizerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    paddingHorizontal: 20,
  },
  waveBar: {
    width: 8,
    marginHorizontal: 2,
    borderRadius: 4,
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
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  textLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textScrollView: {
    maxHeight: 100,
  },
  recognizedText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  keywordsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  keywordsTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  keywordsRow: {
    flexDirection: 'row',
  },
  keywordChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  keywordText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  controlsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  controlButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 15,
  },
  toggleButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  toggleButtonActive: {
    borderColor: colors.secondary,
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
  emergencyButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  emergencyButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  heartbeatContainer: {
    alignItems: 'center',
    marginBottom: 20,
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

export default VoiceRecognitionScreen;