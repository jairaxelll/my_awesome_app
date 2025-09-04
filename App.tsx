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
}

const { width } = Dimensions.get('window');

const App: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'deals' | 'activities'>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'customer' | 'deal' | 'activity'>('customer');

  // Form states
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [customers, deals, activities]);

  const loadData = async (): Promise<void> => {
    try {
      const [savedCustomers, savedDeals, savedActivities] = await Promise.all([
        AsyncStorage.getItem('customers'),
        AsyncStorage.getItem('deals'),
        AsyncStorage.getItem('activities'),
      ]);

      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
      if (savedDeals) setDeals(JSON.parse(savedDeals));
      if (savedActivities) setActivities(JSON.parse(savedActivities));
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

    return {
      totalCustomers: customers.length,
      activeDeals: activeDeals.length,
      totalDealValue: activeDeals.reduce((sum, deal) => sum + deal.value, 0),
      closedWonThisMonth: closedWonThisMonth.length,
      activitiesThisWeek: activitiesThisWeek.length,
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
    }
  };

  const openAddModal = (type: 'customer' | 'deal' | 'activity'): void => {
    setModalType(type);
    setFormData({});
    setShowAddModal(true);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'lead': return '#FF9800';
      case 'prospect': return '#2196F3';
      case 'customer': return '#4CAF50';
      case 'inactive': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStageColor = (stage: string): string => {
    switch (stage) {
      case 'prospecting': return '#FF9800';
      case 'qualification': return '#2196F3';
      case 'proposal': return '#9C27B0';
      case 'negotiation': return '#FF5722';
      case 'closed-won': return '#4CAF50';
      case 'closed-lost': return '#F44336';
      default: return '#9E9E9E';
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
          <Text style={styles.statNumber}>${stats.totalDealValue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Pipeline Value</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.closedWonThisMonth}</Text>
          <Text style={styles.statLabel}>Won This Month</Text>
        </View>
      </View>

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
              {new Date(activity.date).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
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
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderAddModal = () => (
    <Modal visible={showAddModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Add {modalType === 'customer' ? 'Customer' : modalType === 'deal' ? 'Deal' : 'Activity'}
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚀 CRM Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage your customers, deals & activities</Text>
      </View>

      {/* Tab Navigation */}
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
      </View>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'customers' && renderCustomers()}
      {activeTab === 'deals' && renderDeals()}
      {activeTab === 'activities' && renderActivities()}

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => openAddModal(activeTab === 'dashboard' ? 'customer' : activeTab as any)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {renderAddModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2E7D32',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#2E7D32',
  },
  tabContent: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: (width - 45) / 2,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  recentSection: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#666',
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  customerCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  customerCompany: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  customerEmail: {
    fontSize: 14,
    color: '#999',
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
    color: '#999',
  },
  dealCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  dealValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  dealCustomer: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dealProbability: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  activityCustomer: {
    fontSize: 12,
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: width - 40,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtonPrimary: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalButtonTextPrimary: {
    color: 'white',
  },
});

export default App;