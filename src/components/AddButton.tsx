import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles';
import { TabType, ModalType } from '../types';

interface AddButtonProps {
  activeTab: TabType;
  onPress: (modalType: ModalType) => void;
}

export const AddButton: React.FC<AddButtonProps> = ({ activeTab, onPress }) => {
  if (activeTab === 'settings') {
    return null;
  }

  const modalTypeMap: { [key in TabType]?: ModalType } = {
    'dashboard': 'customer',
    'customers': 'customer',
    'sales': 'sale',
    'tasks': 'task',
    'products': 'product',
    'employees': 'employee',
    'calendar': 'task'
  };

  const handlePress = () => {
    const modalType = modalTypeMap[activeTab] || 'customer';
    onPress(modalType);
  };

  return (
    <TouchableOpacity style={styles.addButton} onPress={handlePress}>
      <Text style={styles.addButtonText}>+</Text>
    </TouchableOpacity>
  );
};
