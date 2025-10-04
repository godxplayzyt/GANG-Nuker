import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from 'react-native-voice';
import { Alert } from 'react-native';

interface VoiceContextType {
  isListening: boolean;
  isRecognizing: boolean;
  recognizedText: string;
  confidence: number;
  startListening: () => void;
  stopListening: () => void;
  isEmergencyDetected: boolean;
  emergencyKeywords: string[];
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

interface VoiceProviderProps {
  children: ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isEmergencyDetected, setIsEmergencyDetected] = useState(false);
  
  const emergencyKeywords = [
    'help', 'emergency', 'danger', 'threat', 'attack', 'rape', 'assault',
    'police', 'rescue', 'save', 'dangerous', 'scared', 'frightened',
    'stop', 'no', 'don\'t', 'leave', 'alone', 'unsafe', 'fear'
  ];

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: any) => {
    console.log('Speech started:', e);
    setIsRecognizing(true);
  };

  const onSpeechRecognized = (e: any) => {
    console.log('Speech recognized:', e);
    setIsRecognizing(false);
  };

  const onSpeechEnd = (e: any) => {
    console.log('Speech ended:', e);
    setIsListening(false);
    setIsRecognizing(false);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log('Speech error:', e);
    setIsListening(false);
    setIsRecognizing(false);
    
    if (e.error?.code === '7') {
      // Network error - retry
      setTimeout(() => {
        startListening();
      }, 1000);
    }
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('Speech results:', e);
    if (e.value && e.value.length > 0) {
      const text = e.value[0];
      setRecognizedText(text);
      
      // Calculate confidence based on text length and emergency keywords
      const confidenceScore = calculateConfidence(text);
      setConfidence(confidenceScore);
      
      // Check for emergency keywords
      const emergencyDetected = checkForEmergencyKeywords(text);
      setIsEmergencyDetected(emergencyDetected);
      
      if (emergencyDetected) {
        Alert.alert(
          'Emergency Detected!',
          'Emergency keywords detected in speech. Activating emergency mode.',
          [{ text: 'OK', onPress: () => {} }]
        );
      }
    }
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log('Partial results:', e);
    if (e.value && e.value.length > 0) {
      const text = e.value[0];
      setRecognizedText(text);
      
      const emergencyDetected = checkForEmergencyKeywords(text);
      setIsEmergencyDetected(emergencyDetected);
    }
  };

  const calculateConfidence = (text: string): number => {
    const words = text.toLowerCase().split(' ');
    const emergencyWordCount = words.filter(word => 
      emergencyKeywords.some(keyword => word.includes(keyword))
    ).length;
    
    const baseConfidence = Math.min(text.length / 50, 1) * 100;
    const emergencyBoost = emergencyWordCount * 20;
    
    return Math.min(baseConfidence + emergencyBoost, 100);
  };

  const checkForEmergencyKeywords = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return emergencyKeywords.some(keyword => lowerText.includes(keyword));
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      setIsEmergencyDetected(false);
      setRecognizedText('');
      setConfidence(0);
      
      await Voice.start('en-US', {
        RECOGNIZER_ENGINE: 'GOOGLE',
        EXTRA_PARTIAL_RESULTS: true,
        EXTRA_LANGUAGE_MODEL: 'LANGUAGE_MODEL_FREE_FORM',
        EXTRA_MAX_RESULTS: 5,
        EXTRA_CONFIDENCE_SCORES: true,
      });
    } catch (error) {
      console.log('Start listening error:', error);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
      setIsRecognizing(false);
    } catch (error) {
      console.log('Stop listening error:', error);
    }
  };

  // Auto-restart listening every 3 seconds if stopped
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isListening && !isRecognizing) {
      interval = setInterval(() => {
        startListening();
      }, 3000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isListening, isRecognizing]);

  const value: VoiceContextType = {
    isListening,
    isRecognizing,
    recognizedText,
    confidence,
    startListening,
    stopListening,
    isEmergencyDetected,
    emergencyKeywords,
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};