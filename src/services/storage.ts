import AsyncStorage from '@react-native-async-storage/async-storage';
import { Customer, Deal, Activity, Task, Note, Report, Notification, Settings } from '../types';

export const loadData = async (): Promise<{
  customers: Customer[];
  deals: Deal[];
  activities: Activity[];
  tasks: Task[];
  notes: Note[];
  reports: Report[];
  notifications: Notification[];
  settings: Settings;
}> => {
  try {
    const [
      savedCustomers,
      savedDeals,
      savedActivities,
      savedTasks,
      savedNotes,
      savedReports,
      savedNotifications,
      savedSettings,
    ] = await Promise.all([
      AsyncStorage.getItem('customers'),
      AsyncStorage.getItem('deals'),
      AsyncStorage.getItem('activities'),
      AsyncStorage.getItem('tasks'),
      AsyncStorage.getItem('notes'),
      AsyncStorage.getItem('reports'),
      AsyncStorage.getItem('notifications'),
      AsyncStorage.getItem('settings'),
    ]);

    return {
      customers: savedCustomers ? JSON.parse(savedCustomers) : [],
      deals: savedDeals ? JSON.parse(savedDeals) : [],
      activities: savedActivities ? JSON.parse(savedActivities) : [],
      tasks: savedTasks ? JSON.parse(savedTasks) : [],
      notes: savedNotes ? JSON.parse(savedNotes) : [],
      reports: savedReports ? JSON.parse(savedReports) : [],
      notifications: savedNotifications ? JSON.parse(savedNotifications) : [],
      settings: savedSettings ? JSON.parse(savedSettings) : {
        theme: 'light',
        notifications: true,
        reminderTime: 15,
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        language: 'en'
      },
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return {
      customers: [],
      deals: [],
      activities: [],
      tasks: [],
      notes: [],
      reports: [],
      notifications: [],
      settings: {
        theme: 'light',
        notifications: true,
        reminderTime: 15,
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        language: 'en'
      },
    };
  }
};

export const saveData = async (data: {
  customers: Customer[];
  deals: Deal[];
  activities: Activity[];
  tasks: Task[];
  notes: Note[];
  reports: Report[];
  notifications: Notification[];
  settings: Settings;
}): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.setItem('customers', JSON.stringify(data.customers)),
      AsyncStorage.setItem('deals', JSON.stringify(data.deals)),
      AsyncStorage.setItem('activities', JSON.stringify(data.activities)),
      AsyncStorage.setItem('tasks', JSON.stringify(data.tasks)),
      AsyncStorage.setItem('notes', JSON.stringify(data.notes)),
      AsyncStorage.setItem('reports', JSON.stringify(data.reports)),
      AsyncStorage.setItem('notifications', JSON.stringify(data.notifications)),
      AsyncStorage.setItem('settings', JSON.stringify(data.settings)),
    ]);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};
