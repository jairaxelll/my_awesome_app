import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../styles';
import { TabType, UserRole } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
  userRole: UserRole;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabPress, userRole }) => {
  const allTabs: { key: TabType; label: string; icon: string; adminOnly?: boolean }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'customers', label: 'Customers', icon: '👥' },
    { key: 'sales', label: 'Sales', icon: '💰' },
    { key: 'tasks', label: 'Tasks', icon: '✅' },
    { key: 'products', label: 'Products', icon: '📦' },
    { key: 'employees', label: 'Employees', icon: '👨‍💼', adminOnly: true },
    { key: 'calendar', label: 'Calendar', icon: '📅' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  // Filter tabs based on user role
  const tabs = allTabs.filter(tab => !tab.adminOnly || userRole === 'admin');

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScrollView}>
      <View style={styles.tabNavigation}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => onTabPress(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.icon} {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};
