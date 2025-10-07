import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { modalStyles } from '../styles/modals';
import { Notification } from '../types';
import { getNotificationIcon, formatDate } from '../utils/helpers';

interface NotificationModalProps {
  visible: boolean;
  notifications: Notification[];
  onNotificationPress: (id: string) => void;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  notifications,
  onNotificationPress,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>🔔 Notifications</Text>
          <ScrollView style={modalStyles.notificationList}>
            {notifications.map(notification => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  modalStyles.notificationItem,
                  !notification.isRead && modalStyles.unreadNotification
                ]}
                onPress={() => onNotificationPress(notification.id)}
              >
                <Text style={modalStyles.notificationIcon}>{getNotificationIcon(notification.type)}</Text>
                <View style={modalStyles.notificationContent}>
                  <Text style={modalStyles.notificationTitle}>{notification.title}</Text>
                  <Text style={modalStyles.notificationMessage}>{notification.message}</Text>
                  <Text style={modalStyles.notificationDate}>{formatDate(notification.createdAt)}</Text>
                </View>
                {!notification.isRead && <View style={modalStyles.unreadDot} />}
              </TouchableOpacity>
            ))}
            {notifications.length === 0 && (
              <Text style={modalStyles.emptyText}>No notifications yet</Text>
            )}
          </ScrollView>
          <TouchableOpacity style={modalStyles.modalButton} onPress={onClose}>
            <Text style={modalStyles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
