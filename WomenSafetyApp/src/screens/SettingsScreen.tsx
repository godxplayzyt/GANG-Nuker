import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { User, EmergencyContact } from '../types';
import { UI_CONFIG, APP_CONFIG } from '../constants';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'Priya Sharma',
    phone: '+91 9876543210',
    emergencyContacts: [
      { id: '1', name: 'Mother', phone: '+91 9876543211', relationship: 'Family' },
      { id: '2', name: 'Brother', phone: '+91 9876543212', relationship: 'Family' },
    ],
    location: { latitude: 0, longitude: 0, timestamp: Date.now() },
    isActive: true,
  });

  const [settings, setSettings] = useState({
    voiceRecognition: true,
    healthMonitoring: true,
    locationTracking: true,
    autoEmergencyCall: false,
    emergencyCallDelay: 10,
    voiceUpdateInterval: 3,
    notifications: true,
    soundAlerts: true,
    vibrationAlerts: true,
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedPhone, setEditedPhone] = useState(user.phone);

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const saveProfile = () => {
    setUser(prev => ({
      ...prev,
      name: editedName,
      phone: editedPhone,
    }));
    setIsEditingProfile(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const addEmergencyContact = () => {
    Alert.prompt(
      'Add Emergency Contact',
      'Enter contact name:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Next',
          onPress: (name) => {
            if (name) {
              Alert.prompt(
                'Add Emergency Contact',
                'Enter phone number:',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Add',
                    onPress: (phone) => {
                      if (phone) {
                        const newContact: EmergencyContact = {
                          id: Date.now().toString(),
                          name,
                          phone,
                          relationship: 'Contact',
                        };
                        setUser(prev => ({
                          ...prev,
                          emergencyContacts: [...prev.emergencyContacts, newContact],
                        }));
                      }
                    },
                  },
                ]
              );
            }
          },
        },
      ]
    );
  };

  const removeEmergencyContact = (contactId: string) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setUser(prev => ({
              ...prev,
              emergencyContacts: prev.emergencyContacts.filter(c => c.id !== contactId),
            }));
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Safety Settings</Text>
        <Text style={styles.headerSubtitle}>Configure your safety preferences</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>

        {isEditingProfile ? (
          <View style={styles.editProfile}>
            <Text style={styles.inputLabel}>Name</Text>
            <Text style={styles.textInput}>{editedName}</Text>

            <Text style={styles.inputLabel}>Phone Number</Text>
            <Text style={styles.textInput}>{editedPhone}</Text>

            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setIsEditingProfile(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={saveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profilePhone}>{user.phone}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditingProfile(true)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={addEmergencyContact}
          >
            <Text style={styles.addButtonText}>+ Add Contact</Text>
          </TouchableOpacity>
        </View>

        {user.emergencyContacts.map((contact) => (
          <View key={contact.id} style={styles.contactItem}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
              <Text style={styles.contactRelation}>{contact.relationship}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeEmergencyContact(contact.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Safety Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Features</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Voice Recognition</Text>
            <Text style={styles.settingDescription}>AI-powered threat detection</Text>
          </View>
          <Switch
            value={settings.voiceRecognition}
            onValueChange={() => toggleSetting('voiceRecognition')}
            trackColor={{ false: '#767577', true: UI_CONFIG.PRIMARY_COLOR }}
            thumbColor={settings.voiceRecognition ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Health Monitoring</Text>
            <Text style={styles.settingDescription}>Heart rate & temperature tracking</Text>
          </View>
          <Switch
            value={settings.healthMonitoring}
            onValueChange={() => toggleSetting('healthMonitoring')}
            trackColor={{ false: '#767577', true: UI_CONFIG.PRIMARY_COLOR }}
            thumbColor={settings.healthMonitoring ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Live Location Tracking</Text>
            <Text style={styles.settingDescription}>Real-time GPS tracking</Text>
          </View>
          <Switch
            value={settings.locationTracking}
            onValueChange={() => toggleSetting('locationTracking')}
            trackColor={{ false: '#767577', true: UI_CONFIG.PRIMARY_COLOR }}
            thumbColor={settings.locationTracking ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Auto Emergency Call</Text>
            <Text style={styles.settingDescription}>Automatic emergency calls</Text>
          </View>
          <Switch
            value={settings.autoEmergencyCall}
            onValueChange={() => toggleSetting('autoEmergencyCall')}
            trackColor={{ false: '#767577', true: UI_CONFIG.PRIMARY_COLOR }}
            thumbColor={settings.autoEmergencyCall ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Alert Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Settings</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Receive safety alerts</Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={() => toggleSetting('notifications')}
            trackColor={{ false: '#767577', true: UI_CONFIG.PRIMARY_COLOR }}
            thumbColor={settings.notifications ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Sound Alerts</Text>
            <Text style={styles.settingDescription}>Audio notifications</Text>
          </View>
          <Switch
            value={settings.soundAlerts}
            onValueChange={() => toggleSetting('soundAlerts')}
            trackColor={{ false: '#767577', true: UI_CONFIG.PRIMARY_COLOR }}
            thumbColor={settings.soundAlerts ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Vibration Alerts</Text>
            <Text style={styles.settingDescription}>Haptic feedback</Text>
          </View>
          <Switch
            value={settings.vibrationAlerts}
            onValueChange={() => toggleSetting('vibrationAlerts')}
            trackColor={{ false: '#767577', true: UI_CONFIG.PRIMARY_COLOR }}
            thumbColor={settings.vibrationAlerts ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* App Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <View style={styles.appInfo}>
          <Text style={styles.infoItem}>App Name: {APP_CONFIG.NAME}</Text>
          <Text style={styles.infoItem}>Version: {APP_CONFIG.VERSION}</Text>
          <Text style={styles.infoItem}>Developer: {APP_CONFIG.DEVELOPER}</Text>
          <Text style={styles.infoItem}>Country: {APP_CONFIG.COUNTRY}</Text>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.BACKGROUND_COLOR,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: UI_CONFIG.PRIMARY_COLOR,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: UI_CONFIG.TEXT_COLOR,
    opacity: 0.7,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 15,
  },
  profileInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 5,
  },
  profilePhone: {
    fontSize: 16,
    color: UI_CONFIG.TEXT_COLOR,
    opacity: 0.7,
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: UI_CONFIG.SECONDARY_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  editButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
  editProfile: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 16,
    marginBottom: 15,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    borderRadius: 10,
    padding: 15,
    flex: 0.45,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: UI_CONFIG.TEXT_COLOR,
  },
  cancelButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: UI_CONFIG.SUCCESS_COLOR,
  },
  saveButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: UI_CONFIG.PRIMARY_COLOR,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: UI_CONFIG.TEXT_COLOR,
    opacity: 0.7,
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 12,
    color: UI_CONFIG.SECONDARY_COLOR,
  },
  removeButton: {
    backgroundColor: UI_CONFIG.DANGER_COLOR,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: UI_CONFIG.TEXT_COLOR,
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: UI_CONFIG.TEXT_COLOR,
    opacity: 0.6,
  },
  appInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
  },
  infoItem: {
    fontSize: 14,
    color: UI_CONFIG.TEXT_COLOR,
    marginBottom: 8,
  },
  bottomPadding: {
    height: 50,
  },
});

export default SettingsScreen;