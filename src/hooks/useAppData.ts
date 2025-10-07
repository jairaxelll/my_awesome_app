import { useState, useEffect } from 'react';
import { Customer, Deal, Activity, Task, Note, Report, Notification, Settings } from '../types';
import { loadData, saveData } from '../services/storage';
import { getSampleCustomers, getSampleDeals, getSampleTasks, getSampleNotes, getSampleActivities } from '../services/sampleData';

export const useAppData = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    notifications: true,
    reminderTime: 15,
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    language: 'en'
  });

  useEffect(() => {
    const initializeData = async () => {
      const data = await loadData();
      setCustomers(data.customers);
      setDeals(data.deals);
      setActivities(data.activities);
      setTasks(data.tasks);
      setNotes(data.notes);
      setReports(data.reports);
      setNotifications(data.notifications);
      setSettings(data.settings);

      // Add sample data if no data exists
      if (data.customers.length === 0) {
        setCustomers(getSampleCustomers());
        setDeals(getSampleDeals());
        setTasks(getSampleTasks());
        setNotes(getSampleNotes());
        setActivities(getSampleActivities());
        addNotification('Welcome to Pro CRM!', 'Your comprehensive business management suite is ready to use.', 'info');
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    saveData({
      customers,
      deals,
      activities,
      tasks,
      notes,
      reports,
      notifications,
      settings,
    });
  }, [customers, deals, activities, tasks, notes, reports, notifications, settings]);

  const addNotification = (title: string, message: string, type: 'reminder' | 'alert' | 'info' | 'success', relatedId?: string): void => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedId,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (notificationId: string): void => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  return {
    customers,
    setCustomers,
    deals,
    setDeals,
    activities,
    setActivities,
    tasks,
    setTasks,
    notes,
    setNotes,
    reports,
    setReports,
    notifications,
    setNotifications,
    settings,
    setSettings,
    addNotification,
    markNotificationRead,
  };
};
