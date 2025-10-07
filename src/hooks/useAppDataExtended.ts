import { useState, useEffect } from 'react';
import { 
  Customer, Deal, Task, Report, Notification, Settings,
  Product, Sale, Employee, User
} from '../types';
import { loadData, saveData } from '../services/storage';
import { getSampleCustomers, getSampleDeals, getSampleTasks } from '../services/sampleData';
import { getSampleProducts, getSampleSales, getSampleEmployees } from '../services/sampleDataExtended';
import { initializeUsers } from '../services/authService';

export const useAppDataExtended = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
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
      // Initialize users first
      await initializeUsers();
      
      const data = await loadData();
      setCustomers(data.customers);
      setDeals(data.deals);
      setTasks(data.tasks);
      setReports(data.reports);
      setNotifications(data.notifications);
      setSettings(data.settings);

      // Load extended data
      const [savedProducts, savedSales, savedEmployees] = await Promise.all([
        loadExtendedData('products'),
        loadExtendedData('sales'),
        loadExtendedData('employees'),
      ]);

      setProducts(savedProducts);
      setSales(savedSales);
      setEmployees(savedEmployees);

      // Add sample data if no data exists
      if (data.customers.length === 0) {
        setCustomers(getSampleCustomers());
        setDeals(getSampleDeals());
        setTasks(getSampleTasks());
        setNotes(getSampleNotes());
        setActivities(getSampleActivities());
        addNotification('Welcome to Pro CRM!', 'Your comprehensive business management suite is ready to use.', 'info');
      }

      if (savedProducts.length === 0) {
        setProducts(getSampleProducts());
      }

      if (savedSales.length === 0) {
        setSales(getSampleSales());
      }

      if (savedEmployees.length === 0) {
        setEmployees(getSampleEmployees());
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    saveExtendedData();
  }, [customers, deals, tasks, reports, notifications, settings, products, sales, employees]);

  const loadExtendedData = async (key: string): Promise<any[]> => {
    try {
      const data = await require('@react-native-async-storage/async-storage').default.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return [];
    }
  };

  const saveExtendedData = async (): Promise<void> => {
    try {
      await Promise.all([
        saveData({
          customers,
          deals,
          tasks,
          reports,
          notifications,
          settings,
        }),
        require('@react-native-async-storage/async-storage').default.setItem('products', JSON.stringify(products)),
        require('@react-native-async-storage/async-storage').default.setItem('sales', JSON.stringify(sales)),
        require('@react-native-async-storage/async-storage').default.setItem('employees', JSON.stringify(employees)),
      ]);
    } catch (error) {
      console.error('Error saving extended data:', error);
    }
  };

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
    // Original data
    customers,
    setCustomers,
    deals,
    setDeals,
    tasks,
    setTasks,
    reports,
    setReports,
    notifications,
    setNotifications,
    settings,
    setSettings,
    
    // Extended data
    products,
    setProducts,
    sales,
    setSales,
    employees,
    setEmployees,
    
    // Functions
    addNotification,
    markNotificationRead,
  };
};
