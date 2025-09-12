import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  StatusBar,
  ScrollView,
  Modal,
  Dimensions,
  Switch,
  Animated,
  PanResponder,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// CRM Data Models
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  createdAt: string;
  lastContact: string;
  notes: string;
}

interface Deal {
  id: string;
  title: string;
  customerId: string;
  customerName: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  createdAt: string;
  notes: string;
}

interface Activity {
  id: string;
  type: 'call' | 'meeting' | 'email' | 'note';
  title: string;
  description: string;
  customerId: string;
  customerName: string;
  dealId?: string;
  date: string;
  completed: boolean;
}

interface DashboardStats {
  totalCustomers: number;
  activeDeals: number;
  totalDealValue: number;
  closedWonThisMonth: number;
  activitiesThisWeek: number;
  revenueThisMonth: number;
  conversionRate: number;
  averageDealSize: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: string;
  assignedTo: string;
  customerId?: string;
  dealId?: string;
  createdAt: string;
  completedAt?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'customer' | 'deal' | 'meeting';
  relatedId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

interface Report {
  id: string;
  title: string;
  type: 'sales' | 'customers' | 'activities' | 'revenue';
  dateRange: { start: string; end: string };
  data: any;
  createdAt: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'alert' | 'info' | 'success';
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

interface Settings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  reminderTime: number;
  currency: string;
  dateFormat: string;
  language: string;
}

const { width } = Dimensions.get('window');

const App: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'deals' | 'activities' | 'tasks' | 'notes' | 'reports' | 'calendar' | 'settings'>('dashboard');
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'customer' | 'deal' | 'activity' | 'task' | 'note'>('customer');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Form states
  const [formData, setFormData] = useState<any>({});
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadData();
    addSampleData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const addSampleData = (): void => {
    if (customers.length === 0) {
      const sampleCustomers: Customer[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john@techcorp.com',
          phone: '+1-555-0123',
          company: 'TechCorp Inc.',
          status: 'customer',
          createdAt: new Date().toISOString(),
          lastContact: new Date().toISOString(),
          notes: 'VIP customer, prefers email communication'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@innovate.com',
          phone: '+1-555-0456',
          company: 'Innovate Solutions',
          status: 'prospect',
          createdAt: new Date().toISOString(),
          lastContact: new Date().toISOString(),
          notes: 'Interested in enterprise package'
        },
        {
          id: '3',
          name: 'Mike Davis',
          email: 'mike@startup.io',
          phone: '+1-555-0789',
          company: 'StartupIO',
          status: 'lead',
          createdAt: new Date().toISOString(),
          lastContact: new Date().toISOString(),
          notes: 'Cold lead from LinkedIn'
        }
      ];
      setCustomers(sampleCustomers);

      const sampleDeals: Deal[] = [
        {
          id: '1',
          title: 'Enterprise Software License',
          customerId: '1',
          customerName: 'John Smith',
          value: 50000,
          stage: 'negotiation',
          probability: 75,
          expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          notes: 'Final pricing discussion next week'
        },
        {
          id: '2',
          title: 'Cloud Migration Project',
          customerId: '2',
          customerName: 'Sarah Johnson',
          value: 25000,
          stage: 'proposal',
          probability: 60,
          expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          notes: 'Waiting for budget approval'
        }
      ];
      setDeals(sampleDeals);

      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Follow up with John Smith',
          description: 'Call to discuss final contract terms',
          priority: 'high',
          status: 'pending',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'Me',
          customerId: '1',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Prepare demo for Sarah',
          description: 'Create custom demo for Innovate Solutions',
          priority: 'medium',
          status: 'in-progress',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'Me',
          customerId: '2',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Send proposal to Mike',
          description: 'Email initial proposal to StartupIO',
          priority: 'low',
          status: 'pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'Me',
          customerId: '3',
          createdAt: new Date().toISOString()
        }
      ];
      setTasks(sampleTasks);

      const sampleNotes: Note[] = [
        {
          id: '1',
          title: 'Meeting with John - Key Points',
          content: 'Discussed pricing structure and implementation timeline. He seems very interested in our enterprise features.',
          type: 'meeting',
          relatedId: '1',
          tags: ['meeting', 'enterprise', 'pricing'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPinned: true
        },
        {
          id: '2',
          title: 'Competitor Analysis',
          content: 'Researched competitors in the CRM space. Our pricing is competitive and features are superior.',
          type: 'general',
          tags: ['research', 'competitors', 'pricing'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPinned: false
        }
      ];
      setNotes(sampleNotes);

      const sampleActivities: Activity[] = [
        {
          id: '1',
          type: 'call',
          title: 'Follow-up call with John Smith',
          description: 'Discussed contract terms and next steps',
          customerId: '1',
          customerName: 'John Smith',
          dealId: '1',
          date: new Date().toISOString(),
          completed: true
        },
        {
          id: '2',
          type: 'meeting',
          title: 'Product demo for Sarah',
          description: 'Showed enterprise features and pricing',
          customerId: '2',
          customerName: 'Sarah Johnson',
          dealId: '2',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          completed: true
        }
      ];
      setActivities(sampleActivities);

      addNotification('Welcome to Pro CRM!', 'Your comprehensive business management suite is ready to use.', 'info');
    }
  };

  useEffect(() => {
    saveData();
  }, [customers, deals, activities, tasks, notes, reports, notifications, settings]);

  const loadData = async (): Promise<void> => {
    try {
      const [savedCustomers, savedDeals, savedActivities, savedTasks, savedNotes, savedReports, savedNotifications, savedSettings] = await Promise.all([
        AsyncStorage.getItem('customers'),
        AsyncStorage.getItem('deals'),
        AsyncStorage.getItem('activities'),
        AsyncStorage.getItem('tasks'),
        AsyncStorage.getItem('notes'),
        AsyncStorage.getItem('reports'),
        AsyncStorage.getItem('notifications'),
        AsyncStorage.getItem('settings'),
      ]);

      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
      if (savedDeals) setDeals(JSON.parse(savedDeals));
      if (savedActivities) setActivities(JSON.parse(savedActivities));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      if (savedReports) setReports(JSON.parse(savedReports));
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.setItem('customers', JSON.stringify(customers)),
        AsyncStorage.setItem('deals', JSON.stringify(deals)),
        AsyncStorage.setItem('activities', JSON.stringify(activities)),
        AsyncStorage.setItem('tasks', JSON.stringify(tasks)),
        AsyncStorage.setItem('notes', JSON.stringify(notes)),
        AsyncStorage.setItem('reports', JSON.stringify(reports)),
        AsyncStorage.setItem('notifications', JSON.stringify(notifications)),
        AsyncStorage.setItem('settings', JSON.stringify(settings)),
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const getDashboardStats = (): DashboardStats => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const activeDeals = deals.filter(deal => 
      !['closed-won', 'closed-lost'].includes(deal.stage)
    );
    
    const closedWonThisMonth = deals.filter(deal => 
      deal.stage === 'closed-won' &&
      new Date(deal.createdAt).getMonth() === thisMonth &&
      new Date(deal.createdAt).getFullYear() === thisYear
    );

    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const activitiesThisWeek = activities.filter(activity =>
      new Date(activity.date) >= thisWeek
    );

    const revenueThisMonth = closedWonThisMonth.reduce((sum, deal) => sum + deal.value, 0);
    const totalLeads = customers.filter(c => c.status === 'lead').length;
    const totalCustomers = customers.filter(c => c.status === 'customer').length;
    const conversionRate = totalLeads > 0 ? (totalCustomers / totalLeads) * 100 : 0;
    const averageDealSize = activeDeals.length > 0 ? activeDeals.reduce((sum, deal) => sum + deal.value, 0) / activeDeals.length : 0;

    return {
      totalCustomers: customers.length,
      activeDeals: activeDeals.length,
      totalDealValue: activeDeals.reduce((sum, deal) => sum + deal.value, 0),
      closedWonThisMonth: closedWonThisMonth.length,
      activitiesThisWeek: activitiesThisWeek.length,
      revenueThisMonth,
      conversionRate: Math.round(conversionRate),
      averageDealSize: Math.round(averageDealSize),
    };
  };

  const addCustomer = (): void => {
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      company: formData.company || '',
      status: formData.status || 'lead',
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      notes: formData.notes || '',
    };
    setCustomers([...customers, newCustomer]);
    setShowAddModal(false);
    setFormData({});
  };

  const addDeal = (): void => {
    const customer = customers.find(c => c.id === formData.customerId);
    const newDeal: Deal = {
      id: Date.now().toString(),
      title: formData.title || '',
      customerId: formData.customerId || '',
      customerName: customer?.name || '',
      value: parseFloat(formData.value) || 0,
      stage: formData.stage || 'prospecting',
      probability: parseInt(formData.probability) || 0,
      expectedCloseDate: formData.expectedCloseDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      notes: formData.notes || '',
    };
    setDeals([...deals, newDeal]);
    setShowAddModal(false);
    setFormData({});
  };

  const addActivity = (): void => {
    const customer = customers.find(c => c.id === formData.customerId);
    const newActivity: Activity = {
      id: Date.now().toString(),
      type: formData.type || 'call',
      title: formData.title || '',
      description: formData.description || '',
      customerId: formData.customerId || '',
      customerName: customer?.name || '',
      dealId: formData.dealId || undefined,
      date: formData.date || new Date().toISOString(),
      completed: false,
    };
    setActivities([...activities, newActivity]);
    setShowAddModal(false);
    setFormData({});
  };

  const addTask = (): void => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title || '',
      description: formData.description || '',
      priority: formData.priority || 'medium',
      status: 'pending',
      dueDate: formData.dueDate || new Date().toISOString(),
      assignedTo: formData.assignedTo || 'Me',
      customerId: formData.customerId || undefined,
      dealId: formData.dealId || undefined,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setShowAddModal(false);
    setFormData({});
  };

  const addNote = (): void => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: formData.title || '',
      content: formData.content || '',
      type: formData.type || 'general',
      relatedId: formData.relatedId || undefined,
      tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
    };
    setNotes([...notes, newNote]);
    setShowAddModal(false);
    setFormData({});
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
    setNotifications([newNotification, ...notifications]);
  };

  const markTaskComplete = (taskId: string): void => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const, completedAt: new Date().toISOString() }
        : task
    ));
    addNotification('Task Completed', 'A task has been marked as completed', 'success', taskId);
  };

  const toggleNotePin = (noteId: string): void => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, isPinned: !note.isPinned }
        : note
    ));
  };

  const markNotificationRead = (notificationId: string): void => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const handleAdd = (): void => {
    switch (modalType) {
      case 'customer':
        addCustomer();
        break;
      case 'deal':
        addDeal();
        break;
      case 'activity':
        addActivity();
        break;
      case 'task':
        addTask();
        break;
      case 'note':
        addNote();
        break;
    }
  };

  const openAddModal = (type: 'customer' | 'deal' | 'activity' | 'task' | 'note'): void => {
    setModalType(type);
    setFormData({});
    setShowAddModal(true);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'lead': return '#f59e0b';
      case 'prospect': return '#3b82f6';
      case 'customer': return '#059669';
      case 'inactive': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStageColor = (stage: string): string => {
    switch (stage) {
      case 'prospecting': return '#f59e0b';
      case 'qualification': return '#3b82f6';
      case 'proposal': return '#8b5cf6';
      case 'negotiation': return '#f97316';
      case 'closed-won': return '#059669';
      case 'closed-lost': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'call': return '📞';
      case 'meeting': return '🤝';
      case 'email': return '📧';
      case 'note': return '📝';
      default: return '📝';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#f97316';
      case 'urgent': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority: string): string => {
    switch (priority) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'urgent': return '🔴';
      default: return '⚪';
    }
  };

  const getTaskStatusIcon = (status: string): string => {
    switch (status) {
      case 'pending': return '⏳';
      case 'in-progress': return '🔄';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '⏳';
    }
  };

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'reminder': return '⏰';
      case 'alert': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return '📢';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = (dueDate: string): boolean => {
    return new Date(dueDate) < new Date();
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const upcomingTasks = tasks.filter(task => 
    task.status !== 'completed' && 
    new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const overdueTasks = tasks.filter(task => 
    task.status !== 'completed' && 
    isOverdue(task.dueDate)
  );

  const pinnedNotes = notes.filter(note => note.isPinned);
  const recentNotes = notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 10);

  const unreadNotifications = notifications.filter(notification => !notification.isRead);

  const stats = getDashboardStats();

  const renderDashboard = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalCustomers}</Text>
          <Text style={styles.statLabel}>Total Customers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.activeDeals}</Text>
          <Text style={styles.statLabel}>Active Deals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{formatCurrency(stats.totalDealValue)}</Text>
          <Text style={styles.statLabel}>Pipeline Value</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.closedWonThisMonth}</Text>
          <Text style={styles.statLabel}>Won This Month</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{formatCurrency(stats.revenueThisMonth)}</Text>
          <Text style={styles.statLabel}>Revenue This Month</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.conversionRate}%</Text>
          <Text style={styles.statLabel}>Conversion Rate</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{formatCurrency(stats.averageDealSize)}</Text>
          <Text style={styles.statLabel}>Avg Deal Size</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{tasks.filter(t => t.status !== 'completed').length}</Text>
          <Text style={styles.statLabel}>Pending Tasks</Text>
        </View>
      </View>

      {overdueTasks.length > 0 && (
        <View style={styles.alertSection}>
          <Text style={styles.alertTitle}>⚠️ Overdue Tasks</Text>
          {overdueTasks.slice(0, 3).map(task => (
            <View key={task.id} style={styles.alertItem}>
              <Text style={styles.alertText}>{task.title}</Text>
              <Text style={styles.alertDate}>Due: {formatDate(task.dueDate)}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {activities.slice(0, 5).map(activity => (
          <View key={activity.id} style={styles.activityItem}>
            <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activitySubtitle}>{activity.customerName}</Text>
            </View>
            <Text style={styles.activityDate}>
              {formatDate(activity.date)}
            </Text>
          </View>
        ))}
      </View>

      {pinnedNotes.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>📌 Pinned Notes</Text>
          {pinnedNotes.slice(0, 3).map(note => (
            <View key={note.id} style={styles.noteItem}>
              <Text style={styles.noteItemTitle}>{note.title}</Text>
              <Text style={styles.noteItemContent} numberOfLines={2}>{note.content}</Text>
              <Text style={styles.noteItemDate}>{formatDate(note.updatedAt)}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderCustomers = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search customers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.customerCard}>
            <View style={styles.customerHeader}>
              <Text style={styles.customerName}>{item.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.customerCompany}>{item.company}</Text>
            <Text style={styles.customerEmail}>{item.email}</Text>
            <Text style={styles.customerPhone}>{item.phone}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderDeals = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search deals..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredDeals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.dealCard}>
            <View style={styles.dealHeader}>
              <Text style={styles.dealTitle}>{item.title}</Text>
              <Text style={styles.dealValue}>${item.value.toLocaleString()}</Text>
            </View>
            <Text style={styles.dealCustomer}>{item.customerName}</Text>
            <View style={styles.dealFooter}>
              <View style={[styles.stageBadge, { backgroundColor: getStageColor(item.stage) }]}>
                <Text style={styles.stageText}>{item.stage}</Text>
              </View>
              <Text style={styles.dealProbability}>{item.probability}%</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderActivities = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search activities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.activityCard}>
            <Text style={styles.activityIcon}>{getActivityIcon(item.type)}</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityDescription}>{item.description}</Text>
              <Text style={styles.activityCustomer}>{item.customerName}</Text>
            </View>
            <Text style={styles.activityDate}>
              {formatDate(item.date)}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderTasks = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.taskCard, isOverdue(item.dueDate) && item.status !== 'completed' && styles.overdueCard]}>
            <View style={styles.taskHeader}>
              <View style={styles.taskTitleRow}>
                <Text style={styles.taskStatusIcon}>{getTaskStatusIcon(item.status)}</Text>
                <Text style={styles.taskTitle}>{item.title}</Text>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                <Text style={styles.priorityText}>{item.priority}</Text>
              </View>
            </View>
            <Text style={styles.taskDescription}>{item.description}</Text>
            <View style={styles.taskFooter}>
              <Text style={styles.taskAssignee}>👤 {item.assignedTo}</Text>
              <Text style={[styles.taskDueDate, isOverdue(item.dueDate) && item.status !== 'completed' && styles.overdueText]}>
                📅 {formatDate(item.dueDate)}
              </Text>
            </View>
            {item.status !== 'completed' && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => markTaskComplete(item.id)}
              >
                <Text style={styles.completeButtonText}>Mark Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderNotes = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <TouchableOpacity onPress={() => toggleNotePin(item.id)}>
                <Text style={styles.pinIcon}>{item.isPinned ? '📌' : '📍'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.noteContent} numberOfLines={3}>{item.content}</Text>
            <View style={styles.noteTags}>
              {item.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.noteDate}>{formatDate(item.updatedAt)}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderCalendar = () => (
    <View style={styles.tabContent}>
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarTitle}>📅 Calendar View</Text>
        <Text style={styles.calendarDate}>{formatDate(selectedDate)}</Text>
      </View>
      <ScrollView style={styles.calendarContent}>
        <View style={styles.calendarSection}>
          <Text style={styles.calendarSectionTitle}>Today's Activities</Text>
          {activities.filter(activity => 
            new Date(activity.date).toDateString() === new Date(selectedDate).toDateString()
          ).map(activity => (
            <View key={activity.id} style={styles.calendarItem}>
              <Text style={styles.calendarItemIcon}>{getActivityIcon(activity.type)}</Text>
              <View style={styles.calendarItemContent}>
                <Text style={styles.calendarItemTitle}>{activity.title}</Text>
                <Text style={styles.calendarItemSubtitle}>{activity.customerName}</Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.calendarSection}>
          <Text style={styles.calendarSectionTitle}>Due Today</Text>
          {tasks.filter(task => 
            new Date(task.dueDate).toDateString() === new Date(selectedDate).toDateString() &&
            task.status !== 'completed'
          ).map(task => (
            <View key={task.id} style={styles.calendarItem}>
              <Text style={styles.calendarItemIcon}>{getTaskStatusIcon(task.status)}</Text>
              <View style={styles.calendarItemContent}>
                <Text style={styles.calendarItemTitle}>{task.title}</Text>
                <Text style={styles.calendarItemSubtitle}>Priority: {task.priority}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderSettings = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>⚙️ Settings</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Theme</Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingText}>{settings.theme}</Text>
          </View>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch
            value={settings.notifications}
            onValueChange={(value) => setSettings({...settings, notifications: value})}
            trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
            thumbColor={settings.notifications ? '#ffffff' : '#f4f4f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Currency</Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingText}>{settings.currency}</Text>
          </View>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Date Format</Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingText}>{settings.dateFormat}</Text>
          </View>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Language</Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingText}>{settings.language}</Text>
          </View>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>📊 Statistics</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statLabel}>Total Customers</Text>
          <Text style={styles.statValue}>{customers.length}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statLabel}>Total Deals</Text>
          <Text style={styles.statValue}>{deals.length}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statLabel}>Total Tasks</Text>
          <Text style={styles.statValue}>{tasks.length}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statLabel}>Total Notes</Text>
          <Text style={styles.statValue}>{notes.length}</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderAddModal = () => (
    <Modal visible={showAddModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Add {modalType === 'customer' ? 'Customer' : modalType === 'deal' ? 'Deal' : modalType === 'activity' ? 'Activity' : modalType === 'task' ? 'Task' : 'Note'}
          </Text>
          
          {modalType === 'customer' && (
            <>
              <TextInput
                style={styles.modalInput}
                placeholder="Name"
                value={formData.name || ''}
                onChangeText={(text) => setFormData({...formData, name: text})}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Email"
                value={formData.email || ''}
                onChangeText={(text) => setFormData({...formData, email: text})}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Phone"
                value={formData.phone || ''}
                onChangeText={(text) => setFormData({...formData, phone: text})}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Company"
                value={formData.company || ''}
                onChangeText={(text) => setFormData({...formData, company: text})}
              />
            </>
          )}

          {modalType === 'deal' && (
            <>
              <TextInput
                style={styles.modalInput}
                placeholder="Deal Title"
                value={formData.title || ''}
                onChangeText={(text) => setFormData({...formData, title: text})}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Value"
                value={formData.value || ''}
                onChangeText={(text) => setFormData({...formData, value: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Probability (%)"
                value={formData.probability || ''}
                onChangeText={(text) => setFormData({...formData, probability: text})}
                keyboardType="numeric"
              />
            </>
          )}

          {modalType === 'activity' && (
            <>
              <TextInput
                style={styles.modalInput}
                placeholder="Activity Title"
                value={formData.title || ''}
                onChangeText={(text) => setFormData({...formData, title: text})}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Description"
                value={formData.description || ''}
                onChangeText={(text) => setFormData({...formData, description: text})}
                multiline
              />
            </>
          )}

          {modalType === 'task' && (
            <>
              <TextInput
                style={styles.modalInput}
                placeholder="Task Title"
                value={formData.title || ''}
                onChangeText={(text) => setFormData({...formData, title: text})}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Description"
                value={formData.description || ''}
                onChangeText={(text) => setFormData({...formData, description: text})}
                multiline
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Priority (low, medium, high, urgent)"
                value={formData.priority || ''}
                onChangeText={(text) => setFormData({...formData, priority: text})}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Due Date (YYYY-MM-DD)"
                value={formData.dueDate || ''}
                onChangeText={(text) => setFormData({...formData, dueDate: text})}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Assigned To"
                value={formData.assignedTo || ''}
                onChangeText={(text) => setFormData({...formData, assignedTo: text})}
              />
            </>
          )}

          {modalType === 'note' && (
            <>
              <TextInput
                style={styles.modalInput}
                placeholder="Note Title"
                value={formData.title || ''}
                onChangeText={(text) => setFormData({...formData, title: text})}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Content"
                value={formData.content || ''}
                onChangeText={(text) => setFormData({...formData, content: text})}
                multiline
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Type (general, customer, deal, meeting)"
                value={formData.type || ''}
                onChangeText={(text) => setFormData({...formData, type: text})}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Tags (comma separated)"
                value={formData.tags || ''}
                onChangeText={(text) => setFormData({...formData, tags: text})}
              />
            </>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={handleAdd}
            >
              <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderNotificationModal = () => (
    <Modal visible={showNotifications} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>🔔 Notifications</Text>
          <ScrollView style={styles.notificationList}>
            {notifications.map(notification => (
              <TouchableOpacity
                key={notification.id}
                style={[styles.notificationItem, !notification.isRead && styles.unreadNotification]}
                onPress={() => markNotificationRead(notification.id)}
              >
                <Text style={styles.notificationIcon}>{getNotificationIcon(notification.type)}</Text>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationDate}>{formatDate(notification.createdAt)}</Text>
                </View>
                {!notification.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
            {notifications.length === 0 && (
              <Text style={styles.emptyText}>No notifications yet</Text>
            )}
          </ScrollView>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setShowNotifications(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>🚀 Pro CRM</Text>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => setShowNotifications(true)}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
            {unreadNotifications.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadNotifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Complete business management suite</Text>
      </View>

      {/* Tab Navigation */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScrollView}>
        <View style={styles.tabNavigation}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
            onPress={() => setActiveTab('dashboard')}
          >
            <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>
              📊 Dashboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'customers' && styles.activeTab]}
            onPress={() => setActiveTab('customers')}
          >
            <Text style={[styles.tabText, activeTab === 'customers' && styles.activeTabText]}>
              👥 Customers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'deals' && styles.activeTab]}
            onPress={() => setActiveTab('deals')}
          >
            <Text style={[styles.tabText, activeTab === 'deals' && styles.activeTabText]}>
              💼 Deals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
            onPress={() => setActiveTab('activities')}
          >
            <Text style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}>
              📋 Activities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tasks' && styles.activeTab]}
            onPress={() => setActiveTab('tasks')}
          >
            <Text style={[styles.tabText, activeTab === 'tasks' && styles.activeTabText]}>
              ✅ Tasks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
            onPress={() => setActiveTab('notes')}
          >
            <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
              📝 Notes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'calendar' && styles.activeTab]}
            onPress={() => setActiveTab('calendar')}
          >
            <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
              📅 Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
            onPress={() => setActiveTab('settings')}
          >
            <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
              ⚙️ Settings
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'customers' && renderCustomers()}
      {activeTab === 'deals' && renderDeals()}
      {activeTab === 'activities' && renderActivities()}
      {activeTab === 'tasks' && renderTasks()}
      {activeTab === 'notes' && renderNotes()}
      {activeTab === 'calendar' && renderCalendar()}
      {activeTab === 'settings' && renderSettings()}

      {/* Add Button */}
      {activeTab !== 'settings' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            const modalTypeMap: { [key: string]: 'customer' | 'deal' | 'activity' | 'task' | 'note' } = {
              'dashboard': 'customer',
              'customers': 'customer',
              'deals': 'deal',
              'activities': 'activity',
              'tasks': 'task',
              'notes': 'note',
              'calendar': 'activity'
            };
            openAddModal(modalTypeMap[activeTab] || 'customer');
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}

      {renderAddModal()}
      {renderNotificationModal()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1a1a1a',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '400',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tabScrollView: {
    maxHeight: 60,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.3,
  },
  activeTabText: {
    color: '#3b82f6',
  },
  tabContent: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: (width - 48) / 2,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  recentSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 3,
    letterSpacing: 0.1,
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  activityDate: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontWeight: '500',
  },
  customerCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    letterSpacing: 0.1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  customerCompany: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
    fontWeight: '500',
  },
  customerEmail: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
    fontWeight: '500',
  },
  customerPhone: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  dealCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    letterSpacing: 0.1,
  },
  dealValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  dealCustomer: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
    fontWeight: '500',
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stageText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  dealProbability: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  activityDescription: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 5,
    fontWeight: '500',
  },
  activityCustomer: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: width - 40,
    maxHeight: '80%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalButtonPrimary: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  modalButtonTextPrimary: {
    color: 'white',
  },
  // New module styles
  alertSection: {
    backgroundColor: '#fef2f2',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 12,
  },
  alertItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
  },
  alertText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 2,
  },
  alertDate: {
    fontSize: 12,
    color: '#991b1b',
  },
  noteItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  noteItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  noteItemContent: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  noteItemDate: {
    fontSize: 11,
    color: '#94a3b8',
  },
  taskCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  overdueCard: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskStatusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskAssignee: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  taskDueDate: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  overdueText: {
    color: '#dc2626',
    fontWeight: '700',
  },
  completeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  noteCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  pinIcon: {
    fontSize: 16,
  },
  noteContent: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  noteTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  noteDate: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  calendarHeader: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  calendarDate: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  calendarContent: {
    flex: 1,
  },
  calendarSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  calendarSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  calendarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  calendarItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  calendarItemContent: {
    flex: 1,
  },
  calendarItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  calendarItemSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  settingsSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  settingValue: {
    flex: 1,
    alignItems: 'flex-end',
  },
  settingText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b82f6',
  },
  notificationList: {
    maxHeight: 400,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  unreadNotification: {
    backgroundColor: '#f8fafc',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 11,
    color: '#94a3b8',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#64748b',
    padding: 20,
  },
});

export default App;