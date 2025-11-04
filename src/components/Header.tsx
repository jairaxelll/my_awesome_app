import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="star-four-points" size={26} color="white" style={{ marginRight: 8 }} />
          <View>
            <Text style={styles.headerTitle}>Pro CRM</Text>
            {user && (
              <Text style={[styles.headerSubtitle, { textAlign: 'left', marginTop: 4 }]}>
                Welcome back, {user.firstName}!
              </Text>
            )}
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={onNotificationPress}
          >
            <Icon name="bell" size={22} color="white" />
            {unreadNotificationsCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadNotificationsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={onLogout}
          >
            <Icon name="logout" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {!user && (
        <Text style={styles.headerSubtitle}>Complete business management suite</Text>
      )}
    </View>
  );
};
