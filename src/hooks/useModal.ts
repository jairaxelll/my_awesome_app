import { useState } from 'react';
import { ModalType } from '../types';

export const useModal = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>('customer');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const openAddModal = (type: ModalType) => {
    setModalType(type);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const openNotifications = () => {
    setShowNotifications(true);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  return {
    showAddModal,
    modalType,
    showNotifications,
    openAddModal,
    closeAddModal,
    openNotifications,
    closeNotifications,
  };
};
