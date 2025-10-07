import { Settings } from '../types';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'lead': return '#f59e0b';
    case 'prospect': return '#3b82f6';
    case 'customer': return '#059669';
    case 'inactive': return '#6b7280';
    case 'completed': return '#10b981';
    case 'pending': return '#f59e0b';
    case 'cancelled': return '#dc2626';
    case 'refunded': return '#6b7280';
    default: return '#6b7280';
  }
};

export const getStageColor = (stage: string): string => {
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

export const getActivityIcon = (type: string): string => {
  switch (type) {
    case 'call': return '📞';
    case 'meeting': return '🤝';
    case 'email': return '📧';
    case 'note': return '📝';
    default: return '📝';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'low': return '#10b981';
    case 'medium': return '#f59e0b';
    case 'high': return '#f97316';
    case 'urgent': return '#dc2626';
    default: return '#6b7280';
  }
};

export const getPriorityIcon = (priority: string): string => {
  switch (priority) {
    case 'low': return '🟢';
    case 'medium': return '🟡';
    case 'high': return '🟠';
    case 'urgent': return '🔴';
    default: return '⚪';
  }
};

export const getTaskStatusIcon = (status: string): string => {
  switch (status) {
    case 'pending': return '⏳';
    case 'in-progress': return '🔄';
    case 'completed': return '✅';
    case 'cancelled': return '❌';
    default: return '⏳';
  }
};

export const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'reminder': return '⏰';
    case 'alert': return '⚠️';
    case 'info': return 'ℹ️';
    case 'success': return '✅';
    default: return '📢';
  }
};

export const formatCurrency = (amount: number, settings: Settings): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: settings.currency,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date();
};
