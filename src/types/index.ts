// CRM Data Models
export interface Customer {
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

export interface Deal {
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

// Activity interface removed - no longer needed

export interface DashboardStats {
  totalCustomers: number;
  activeDeals: number;
  totalDealValue: number;
  closedWonThisMonth: number;
  activitiesThisWeek: number;
  revenueThisMonth: number;
  conversionRate: number;
  averageDealSize: number;
}

export interface Task {
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

// Note interface removed - no longer needed

export interface Report {
  id: string;
  title: string;
  type: 'sales' | 'customers' | 'activities' | 'revenue';
  dateRange: { start: string; end: string };
  data: any;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'alert' | 'info' | 'success';
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  reminderTime: number;
  currency: string;
  dateFormat: string;
  language: string;
}

// New entities for enhanced CRM
export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In real app, this would be hashed
  role: 'admin' | 'employee';
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  sku: string;
  stock: number;
  minStock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  employeeId: string;
  employeeName: string;
  products: SaleProduct[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'transfer' | 'check';
  saleDate: string;
  notes?: string;
  createdAt: string;
}

export interface SaleProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Employee {
  id: string;
  userId: string;
  employeeId: string; // Employee number
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  salary?: number;
  isActive: boolean;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardStats {
  totalEmployees: number;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  salesThisMonth: number;
  revenueThisMonth: number;
  activeProducts: number;
  lowStockProducts: number;
  pendingTasks: number;
  completedTasksThisWeek: number;
}

export type TabType = 'dashboard' | 'customers' | 'sales' | 'tasks' | 'reports' | 'calendar' | 'settings' | 'products' | 'employees';
export type ModalType = 'customer' | 'sale' | 'task' | 'product' | 'employee';
export type UserRole = 'admin' | 'employee';
