import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { dashboardStyles } from '../../styles/dashboard';
import { AdminDashboardStats, Product, Sale, Employee, Task } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface AdminDashboardTabProps {
  stats: AdminDashboardStats;
  products: Product[];
  sales: Sale[];
  employees: Employee[];
  tasks: Task[];
  settings: any;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  stats,
  products,
  sales,
  employees,
  tasks,
  settings,
}) => {
  const lowStockProducts = products.filter(product => 
    product.stock <= product.minStock && product.isActive
  );

  const recentSales = sales
    .filter(sale => sale.status === 'completed')
    .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
    .slice(0, 5);

  const pendingTasks = tasks.filter(task => task.status !== 'completed');

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={dashboardStyles.statsGrid}>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{stats.totalEmployees}</Text>
          <Text style={dashboardStyles.statLabel}>Total Employees</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{stats.totalProducts}</Text>
          <Text style={dashboardStyles.statLabel}>Total Products</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{stats.totalSales}</Text>
          <Text style={dashboardStyles.statLabel}>Total Sales</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{formatCurrency(stats.totalRevenue, settings)}</Text>
          <Text style={dashboardStyles.statLabel}>Total Revenue</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{stats.salesThisMonth}</Text>
          <Text style={dashboardStyles.statLabel}>Sales This Month</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{formatCurrency(stats.revenueThisMonth, settings)}</Text>
          <Text style={dashboardStyles.statLabel}>Revenue This Month</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{stats.activeProducts}</Text>
          <Text style={dashboardStyles.statLabel}>Active Products</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{stats.lowStockProducts}</Text>
          <Text style={dashboardStyles.statLabel}>Low Stock Items</Text>
        </View>
      </View>

      {lowStockProducts.length > 0 && (
        <View style={dashboardStyles.alertSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Icon name="alert" size={20} color="#dc2626" style={{ marginRight: 8 }} />
            <Text style={dashboardStyles.alertTitle}>Low Stock Alert</Text>
          </View>
          {lowStockProducts.slice(0, 3).map(product => (
            <View key={product.id} style={dashboardStyles.alertItem}>
              <Text style={dashboardStyles.alertText}>{product.name}</Text>
              <Text style={dashboardStyles.alertDate}>Stock: {product.stock} (Min: {product.minStock})</Text>
            </View>
          ))}
        </View>
      )}

      {pendingTasks.length > 0 && (
        <View style={dashboardStyles.alertSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Icon name="clipboard-list" size={20} color="#dc2626" style={{ marginRight: 8 }} />
            <Text style={dashboardStyles.alertTitle}>Pending Tasks</Text>
          </View>
          {pendingTasks.slice(0, 3).map(task => (
            <View key={task.id} style={dashboardStyles.alertItem}>
              <Text style={dashboardStyles.alertText}>{task.title}</Text>
              <Text style={dashboardStyles.alertDate}>Assigned to: {task.assignedTo}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={dashboardStyles.recentSection}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Icon name="currency-usd" size={20} color="#1e293b" style={{ marginRight: 8 }} />
          <Text style={dashboardStyles.sectionTitle}>Recent Sales</Text>
        </View>
        {recentSales.map(sale => (
          <View key={sale.id} style={dashboardStyles.activityItem}>
            <Icon name="cash" size={18} color="#10b981" style={{ marginRight: 12 }} />
            <View style={dashboardStyles.activityContent}>
              <Text style={dashboardStyles.activityTitle}>Sale #{sale.id}</Text>
              <Text style={dashboardStyles.activitySubtitle}>{sale.customerName} - {sale.employeeName}</Text>
            </View>
            <Text style={dashboardStyles.activityDate}>
              {formatCurrency(sale.finalAmount, settings)}
            </Text>
          </View>
        ))}
      </View>

      <View style={dashboardStyles.recentSection}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Icon name="chart-line" size={20} color="#1e293b" style={{ marginRight: 8 }} />
          <Text style={dashboardStyles.sectionTitle}>Quick Stats</Text>
        </View>
        <View style={dashboardStyles.noteItem}>
          <Text style={dashboardStyles.noteItemTitle}>Task Completion Rate</Text>
          <Text style={dashboardStyles.noteItemContent}>
            {stats.completedTasksThisWeek} tasks completed this week
          </Text>
        </View>
        <View style={dashboardStyles.noteItem}>
          <Text style={dashboardStyles.noteItemTitle}>Inventory Status</Text>
          <Text style={dashboardStyles.noteItemContent}>
            {stats.activeProducts} active products, {stats.lowStockProducts} need restocking
          </Text>
        </View>
        <View style={dashboardStyles.noteItem}>
          <Text style={dashboardStyles.noteItemTitle}>Sales Performance</Text>
          <Text style={dashboardStyles.noteItemContent}>
            {stats.salesThisMonth} sales this month generating {formatCurrency(stats.revenueThisMonth, settings)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
