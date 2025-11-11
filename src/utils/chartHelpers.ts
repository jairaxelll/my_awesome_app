import { Sale, Deal, Product, Task } from '../types';

// Get sales trend data for the last 6 months
export const getSalesTrendData = (sales: Sale[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const last6Months = [];
  
  // Get last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    last6Months.push({
      month: months[date.getMonth()],
      year: date.getFullYear(),
      count: 0
    });
  }
  
  // Count sales per month
  sales.forEach(sale => {
    const saleDate = new Date(sale.saleDate);
    const monthIndex = last6Months.findIndex(
      m => m.month === months[saleDate.getMonth()] && m.year === saleDate.getFullYear()
    );
    if (monthIndex !== -1) {
      last6Months[monthIndex].count++;
    }
  });
  
  return {
    labels: last6Months.map(m => m.month),
    datasets: [{
      data: last6Months.map(m => m.count)
    }]
  };
};

// Get revenue by month for the last 6 months
export const getRevenueByMonthData = (sales: Sale[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const last6Months = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    last6Months.push({
      month: months[date.getMonth()],
      year: date.getFullYear(),
      revenue: 0
    });
  }
  
  sales.forEach(sale => {
    if (sale.status === 'completed') {
      const saleDate = new Date(sale.saleDate);
      const monthIndex = last6Months.findIndex(
        m => m.month === months[saleDate.getMonth()] && m.year === saleDate.getFullYear()
      );
      if (monthIndex !== -1) {
        last6Months[monthIndex].revenue += sale.finalAmount;
      }
    }
  });
  
  return {
    labels: last6Months.map(m => m.month),
    datasets: [{
      data: last6Months.map(m => Math.round(m.revenue))
    }]
  };
};

// Get deal pipeline distribution
export const getDealPipelineData = (deals: Deal[]) => {
  const stages = {
    prospecting: { count: 0, color: '#f472b6' },
    qualification: { count: 0, color: '#ec4899' },
    proposal: { count: 0, color: '#db2777' },
    negotiation: { count: 0, color: '#f59e0b' },
    closed_won: { count: 0, color: '#10b981' },
    closed_lost: { count: 0, color: '#ef4444' }
  };
  
  deals.forEach(deal => {
    if (stages[deal.stage as keyof typeof stages]) {
      stages[deal.stage as keyof typeof stages].count++;
    }
  });
  
  return Object.entries(stages)
    .filter(([_, value]) => value.count > 0)
    .map(([key, value]) => ({
      name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value.count,
      color: value.color,
      legendFontColor: '#1e293b',
      legendFontSize: 12
    }));
};

// Get product performance (top 6 products by sales)
export const getProductPerformanceData = (sales: Sale[], products: Product[]) => {
  const productSales: { [key: string]: number } = {};
  
  sales.forEach(sale => {
    if (sale.status === 'completed') {
      sale.products.forEach(p => {
        productSales[p.productId] = (productSales[p.productId] || 0) + p.quantity;
      });
    }
  });
  
  // Get top 6 products
  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
  
  const labels = topProducts.map(([productId]) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name.substring(0, 10) : 'Unknown';
  });
  
  const data = topProducts.map(([, quantity]) => quantity);
  
  return {
    labels,
    datasets: [{ data }]
  };
};

// Get task status distribution
export const getTaskStatusData = (tasks: Task[]) => {
  const statuses = {
    pending: { count: 0, color: '#f59e0b' },
    'in-progress': { count: 0, color: '#3b82f6' },
    completed: { count: 0, color: '#10b981' },
    cancelled: { count: 0, color: '#ef4444' }
  };
  
  tasks.forEach(task => {
    if (statuses[task.status as keyof typeof statuses]) {
      statuses[task.status as keyof typeof statuses].count++;
    }
  });
  
  return Object.entries(statuses)
    .filter(([_, value]) => value.count > 0)
    .map(([key, value]) => ({
      name: key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value.count,
      color: value.color,
      legendFontColor: '#1e293b',
      legendFontSize: 12
    }));
};


