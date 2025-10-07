import React from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { settingsStyles } from '../../styles/settings';
import { Settings, Customer, Deal, Task } from '../../types';

interface SettingsTabProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  customers: Customer[];
  deals: Deal[];
  tasks: Task[];
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onSettingsChange,
  customers,
  deals,
  tasks,
}) => {
  const handleNotificationToggle = (value: boolean) => {
    onSettingsChange({ ...settings, notifications: value });
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={settingsStyles.settingsSection}>
        <Text style={settingsStyles.settingsTitle}>⚙️ Settings</Text>
        
        <View style={settingsStyles.settingItem}>
          <Text style={settingsStyles.settingLabel}>Theme</Text>
          <View style={settingsStyles.settingValue}>
            <Text style={settingsStyles.settingText}>{settings.theme}</Text>
          </View>
        </View>

        <View style={settingsStyles.settingItem}>
          <Text style={settingsStyles.settingLabel}>Notifications</Text>
          <Switch
            value={settings.notifications}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
            thumbColor={settings.notifications ? '#ffffff' : '#f4f4f4'}
          />
        </View>

        <View style={settingsStyles.settingItem}>
          <Text style={settingsStyles.settingLabel}>Currency</Text>
          <View style={settingsStyles.settingValue}>
            <Text style={settingsStyles.settingText}>{settings.currency}</Text>
          </View>
        </View>

        <View style={settingsStyles.settingItem}>
          <Text style={settingsStyles.settingLabel}>Date Format</Text>
          <View style={settingsStyles.settingValue}>
            <Text style={settingsStyles.settingText}>{settings.dateFormat}</Text>
          </View>
        </View>

        <View style={settingsStyles.settingItem}>
          <Text style={settingsStyles.settingLabel}>Language</Text>
          <View style={settingsStyles.settingValue}>
            <Text style={settingsStyles.settingText}>{settings.language}</Text>
          </View>
        </View>
      </View>

      <View style={settingsStyles.settingsSection}>
        <Text style={settingsStyles.settingsTitle}>📊 Statistics</Text>
        <View style={settingsStyles.statsRow}>
          <Text style={settingsStyles.settingLabel}>Total Customers</Text>
          <Text style={settingsStyles.statValue}>{customers.length}</Text>
        </View>
        <View style={settingsStyles.statsRow}>
          <Text style={settingsStyles.settingLabel}>Total Deals</Text>
          <Text style={settingsStyles.statValue}>{deals.length}</Text>
        </View>
        <View style={settingsStyles.statsRow}>
          <Text style={settingsStyles.settingLabel}>Total Tasks</Text>
          <Text style={settingsStyles.statValue}>{tasks.length}</Text>
        </View>
      </View>
    </ScrollView>
  );
};
