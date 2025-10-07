import { Customer, Deal, Activity, Task, Note } from '../types';

export const getSampleCustomers = (): Customer[] => [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1-555-0123',
    company: 'TechCorp Inc.',
    status: 'customer',
    createdAt: new Date().toISOString(),
    lastContact: new Date().toISOString(),
    notes: 'VIP customer, prefers email communication'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@innovate.com',
    phone: '+1-555-0456',
    company: 'Innovate Solutions',
    status: 'prospect',
    createdAt: new Date().toISOString(),
    lastContact: new Date().toISOString(),
    notes: 'Interested in enterprise package'
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike@startup.io',
    phone: '+1-555-0789',
    company: 'StartupIO',
    status: 'lead',
    createdAt: new Date().toISOString(),
    lastContact: new Date().toISOString(),
    notes: 'Cold lead from LinkedIn'
  }
];

export const getSampleDeals = (): Deal[] => [
  {
    id: '1',
    title: 'Enterprise Software License',
    customerId: '1',
    customerName: 'John Smith',
    value: 50000,
    stage: 'negotiation',
    probability: 75,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    notes: 'Final pricing discussion next week'
  },
  {
    id: '2',
    title: 'Cloud Migration Project',
    customerId: '2',
    customerName: 'Sarah Johnson',
    value: 25000,
    stage: 'proposal',
    probability: 60,
    expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    notes: 'Waiting for budget approval'
  }
];

export const getSampleTasks = (): Task[] => [
  {
    id: '1',
    title: 'Follow up with John Smith',
    description: 'Call to discuss final contract terms',
    priority: 'high',
    status: 'pending',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Me',
    customerId: '1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Prepare demo for Sarah',
    description: 'Create custom demo for Innovate Solutions',
    priority: 'medium',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Me',
    customerId: '2',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Send proposal to Mike',
    description: 'Email initial proposal to StartupIO',
    priority: 'low',
    status: 'pending',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Me',
    customerId: '3',
    createdAt: new Date().toISOString()
  }
];

export const getSampleNotes = (): Note[] => [
  {
    id: '1',
    title: 'Meeting with John - Key Points',
    content: 'Discussed pricing structure and implementation timeline. He seems very interested in our enterprise features.',
    type: 'meeting',
    relatedId: '1',
    tags: ['meeting', 'enterprise', 'pricing'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: true
  },
  {
    id: '2',
    title: 'Competitor Analysis',
    content: 'Researched competitors in the CRM space. Our pricing is competitive and features are superior.',
    type: 'general',
    tags: ['research', 'competitors', 'pricing'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: false
  }
];

export const getSampleActivities = (): Activity[] => [
  {
    id: '1',
    type: 'call',
    title: 'Follow-up call with John Smith',
    description: 'Discussed contract terms and next steps',
    customerId: '1',
    customerName: 'John Smith',
    dealId: '1',
    date: new Date().toISOString(),
    completed: true
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Product demo for Sarah',
    description: 'Showed enterprise features and pricing',
    customerId: '2',
    customerName: 'Sarah Johnson',
    dealId: '2',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completed: true
  }
];
