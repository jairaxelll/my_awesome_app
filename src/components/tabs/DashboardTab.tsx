import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { dashboardStyles } from '../../styles/dashboard';
import { Customer, Deal, Task, DashboardStats, Sale } from '../../types';
import { formatCurrency, formatDate, getTaskStatusIcon } from '../../utils/helpers';
import { LineChartCard } from '../charts/LineChartCard';
import { PieChartCard } from '../charts/PieChartCard';
import { getDealPipelineData, getTaskStatusData } from '../../utils/chartHelpers';

interface DashboardTabProps {
  stats: DashboardStats;
  tasks: Task[];
  settings: any;
  deals: Deal[];
  sales: Sale[];
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  stats,
  tasks,
  settings,
  deals,
  sales,
}) => {
  const overdueTasks = tasks.filter(task => 
    task.status !== 'completed' && 
    new Date(task.dueDate) < new Date()
  );


  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={dashboardStyles.statsGrid}>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{stats.totalCustomers}</Text>
          <Text style={dashboardStyles.statLabel}>Total Customers</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{stats.activeDeals}</Text>
          <Text style={dashboardStyles.statLabel}>Active Deals</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{formatCurrency(stats.totalDealValue, settings)}</Text>
          <Text style={dashboardStyles.statLabel}>Pipeline Value</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{stats.closedWonThisMonth}</Text>
          <Text style={dashboardStyles.statLabel}>Won This Month</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{formatCurrency(stats.revenueThisMonth, settings)}</Text>
          <Text style={dashboardStyles.statLabel}>Revenue This Month</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{stats.conversionRate}%</Text>
          <Text style={dashboardStyles.statLabel}>Conversion Rate</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{formatCurrency(stats.averageDealSize, settings)}</Text>
          <Text style={dashboardStyles.statLabel}>Avg Deal Size</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statNumber}>{tasks.filter(t => t.status !== 'completed').length}</Text>
          <Text style={dashboardStyles.statLabel}>Pending Tasks</Text>
        </View>
      </View>

      {/* Deal Pipeline Chart */}
      {deals.length > 0 && (
        <PieChartCard
          title="📊 Deal Pipeline by Stage"
          data={getDealPipelineData(deals)}
        />
      )}

      {/* Task Status Chart */}
      {tasks.length > 0 && (
        <PieChartCard
          title="✅ Task Status Distribution"
          data={getTaskStatusData(tasks)}
        />
      )}

      {overdueTasks.length > 0 && (
        <View style={dashboardStyles.alertSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Icon name="alert" size={20} color="#dc2626" style={{ marginRight: 8 }} />
            <Text style={dashboardStyles.alertTitle}>Overdue Tasks</Text>
          </View>
          {overdueTasks.slice(0, 3).map(task => (
            <View key={task.id} style={dashboardStyles.alertItem}>
              <Text style={dashboardStyles.alertText}>{task.title}</Text>
              <Text style={dashboardStyles.alertDate}>Due: {formatDate(task.dueDate)}</Text>
            </View>
          ))}
        </View>
      )}

    </ScrollView>
  );
};
