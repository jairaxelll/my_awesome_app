import { Customer, Deal, Activity, Task, Note } from '../types';

export const getSampleCustomers = (): Customer[] => [
  {
    id: '1',
    name: 'Diana Morales',
    email: 'diana@lunanails.mx',
    phone: '+52-55-5555-0101',
    company: 'Luna Nails Studio',
    status: 'customer',
    createdAt: new Date().toISOString(),
    lastContact: new Date().toISOString(),
    notes: 'Compra mensualmente kits de gel y valora entregas puntuales los lunes.'
  },
  {
    id: '2',
    name: 'Paola Rivera',
    email: 'paola@colorpopbeauty.com',
    phone: '+52-33-4444-0202',
    company: 'ColorPop Beauty Bar',
    status: 'prospect',
    createdAt: new Date().toISOString(),
    lastContact: new Date().toISOString(),
    notes: 'Solicitó cotización de tonos pastel para nueva temporada.'
  },
  {
    id: '3',
    name: 'Laura Torres',
    email: 'laura@glowstudio.mx',
    phone: '+52-81-6666-0303',
    company: 'Glow Studio Nails & Spa',
    status: 'lead',
    createdAt: new Date().toISOString(),
    lastContact: new Date().toISOString(),
    notes: 'Interesada en paquetes de capacitación y combos de inicio.'
  }
];

export const getSampleDeals = (): Deal[] => [
  {
    id: '1',
    title: 'Pedido mayorista de geles nude',
    customerId: '1',
    customerName: 'Diana Morales',
    value: 8200,
    stage: 'negotiation',
    probability: 70,
    expectedCloseDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    notes: 'Revisión de inventario y ajuste de precio por volumen.'
  },
  {
    id: '2',
    title: 'Kit premium para nueva sucursal',
    customerId: '2',
    customerName: 'Paola Rivera',
    value: 5400,
    stage: 'proposal',
    probability: 55,
    expectedCloseDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    notes: 'Enviada propuesta con lámparas UV, mesas y acrílicos.'
  }
];

export const getSampleTasks = (): Task[] => [
  {
    id: '1',
    title: 'Confirmar tonos nude con Diana',
    description: 'Enviar fotos de la nueva colección y validar existencias para el pedido.',
    priority: 'high',
    status: 'pending',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Me',
    customerId: '1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Cotizar mobiliario para Paola',
    description: 'Armar paquete que incluya lámparas UV, mesas y organizadores.',
    priority: 'medium',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Me',
    customerId: '2',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Enviar plan de capacitaciones a Laura',
    description: 'Adjuntar agenda de talleres de aplicación de acrílico y nail art.',
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
    title: 'Visita a Luna Nails',
    content: 'Diana necesita reposición cada tres semanas. Sugirió agregar displays para esmaltes en la tienda.',
    type: 'meeting',
    relatedId: '1',
    tags: ['visita', 'inventario', 'ideas'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: true
  },
  {
    id: '2',
    title: 'Tendencias primavera',
    content: 'Mayor demanda de tonos pastel y efectos perlados. Preparar campaña cruzada con redes sociales.',
    type: 'general',
    tags: ['tendencias', 'marketing', 'temporada'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: false
  }
];

export const getSampleActivities = (): Activity[] => [
  {
    id: '1',
    type: 'call',
    title: 'Seguimiento con Diana Morales',
    description: 'Confirmó cantidades para kit nude y pidió agregar displays acrílicos.',
    customerId: '1',
    customerName: 'Diana Morales',
    dealId: '1',
    date: new Date().toISOString(),
    completed: true
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Demo de lámparas UV para Paola',
    description: 'Mostramos diferencias entre lámparas de 48W y 54W con ejemplos en vivo.',
    customerId: '2',
    customerName: 'Paola Rivera',
    dealId: '2',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completed: true
  }
];
