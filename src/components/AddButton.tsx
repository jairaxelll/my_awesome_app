import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../styles';
import { TabType, ModalType } from '../types';

interface AddButtonProps {
  activeTab: TabType;
  onPress: (modalType: ModalType) => void;
}

export const AddButton: React.FC<AddButtonProps> = ({ activeTab, onPress }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

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

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    const modalType = modalTypeMap[activeTab] || 'customer';
    onPress(modalType);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={32} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};
