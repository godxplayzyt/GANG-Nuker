import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useEmergency } from '../context/EmergencyContext';
import { colors } from '../styles/theme';

const SettingsScreen: React.FC = () => {
  const { addEmergencyContact, removeEmergencyContact, emergencyContacts } = useEmergency();
  
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [voiceRecognitionEnabled, setVoiceRecognitionEnabled] = useState(true);
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(true);
  const [healthMonitoringEnabled, setHealthMonitoringEnabled] = useState(true);
  const [emergencyAutoCall, setEmergencyAutoCall] = useState(true);
  const [satelliteModeEnabled, setSatelliteModeEnabled] = useState(false);

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert('Error', 'Please enter both name and phone number');
      return;
    }

    addEmergencyContact({
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      isPrimary: emergencyContacts.length === 0,
    });

    setNewContactName('');
    setNewContactPhone('');
    Alert.alert('Success', 'Emergency contact added successfully');
  };

  const handleRemoveContact = (contactId: string, contactName: string) => {
    Alert.alert(
      'Remove Contact',
      `Are you sure you want to remove ${contactName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => removeEmergencyContact(contactId),
          style: 'destructive',
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            setVoiceRecognitionEnabled(true);
            setLocationTrackingEnabled(true);
            setHealthMonitoringEnabled(true);
            setEmergencyAutoCall(true);
            setSatelliteModeEnabled(false);
            Alert.alert('Success', 'Settings reset to default');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Exporting your safety data...');
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'Importing safety data...');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradient.background}
        style={styles.backgroundGradient}
      />

      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Configure your safety app preferences
          </Text>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Name:</Text>
              <Text style={styles.infoValue}>Women Safety App</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Developer:</Text>
              <Text style={styles.infoValue}>Dev Roy</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Country:</Text>
              <Text style={styles.infoValue}>Made in India</Text>
            </View>
          </View>
        </View>

        {/* Feature Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feature Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Voice Recognition</Text>
              <Text style={styles.settingDescription}>
                AI-powered voice monitoring with emergency detection
              </Text>
            </View>
            <Switch
              value={voiceRecognitionEnabled}
              onValueChange={setVoiceRecognitionEnabled}
              trackColor={{ false: colors.surfaceLight, true: colors.primary }}
              thumbColor={voiceRecognitionEnabled ? colors.text : colors.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Location Tracking</Text>
              <Text style={styles.settingDescription}>
                Real-time GPS tracking with satellite coordination
              </Text>
            </View>
            <Switch
              value={locationTrackingEnabled}
              onValueChange={setLocationTrackingEnabled}
              trackColor={{ false: colors.surfaceLight, true: colors.primary }}
              thumbColor={locationTrackingEnabled ? colors.text : colors.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Health Monitoring</Text>
              <Text style={styles.settingDescription}>
                Smartwatch integration for vital signs monitoring
              </Text>
            </View>
            <Switch
              value={healthMonitoringEnabled}
              onValueChange={setHealthMonitoringEnabled}
              trackColor={{ false: colors.surfaceLight, true: colors.primary }}
              thumbColor={healthMonitoringEnabled ? colors.text : colors.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Emergency Auto-Call</Text>
              <Text style={styles.settingDescription}>
                Automatically call police when emergency is detected
              </Text>
            </View>
            <Switch
              value={emergencyAutoCall}
              onValueChange={setEmergencyAutoCall}
              trackColor={{ false: colors.surfaceLight, true: colors.primary }}
              thumbColor={emergencyAutoCall ? colors.text : colors.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>ISRO Satellite Mode</Text>
              <Text style={styles.settingDescription}>
                Enhanced location precision using ISRO satellites
              </Text>
            </View>
            <Switch
              value={satelliteModeEnabled}
              onValueChange={setSatelliteModeEnabled}
              trackColor={{ false: colors.surfaceLight, true: colors.primary }}
              thumbColor={satelliteModeEnabled ? colors.text : colors.textSecondary}
            />
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          
          {/* Add New Contact */}
          <View style={styles.addContactContainer}>
            <Text style={styles.addContactTitle}>Add New Contact</Text>
            
            <TextInput
              style={styles.contactInput}
              placeholder="Contact Name"
              placeholderTextColor={colors.textSecondary}
              value={newContactName}
              onChangeText={setNewContactName}
            />
            
            <TextInput
              style={styles.contactInput}
              placeholder="Phone Number"
              placeholderTextColor={colors.textSecondary}
              value={newContactPhone}
              onChangeText={setNewContactPhone}
              keyboardType="phone-pad"
            />
            
            <TouchableOpacity
              style={styles.addContactButton}
              onPress={handleAddContact}
            >
              <LinearGradient
                colors={colors.gradient.primary}
                style={styles.addContactButtonGradient}
              >
                <Text style={styles.addContactButtonText}>Add Contact</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Existing Contacts */}
          <View style={styles.contactsList}>
            {emergencyContacts.map((contact) => (
              <View key={contact.id} style={styles.contactItem}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                  {contact.isPrimary && (
                    <Text style={styles.primaryLabel}>Primary Contact</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.removeContactButton}
                  onPress={() => handleRemoveContact(contact.id, contact.name)}
                >
                  <Text style={styles.removeContactText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity
            style={styles.dataButton}
            onPress={handleExportData}
          >
            <LinearGradient
              colors={colors.gradient.primary}
              style={styles.dataButtonGradient}
            >
              <Text style={styles.dataButtonText}>Export Data</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dataButton}
            onPress={handleImportData}
          >
            <LinearGradient
              colors={colors.gradient.secondary}
              style={styles.dataButtonGradient}
            >
              <Text style={styles.dataButtonText}>Import Data</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Reset Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reset</Text>
          
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetSettings}
          >
            <LinearGradient
              colors={colors.gradient.emergency}
              style={styles.resetButtonGradient}
            >
              <Text style={styles.resetButtonText}>Reset All Settings</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* App Features Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Features</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>✓ AI-powered voice recognition</Text>
            <Text style={styles.featureItem}>✓ Real-time location tracking</Text>
            <Text style={styles.featureItem}>✓ Smartwatch health monitoring</Text>
            <Text style={styles.featureItem}>✓ ISRO satellite coordination</Text>
            <Text style={styles.featureItem}>✓ Emergency contact system</Text>
            <Text style={styles.featureItem}>✓ Police integration</Text>
            <Text style={styles.featureItem}>✓ 4D futuristic UI design</Text>
            <Text style={styles.featureItem}>✓ Heartbeat loop animations</Text>
            <Text style={styles.featureItem}>✓ Google Maps integration</Text>
            <Text style={styles.featureItem}>✓ Live tracking system</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Women Safety App - Made in India
          </Text>
          <Text style={styles.footerSubtext}>
            Advanced AI-Powered Safety System
          </Text>
          <Text style={styles.footerSubtext}>
            Version 1.0.0 • Dev Roy
          </Text>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
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
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  settingDescription: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  addContactContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  addContactTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  contactInput: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addContactButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addContactButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  addContactButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactsList: {
    marginTop: 10,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactPhone: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  primaryLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  removeContactButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  removeContactText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dataButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
  },
  dataButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  dataButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  resetButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  resetButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresList: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 15,
  },
  featureItem: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  footerSubtext: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
  },
});

export default SettingsScreen;