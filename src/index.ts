// Export all types
export * from './types';

// Export all components
export { Header } from './components/Header';
export { TabNavigation } from './components/TabNavigation';
export { AddButton } from './components/AddButton';
export { AddModal } from './components/AddModal';
export { NotificationModal } from './components/NotificationModal';

// Export tab components
export { DashboardTab } from './components/tabs/DashboardTab';
export { CustomersTab } from './components/tabs/CustomersTab';
export { DealsTab } from './components/tabs/DealsTab';
export { ActivitiesTab } from './components/tabs/ActivitiesTab';
export { TasksTab } from './components/tabs/TasksTab';
export { NotesTab } from './components/tabs/NotesTab';
export { CalendarTab } from './components/tabs/CalendarTab';
export { SettingsTab } from './components/tabs/SettingsTab';

// Export hooks
export { useAppData } from './hooks/useAppData';
export { useFormData } from './hooks/useFormData';
export { useModal } from './hooks/useModal';

// Export services
export { loadData, saveData } from './services/storage';
export { getSampleCustomers, getSampleDeals, getSampleTasks, getSampleNotes, getSampleActivities } from './services/sampleData';
export { getDashboardStats } from './services/dashboardService';

// Export utils
export * from './utils/helpers';

// Export styles
export { styles } from './styles';
export { dashboardStyles } from './styles/dashboard';
export { cardStyles } from './styles/cards';
export { modalStyles } from './styles/modals';
export { calendarStyles } from './styles/calendar';
export { settingsStyles } from './styles/settings';
