import { Deal, Customer, DashboardStats } from '../types';

export const getDashboardStats = (
  customers: Customer[],
  deals: Deal[]
): DashboardStats => {
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
  const activitiesThisWeek = 0; // Activities removed

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
