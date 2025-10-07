import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Animated, Alert } from 'react-native';
import { styles } from './src/styles';
import { TabType, UserRole } from './src/types';
import { useAuth } from './src/hooks/useAuth';
import { useAppDataExtended } from './src/hooks/useAppDataExtended';
import { useFormData } from './src/hooks/useFormData';
import { useModal } from './src/hooks/useModal';
import { getDashboardStats } from './src/services/dashboardService';
import { getAdminDashboardStats } from './src/services/adminDashboardService';
import { LoginScreen } from './src/components/LoginScreen';
import { Header } from './src/components/Header';
import { TabNavigation } from './src/components/TabNavigation';
import { AddButton } from './src/components/AddButton';
import { AddModal } from './src/components/AddModal';
import { NotificationModal } from './src/components/NotificationModal';
import { DashboardTab } from './src/components/tabs/DashboardTab';
import { AdminDashboardTab } from './src/components/tabs/AdminDashboardTab';
import { CustomersTab } from './src/components/tabs/CustomersTab';
import { SalesTab } from './src/components/tabs/SalesTab';
import { TasksTab } from './src/components/tabs/TasksTab';
import { ProductsTab } from './src/components/tabs/ProductsTab';
import { EmployeesTab } from './src/components/tabs/EmployeesTab';
import { CalendarTab } from './src/components/tabs/CalendarTab';
import { SettingsTab } from './src/components/tabs/SettingsTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [fadeAnim] = useState(new Animated.Value(0));

  const { user, isLoading, isLoggedIn, logout } = useAuth();
  const {
    customers,
    setCustomers,
    deals,
    setDeals,
    tasks,
    setTasks,
    products,
    setProducts,
    sales,
    setSales,
    employees,
    setEmployees,
    settings,
    setSettings,
    notifications,
    addNotification,
    markNotificationRead,
  } = useAppDataExtended();

  const { formData, updateFormData, resetFormData } = useFormData();
  const {
    showAddModal,
    modalType,
    showNotifications,
    openAddModal,
    closeAddModal,
    openNotifications,
    closeNotifications,
  } = useModal();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            setActiveTab('dashboard');
            setSearchQuery('');
          }
        },
      ]
    );
  };

  const stats = getDashboardStats(customers, deals);
  const adminStats = getAdminDashboardStats(products, sales, employees, tasks);
  const unreadNotifications = notifications.filter(notification => !notification.isRead);

  // CRUD functions for new entities
  const addProduct = (): void => {
    const newProduct = {
      id: Date.now().toString(),
      name: formData.name || '',
      description: formData.description || '',
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost) || 0,
      category: formData.category || '',
      sku: formData.sku || '',
      stock: parseInt(formData.stock) || 0,
      minStock: parseInt(formData.minStock) || 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
    closeAddModal();
    resetFormData();
    addNotification('Product Added', `Product "${newProduct.name}" has been added successfully.`, 'success');
  };

  const addSale = (): void => {
    const customer = customers.find(c => c.id === formData.customerId);
    const employee = employees.find(e => e.id === formData.employeeId);
    const product = products.find(p => p.id === formData.productId);
    
    if (!customer || !employee || !product) {
      Alert.alert('Error', 'Please select valid customer, employee, and product');
      return;
    }

    const quantity = parseInt(formData.quantity) || 1;
    const totalPrice = product.price * quantity;
    const discount = parseFloat(formData.discount) || 0;
    const finalAmount = totalPrice - discount;

    const newSale = {
      id: Date.now().toString(),
      customerId: customer.id,
      customerName: customer.name,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      products: [{
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        totalPrice,
      }],
      totalAmount: totalPrice,
      discount,
      finalAmount,
      status: 'pending' as const,
      paymentMethod: formData.paymentMethod || 'cash',
      saleDate: formData.saleDate || new Date().toISOString(),
      notes: formData.notes || '',
      createdAt: new Date().toISOString(),
    };
    setSales([...sales, newSale]);
    closeAddModal();
    resetFormData();
    addNotification('Sale Created', `Sale for ${customer.name} has been created successfully.`, 'success');
  };

  const addEmployee = (): void => {
    const newEmployee = {
      id: Date.now().toString(),
      userId: '', // This would be linked to a user account
      employeeId: formData.employeeId || '',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      department: formData.department || '',
      position: formData.position || '',
      hireDate: formData.hireDate || new Date().toISOString(),
      salary: parseFloat(formData.salary) || undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEmployees([...employees, newEmployee]);
    closeAddModal();
    resetFormData();
    addNotification('Employee Added', `Employee "${newEmployee.firstName} ${newEmployee.lastName}" has been added successfully.`, 'success');
  };

  const addCustomer = (): void => {
    const newCustomer = {
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
    closeAddModal();
    resetFormData();
  };

  const addDeal = (): void => {
    const customer = customers.find(c => c.id === formData.customerId);
    const newDeal = {
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
    closeAddModal();
    resetFormData();
  };


  const addTask = (): void => {
    const assignedEmployee = employees.find(e => e.id === formData.assignedTo);
    const newTask = {
      id: Date.now().toString(),
      title: formData.title || '',
      description: formData.description || '',
      priority: formData.priority || 'medium',
      status: 'pending' as const,
      dueDate: formData.dueDate || new Date().toISOString(),
      assignedTo: assignedEmployee ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}` : formData.assignedTo || 'Me',
      customerId: formData.customerId || undefined,
      dealId: formData.dealId || undefined,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    closeAddModal();
    resetFormData();
    addNotification('Task Created', `Task "${newTask.title}" has been assigned successfully.`, 'success');
  };


  const handleAdd = (): void => {
    switch (modalType) {
      case 'customer':
        addCustomer();
        break;
      case 'sale':
        addSale();
        break;
      case 'task':
        addTask();
        break;
      case 'product':
        addProduct();
        break;
      case 'employee':
        addEmployee();
        break;
    }
  };

  const markTaskComplete = (taskId: string): void => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const, completedAt: new Date().toISOString() }
        : task
    ));
    addNotification('Task Completed', 'A task has been marked as completed', 'success', taskId);
  };


  const renderTabContent = () => {
    const userRole = user?.role || 'employee';
    
    switch (activeTab) {
      case 'dashboard':
        if (userRole === 'admin') {
          return (
            <AdminDashboardTab
              stats={adminStats}
              products={products}
              sales={sales}
              employees={employees}
              tasks={tasks}
              settings={settings}
            />
          );
        } else {
          return (
            <DashboardTab
              stats={stats}
              tasks={tasks}
              settings={settings}
            />
          );
        }
      case 'customers':
        return (
          <CustomersTab
            customers={customers}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );
      case 'sales':
        return (
          <SalesTab
            sales={sales}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            userRole={userRole}
          />
        );
      case 'tasks':
        return (
          <TasksTab
            tasks={tasks}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onTaskComplete={markTaskComplete}
          />
        );
      case 'products':
        return (
          <ProductsTab
            products={products}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            userRole={userRole}
          />
        );
      case 'sales':
        return (
          <SalesTab
            sales={sales}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            userRole={userRole}
          />
        );
      case 'employees':
        return (
          <EmployeesTab
            employees={employees}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            userRole={userRole}
          />
        );
      case 'calendar':
        return (
          <CalendarTab
            tasks={tasks}
            selectedDate={selectedDate}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            settings={settings}
            onSettingsChange={setSettings}
            customers={customers}
            deals={deals}
            tasks={tasks}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#64748b' }}>Loading...</Text>
      </View>
    );
  }

  if (!isLoggedIn || !user) {
    return <LoginScreen />;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      <Header
        unreadNotificationsCount={unreadNotifications.length}
        onNotificationPress={openNotifications}
        onLogout={handleLogout}
        user={user}
      />

      <TabNavigation
        activeTab={activeTab}
        onTabPress={setActiveTab}
        userRole={user.role}
      />

      {renderTabContent()}

      <AddButton
        activeTab={activeTab}
        onPress={openAddModal}
      />

      <AddModal
        visible={showAddModal}
        modalType={modalType}
        formData={formData}
        onFormDataChange={updateFormData}
        onAdd={handleAdd}
        onClose={closeAddModal}
      />

      <NotificationModal
        visible={showNotifications}
        notifications={notifications}
        onNotificationPress={markNotificationRead}
        onClose={closeNotifications}
      />
    </Animated.View>
  );
};

export default App;