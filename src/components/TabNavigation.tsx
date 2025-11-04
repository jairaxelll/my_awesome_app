import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../styles';
import { TabType, UserRole } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
  userRole: UserRole;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabPress, userRole }) => {
  const allTabs: { key: TabType; label: string; icon: string; adminOnly?: boolean }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'view-dashboard' },
    { key: 'customers', label: 'Customers', icon: 'account-group' },
    { key: 'sales', label: 'Sales', icon: 'currency-usd' },
    { key: 'tasks', label: 'Tasks', icon: 'check-circle' },
    { key: 'products', label: 'Products', icon: 'package-variant' },
    { key: 'employees', label: 'Employees', icon: 'account-tie', adminOnly: true },
    { key: 'calendar', label: 'Calendar', icon: 'calendar' },
    { key: 'settings', label: 'Settings', icon: 'cog' },
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
            <Icon 
              name={tab.icon} 
              size={18} 
              color={activeTab === tab.key ? '#6366f1' : '#64748b'} 
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText, { marginTop: 4 }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};
