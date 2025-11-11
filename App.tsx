import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Animated, Alert } from 'react-native';
import { styles } from './src/styles';
import { TabType, UserRole, Product, Sale, Employee, Customer, Task } from './src/types';
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

  const { formData, updateFormData, resetFormData, setFormData } = useFormData();
  const {
    showAddModal,
    modalType,
    showNotifications,
    openAddModal,
    closeAddModal,
    openNotifications,
    closeNotifications,
  } = useModal();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

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
    if (isEditing && editingItemId) {
      // Update mode
      switch (modalType) {
        case 'customer':
          updateCustomer(editingItemId);
          break;
        case 'sale':
          updateSale(editingItemId);
          break;
        case 'task':
          updateTask(editingItemId);
          break;
        case 'product':
          updateProduct(editingItemId);
          break;
        case 'employee':
          updateEmployee(editingItemId);
          break;
      }
    } else {
      // Add mode
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
    }
    setIsEditing(false);
    setEditingItemId(null);
  };

  const markTaskComplete = (taskId: string): void => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const, completedAt: new Date().toISOString() }
        : task
    ));
    addNotification('Task Completed', 'A task has been marked as completed', 'success', taskId);
  };

  // Delete functions
  const deleteProduct = (productId: string): void => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const product = products.find(p => p.id === productId);
            setProducts(products.filter(p => p.id !== productId));
            addNotification('Product Deleted', `Product "${product?.name}" has been deleted.`, 'info');
          }
        }
      ]
    );
  };

  const deleteSale = (saleId: string): void => {
    Alert.alert(
      'Delete Sale',
      'Are you sure you want to delete this sale?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSales(sales.filter(s => s.id !== saleId));
            addNotification('Sale Deleted', 'Sale has been deleted.', 'info');
          }
        }
      ]
    );
  };

  const deleteEmployee = (employeeId: string): void => {
    Alert.alert(
      'Delete Employee',
      'Are you sure you want to delete this employee?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const employee = employees.find(e => e.id === employeeId);
            setEmployees(employees.filter(e => e.id !== employeeId));
            addNotification('Employee Deleted', `Employee "${employee?.firstName} ${employee?.lastName}" has been deleted.`, 'info');
          }
        }
      ]
    );
  };

  const deleteCustomer = (customerId: string): void => {
    Alert.alert(
      'Delete Customer',
      'Are you sure you want to delete this customer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const customer = customers.find(c => c.id === customerId);
            setCustomers(customers.filter(c => c.id !== customerId));
            addNotification('Customer Deleted', `Customer "${customer?.name}" has been deleted.`, 'info');
          }
        }
      ]
    );
  };

  const deleteTask = (taskId: string): void => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const task = tasks.find(t => t.id === taskId);
            setTasks(tasks.filter(t => t.id !== taskId));
            addNotification('Task Deleted', `Task "${task?.title}" has been deleted.`, 'info');
          }
        }
      ]
    );
  };

  // Update functions
  const updateProduct = (productId: string): void => {
    const existingProduct = products.find(p => p.id === productId);
    if (!existingProduct) return;
    
    const updatedProduct: Product = {
      ...existingProduct,
      name: formData.name || existingProduct.name,
      description: formData.description || existingProduct.description,
      price: parseFloat(formData.price) || existingProduct.price,
      cost: parseFloat(formData.cost) || existingProduct.cost,
      category: formData.category || existingProduct.category,
      sku: formData.sku || existingProduct.sku,
      stock: parseInt(formData.stock) || existingProduct.stock,
      minStock: parseInt(formData.minStock) || existingProduct.minStock,
      updatedAt: new Date().toISOString(),
    };
    setProducts(products.map(p => p.id === productId ? updatedProduct : p));
    closeAddModal();
    resetFormData();
    addNotification('Product Updated', `Product "${updatedProduct.name}" has been updated.`, 'success');
  };

  const updateSale = (saleId: string): void => {
    const existingSale = sales.find(s => s.id === saleId);
    if (!existingSale) return;
    
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

    const updatedSale: Sale = {
      ...existingSale,
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
      paymentMethod: formData.paymentMethod || 'cash',
      saleDate: formData.saleDate || new Date().toISOString(),
      notes: formData.notes || '',
    };
    setSales(sales.map(s => s.id === saleId ? updatedSale : s));
    closeAddModal();
    resetFormData();
    addNotification('Sale Updated', 'Sale has been updated successfully.', 'success');
  };

  const updateEmployee = (employeeId: string): void => {
    const existingEmployee = employees.find(e => e.id === employeeId);
    if (!existingEmployee) return;
    
    const updatedEmployee: Employee = {
      ...existingEmployee,
      employeeId: formData.employeeId || existingEmployee.employeeId,
      firstName: formData.firstName || existingEmployee.firstName,
      lastName: formData.lastName || existingEmployee.lastName,
      email: formData.email || existingEmployee.email,
      phone: formData.phone || existingEmployee.phone,
      department: formData.department || existingEmployee.department,
      position: formData.position || existingEmployee.position,
      hireDate: formData.hireDate || existingEmployee.hireDate,
      salary: formData.salary ? parseFloat(formData.salary) : existingEmployee.salary,
      updatedAt: new Date().toISOString(),
    };
    setEmployees(employees.map(e => e.id === employeeId ? updatedEmployee : e));
    closeAddModal();
    resetFormData();
    addNotification('Employee Updated', `Employee "${updatedEmployee.firstName} ${updatedEmployee.lastName}" has been updated.`, 'success');
  };

  const updateCustomer = (customerId: string): void => {
    const existingCustomer = customers.find(c => c.id === customerId);
    if (!existingCustomer) return;
    
    const updatedCustomer: Customer = {
      ...existingCustomer,
      name: formData.name || existingCustomer.name,
      email: formData.email || existingCustomer.email,
      phone: formData.phone || existingCustomer.phone,
      company: formData.company || existingCustomer.company,
      status: formData.status || existingCustomer.status,
      notes: formData.notes || existingCustomer.notes,
    };
    setCustomers(customers.map(c => c.id === customerId ? updatedCustomer : c));
    closeAddModal();
    resetFormData();
    addNotification('Customer Updated', `Customer "${updatedCustomer.name}" has been updated.`, 'success');
  };

  const updateTask = (taskId: string): void => {
    const existingTask = tasks.find(t => t.id === taskId);
    if (!existingTask) return;
    
    const assignedEmployee = employees.find(e => e.id === formData.assignedTo);
    const updatedTask: Task = {
      ...existingTask,
      title: formData.title || existingTask.title,
      description: formData.description || existingTask.description,
      priority: formData.priority || existingTask.priority,
      dueDate: formData.dueDate || existingTask.dueDate,
      assignedTo: assignedEmployee ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}` : (formData.assignedTo || existingTask.assignedTo),
    };
    setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    closeAddModal();
    resetFormData();
    addNotification('Task Updated', `Task "${updatedTask.title}" has been updated.`, 'success');
  };

  // Edit handlers - open modal with existing data
  const handleEditProduct = (product: Product): void => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      cost: product.cost.toString(),
      category: product.category,
      sku: product.sku,
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
    });
    setIsEditing(true);
    setEditingItemId(product.id);
    openAddModal('product');
  };

  const handleEditSale = (sale: Sale): void => {
    setFormData({
      customerId: sale.customerId,
      employeeId: sale.employeeId,
      productId: sale.products[0]?.productId || '',
      quantity: sale.products[0]?.quantity.toString() || '1',
      discount: sale.discount.toString(),
      paymentMethod: sale.paymentMethod,
      saleDate: sale.saleDate.split('T')[0],
      notes: sale.notes,
    });
    setIsEditing(true);
    setEditingItemId(sale.id);
    openAddModal('sale');
  };

  const handleEditEmployee = (employee: Employee): void => {
    setFormData({
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      hireDate: employee.hireDate.split('T')[0],
      salary: employee.salary?.toString() || '',
    });
    setIsEditing(true);
    setEditingItemId(employee.id);
    openAddModal('employee');
  };

  const handleEditCustomer = (customer: Customer): void => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      status: customer.status,
      notes: customer.notes,
    });
    setIsEditing(true);
    setEditingItemId(customer.id);
    openAddModal('customer');
  };

  const handleEditTask = (task: Task): void => {
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.split('T')[0],
      assignedTo: task.assignedTo,
    });
    setIsEditing(true);
    setEditingItemId(task.id);
    openAddModal('task');
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
              deals={deals}
              sales={sales}
            />
          );
        }
      case 'customers':
        return (
          <CustomersTab
            customers={customers}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={deleteCustomer}
            userRole={userRole}
          />
        );
      case 'sales':
        return (
          <SalesTab
            sales={sales}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEditSale={handleEditSale}
            onDeleteSale={deleteSale}
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
            onEditTask={handleEditTask}
            onDeleteTask={deleteTask}
          />
        );
      case 'products':
        return (
          <ProductsTab
            products={products}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEditProduct={handleEditProduct}
            onDeleteProduct={deleteProduct}
            userRole={userRole}
          />
        );
      case 'employees':
        return (
          <EmployeesTab
            employees={employees}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEditEmployee={handleEditEmployee}
            onDeleteEmployee={deleteEmployee}
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
        isEditing={isEditing}
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