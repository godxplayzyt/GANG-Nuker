import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import RNPhoneCall from 'react-native-phone-call';
import RNContacts from 'react-native-contacts';
import RNSms from 'react-native-sms';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  isPrimary: boolean;
}

interface EmergencyContextType {
  emergencyContacts: EmergencyContact[];
  isEmergencyMode: boolean;
  activateEmergencyMode: () => void;
  deactivateEmergencyMode: () => void;
  callPolice: () => void;
  sendEmergencySMS: () => void;
  shareLocationWithContacts: () => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;
  loadContacts: () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};

interface EmergencyProviderProps {
  children: ReactNode;
}

export const EmergencyProvider: React.FC<EmergencyProviderProps> = ({ children }) => {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const contacts = await RNContacts.getAll();
      const emergencyContacts = contacts
        .filter(contact => contact.phoneNumbers.length > 0)
        .slice(0, 5) // Limit to 5 contacts
        .map((contact, index) => ({
          id: contact.recordID || index.toString(),
          name: contact.displayName || 'Unknown',
          phone: contact.phoneNumbers[0].number,
          isPrimary: index === 0,
        }));
      
      setEmergencyContacts(emergencyContacts);
    } catch (error) {
      console.log('Load contacts error:', error);
    }
  };

  const activateEmergencyMode = () => {
    setIsEmergencyMode(true);
    
    // Start emergency sequence
    Alert.alert(
      'EMERGENCY MODE ACTIVATED',
      'Emergency mode is now active. Your location will be shared and contacts will be notified.',
      [
        {
          text: 'Call Police',
          onPress: callPolice,
          style: 'destructive',
        },
        {
          text: 'Send SMS',
          onPress: sendEmergencySMS,
        },
        {
          text: 'Cancel',
          onPress: deactivateEmergencyMode,
          style: 'cancel',
        },
      ]
    );

    // Auto-call police after 10 seconds if not cancelled
    setTimeout(() => {
      if (isEmergencyMode) {
        callPolice();
      }
    }, 10000);
  };

  const deactivateEmergencyMode = () => {
    setIsEmergencyMode(false);
    Alert.alert('Emergency Mode Deactivated', 'Emergency mode has been turned off.');
  };

  const callPolice = async () => {
    try {
      const policeNumber = '100'; // Indian police emergency number
      
      if (Platform.OS === 'android') {
        await RNPhoneCall.makeCall({
          number: policeNumber,
          prompt: false,
        });
      } else {
        await Linking.openURL(`tel:${policeNumber}`);
      }
      
      Alert.alert('Calling Police', 'Connecting to police emergency line...');
    } catch (error) {
      console.log('Call police error:', error);
      Alert.alert('Call Failed', 'Unable to call police. Please try again.');
    }
  };

  const sendEmergencySMS = async () => {
    try {
      const message = 'EMERGENCY: I need immediate help! Please call me or contact police.';
      
      const recipients = emergencyContacts.map(contact => contact.phone);
      
      await RNSms.send({
        body: message,
        recipients: recipients,
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true,
      });
      
      Alert.alert('SMS Sent', 'Emergency SMS sent to all contacts.');
    } catch (error) {
      console.log('SMS error:', error);
      Alert.alert('SMS Failed', 'Unable to send emergency SMS.');
    }
  };

  const shareLocationWithContacts = async () => {
    try {
      // This would integrate with location context to get current location
      const locationMessage = 'EMERGENCY: My current location is being shared. Please help!';
      
      const recipients = emergencyContacts.map(contact => contact.phone);
      
      await RNSms.send({
        body: locationMessage,
        recipients: recipients,
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true,
      });
      
      Alert.alert('Location Shared', 'Your location has been shared with emergency contacts.');
    } catch (error) {
      console.log('Location sharing error:', error);
      Alert.alert('Sharing Failed', 'Unable to share location.');
    }
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString(),
    };
    
    setEmergencyContacts(prev => [...prev, newContact]);
  };

  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const value: EmergencyContextType = {
    emergencyContacts,
    isEmergencyMode,
    activateEmergencyMode,
    deactivateEmergencyMode,
    callPolice,
    sendEmergencySMS,
    shareLocationWithContacts,
    addEmergencyContact,
    removeEmergencyContact,
    loadContacts,
  };

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
};