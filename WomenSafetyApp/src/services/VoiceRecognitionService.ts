import { VoiceRecognitionResult, ThreatPattern } from '../types';
import { VOICE_CONFIG, THREAT_PATTERNS, EMERGENCY_KEYWORDS } from '../constants';

class VoiceRecognitionService {
  private isListening: boolean = false;
  private recognition: any = null;
  private onResultCallback?: (result: VoiceRecognitionResult) => void;
  private updateInterval: NodeJS.Timeout | null = null;

  async initialize(): Promise<void> {
    try {
      // Initialize voice recognition (using Web Speech API for demo)
      // In production, this would use native speech recognition APIs
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-IN'; // Indian English

        this.recognition.onresult = (event: any) => {
          this.handleVoiceResult(event);
        };

        this.recognition.onerror = (error: any) => {
          console.error('Voice recognition error:', error);
        };

        this.recognition.onend = () => {
          if (this.isListening) {
            // Restart recognition if it stopped unexpectedly
            setTimeout(() => {
              if (this.isListening) {
                this.startListening();
              }
            }, 1000);
          }
        };
      } else {
        console.warn('Speech recognition not supported in this browser');
      }

      // Start periodic updates
      this.startPeriodicUpdates();
    } catch (error) {
      console.error('Failed to initialize voice recognition:', error);
      throw error;
    }
  }

  startListening(): void {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
        console.log('Voice recognition started');
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
      }
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
        console.log('Voice recognition stopped');
      } catch (error) {
        console.error('Failed to stop voice recognition:', error);
      }
    }
  }

  private handleVoiceResult(event: any): void {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      const confidence = event.results[i][0].confidence;

      if (event.results[i].isFinal) {
        this.processFinalResult(transcript, confidence);
      }
    }
  }

  private processFinalResult(transcript: string, confidence: number): void {
    const result: VoiceRecognitionResult = {
      text: transcript,
      confidence,
      isThreat: this.detectThreat(transcript),
      threatLevel: this.getThreatLevel(transcript),
      timestamp: Date.now(),
    };

    // Call the callback if set
    if (this.onResultCallback) {
      this.onResultCallback(result);
    }

    // Handle threat detection
    if (result.isThreat) {
      this.handleThreatDetected(result);
    }
  }

  private detectThreat(text: string): boolean {
    const lowerText = text.toLowerCase();

    // Check for emergency keywords
    const hasEmergencyKeyword = EMERGENCY_KEYWORDS.some(keyword =>
      lowerText.includes(keyword.toLowerCase())
    );

    // Check threat patterns
    const matchesThreatPattern = THREAT_PATTERNS.some(pattern =>
      new RegExp(pattern.pattern, 'i').test(lowerText)
    );

    return hasEmergencyKeyword || matchesThreatPattern;
  }

  private getThreatLevel(text: string): 'none' | 'low' | 'medium' | 'high' {
    const lowerText = text.toLowerCase();

    for (const pattern of THREAT_PATTERNS) {
      if (new RegExp(pattern.pattern, 'i').test(lowerText)) {
        switch (pattern.severity) {
          case 'low': return 'low';
          case 'medium': return 'medium';
          case 'high': return 'high';
          case 'critical': return 'high';
        }
      }
    }

    return 'none';
  }

  private handleThreatDetected(result: VoiceRecognitionResult): void {
    console.log('Threat detected:', result);

    // Here you would trigger emergency protocols
    // - Send alerts to emergency contacts
    // - Notify police
    // - Activate location sharing
    // - Trigger emergency response

    // For demo purposes, we'll just log it
    if (result.threatLevel === 'high') {
      console.log('HIGH THREAT DETECTED - EMERGENCY RESPONSE TRIGGERED');
    }
  }

  private startPeriodicUpdates(): void {
    this.updateInterval = setInterval(() => {
      if (this.isListening) {
        // Send periodic status updates
        const statusResult: VoiceRecognitionResult = {
          text: 'Voice monitoring active',
          confidence: 1.0,
          isThreat: false,
          threatLevel: 'none',
          timestamp: Date.now(),
        };

        if (this.onResultCallback) {
          this.onResultCallback(statusResult);
        }
      }
    }, VOICE_CONFIG.UPDATE_INTERVAL);
  }

  onResult(callback: (result: VoiceRecognitionResult) => void): void {
    this.onResultCallback = callback;
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  cleanup(): void {
    this.stopListening();
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.onResultCallback = undefined;
  }
}

// Singleton instance
const voiceRecognitionService = new VoiceRecognitionService();
export default voiceRecognitionService;