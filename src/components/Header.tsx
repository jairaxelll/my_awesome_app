import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';
import { User } from '../types';

interface HeaderProps {
  unreadNotificationsCount: number;
  onNotificationPress: () => void;
  onLogout: () => void;
  user: User | null;
}

export const Header: React.FC<HeaderProps> = ({ 
  unreadNotificationsCount, 
  onNotificationPress, 
  onLogout,
  user 
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>🚀 Pro CRM</Text>
          {user && (
            <Text style={[styles.headerSubtitle, { textAlign: 'left', marginTop: 2 }]}>
              Welcome, {user.firstName} ({user.role})
            </Text>
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={onNotificationPress}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
            {unreadNotificationsCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadNotificationsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.notificationButton, { marginLeft: 8 }]}
            onPress={onLogout}
          >
            <Text style={styles.notificationIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>
      {!user && (
        <Text style={styles.headerSubtitle}>Complete business management suite</Text>
      )}
    </View>
  );
};
