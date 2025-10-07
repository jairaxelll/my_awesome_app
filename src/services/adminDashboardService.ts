import { Product, Sale, Employee, Task, AdminDashboardStats } from '../types';

export const getAdminDashboardStats = (
  products: Product[],
  sales: Sale[],
  employees: Employee[],
  tasks: Task[]
): AdminDashboardStats => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  
  // Sales this month
  const salesThisMonth = sales.filter(sale => 
    new Date(sale.saleDate).getMonth() === thisMonth &&
    new Date(sale.saleDate).getFullYear() === thisYear &&
    sale.status === 'completed'
  );

  // Revenue this month
  const revenueThisMonth = salesThisMonth.reduce((sum, sale) => sum + sale.finalAmount, 0);

  // Low stock products
  const lowStockProducts = products.filter(product => 
    product.stock <= product.minStock && product.isActive
  );

  // Tasks this week
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const completedTasksThisWeek = tasks.filter(task =>
    task.status === 'completed' &&
    task.completedAt &&
    new Date(task.completedAt) >= thisWeek
  );

  // Pending tasks
  const pendingTasks = tasks.filter(task => task.status !== 'completed');

  // Active products
  const activeProducts = products.filter(product => product.isActive);

  // Total revenue
  const totalRevenue = sales
    .filter(sale => sale.status === 'completed')
    .reduce((sum, sale) => sum + sale.finalAmount, 0);

  return {
    totalEmployees: employees.filter(emp => emp.isActive).length,
    totalProducts: products.length,
    totalSales: sales.length,
    totalRevenue,
    salesThisMonth: salesThisMonth.length,
    revenueThisMonth,
    activeProducts: activeProducts.length,
    lowStockProducts: lowStockProducts.length,
    pendingTasks: pendingTasks.length,
    completedTasksThisWeek: completedTasksThisWeek.length,
  };
};
