export type OrderStatus = 
  | 'pending' 
  | 'pickup_assigned' 
  | 'processing' 
  | 'ready' 
  | 'drop_assigned' 
  | 'delivered' 
  | 'cancelled';

export type ServiceType = 'laundry' | 'dryclean' | 'home_cleaning';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderCode: string;
  challanNo: string | null;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  serviceType: ServiceType;
  status: OrderStatus;
  pickupSlot: string;
  dropSlot: string;
  totalAmount: number;
  weight?: number;
  pieces?: number;
  items?: OrderItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  source: 'hq' | 'walkin';
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  payments: {
    id: string;
    amount: number;
    method: string;
    date: string;
  }[];
}

export interface Store {
  id: string;
  name: string;
  code: string;
  zone: string;
  address: string;
  phone: string;
  manager: string;
}

export const currentStore: Store = {
  id: 'store-001',
  name: 'MyCleaners Koramangala',
  code: 'MC-KOR-001',
  zone: 'South Bangalore',
  address: '123, 4th Cross, Koramangala, Bangalore - 560034',
  phone: '+91 9876543210',
  manager: 'Rajesh Kumar',
};

export const mockOrders: Order[] = [
  {
    id: '1',
    orderCode: 'MC-2024-001',
    challanNo: 'CH-001',
    customerName: 'Priya Sharma',
    customerPhone: '+91 9876543211',
    customerAddress: '45, HSR Layout, Bangalore',
    serviceType: 'laundry',
    status: 'pending',
    pickupSlot: 'Today, 10:00 AM - 12:00 PM',
    dropSlot: 'Tomorrow, 4:00 PM - 6:00 PM',
    totalAmount: 450,
    weight: 5.5,
    pieces: 12,
    createdAt: '2024-01-16T08:30:00Z',
    updatedAt: '2024-01-16T08:30:00Z',
    source: 'hq',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-16T08:30:00Z' }
    ],
    payments: [],
  },
  {
    id: '2',
    orderCode: 'MC-2024-002',
    challanNo: 'CH-002',
    customerName: 'Amit Patel',
    customerPhone: '+91 9876543212',
    serviceType: 'dryclean',
    status: 'pickup_assigned',
    pickupSlot: 'Today, 2:00 PM - 4:00 PM',
    dropSlot: 'Jan 18, 10:00 AM - 12:00 PM',
    totalAmount: 1250,
    items: [
      { id: 'i1', name: 'Suit (2 Piece)', quantity: 1, price: 500 },
      { id: 'i2', name: 'Blazer', quantity: 2, price: 350 },
      { id: 'i3', name: 'Saree (Silk)', quantity: 1, price: 400 },
    ],
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    source: 'hq',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-16T09:00:00Z' },
      { status: 'pickup_assigned', timestamp: '2024-01-16T10:00:00Z' }
    ],
    payments: [],
  },
  {
    id: '3',
    orderCode: 'MC-2024-003',
    challanNo: 'CH-003',
    customerName: 'Sneha Reddy',
    customerPhone: '+91 9876543213',
    serviceType: 'laundry',
    status: 'processing',
    pickupSlot: 'Yesterday, 10:00 AM',
    dropSlot: 'Today, 6:00 PM - 8:00 PM',
    totalAmount: 380,
    weight: 4.2,
    pieces: 8,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
    source: 'walkin',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-15T09:00:00Z' },
      { status: 'pickup_assigned', timestamp: '2024-01-15T10:00:00Z' },
      { status: 'processing', timestamp: '2024-01-16T11:00:00Z' }
    ],
    payments: [
      { id: 'p1', amount: 200, method: 'Cash', date: '2024-01-15' }
    ],
  },
  {
    id: '4',
    orderCode: 'MC-2024-004',
    challanNo: 'CH-004',
    customerName: 'Vikram Singh',
    customerPhone: '+91 9876543214',
    serviceType: 'dryclean',
    status: 'ready',
    pickupSlot: 'Jan 14, 2:00 PM',
    dropSlot: 'Today, 4:00 PM - 6:00 PM',
    totalAmount: 850,
    items: [
      { id: 'i4', name: 'Kurta Fancy', quantity: 3, price: 200 },
      { id: 'i5', name: 'Sherwani', quantity: 1, price: 450 },
    ],
    createdAt: '2024-01-14T14:00:00Z',
    updatedAt: '2024-01-16T08:00:00Z',
    source: 'hq',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-14T14:00:00Z' },
      { status: 'pickup_assigned', timestamp: '2024-01-14T15:00:00Z' },
      { status: 'processing', timestamp: '2024-01-15T09:00:00Z' },
      { status: 'ready', timestamp: '2024-01-16T08:00:00Z' }
    ],
    payments: [
      { id: 'p2', amount: 850, method: 'UPI', date: '2024-01-14' }
    ],
  },
  {
    id: '5',
    orderCode: 'MC-2024-005',
    challanNo: 'CH-005',
    customerName: 'Ananya Krishnan',
    customerPhone: '+91 9876543215',
    serviceType: 'home_cleaning',
    status: 'drop_assigned',
    pickupSlot: 'Jan 14, 10:00 AM',
    dropSlot: 'Today, 2:00 PM - 4:00 PM',
    totalAmount: 1500,
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    source: 'hq',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-14T10:00:00Z' },
      { status: 'pickup_assigned', timestamp: '2024-01-14T11:00:00Z' },
      { status: 'processing', timestamp: '2024-01-15T09:00:00Z' },
      { status: 'ready', timestamp: '2024-01-15T16:00:00Z' },
      { status: 'drop_assigned', timestamp: '2024-01-16T10:00:00Z' }
    ],
    payments: [
      { id: 'p3', amount: 1500, method: 'Card', date: '2024-01-14' }
    ],
  },
  {
    id: '6',
    orderCode: 'MC-2024-006',
    challanNo: 'CH-006',
    customerName: 'Rahul Gupta',
    customerPhone: '+91 9876543216',
    serviceType: 'laundry',
    status: 'delivered',
    pickupSlot: 'Jan 13, 10:00 AM',
    dropSlot: 'Jan 15, 4:00 PM',
    totalAmount: 620,
    weight: 7.8,
    pieces: 15,
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-15T16:30:00Z',
    source: 'walkin',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-13T10:00:00Z' },
      { status: 'pickup_assigned', timestamp: '2024-01-13T11:00:00Z' },
      { status: 'processing', timestamp: '2024-01-14T09:00:00Z' },
      { status: 'ready', timestamp: '2024-01-15T10:00:00Z' },
      { status: 'drop_assigned', timestamp: '2024-01-15T14:00:00Z' },
      { status: 'delivered', timestamp: '2024-01-15T16:30:00Z' }
    ],
    payments: [
      { id: 'p4', amount: 620, method: 'Cash', date: '2024-01-15' }
    ],
  },
  {
    id: '7',
    orderCode: 'MC-2024-007',
    challanNo: null,
    customerName: 'Meera Iyer',
    customerPhone: '+91 9876543217',
    serviceType: 'dryclean',
    status: 'pending',
    pickupSlot: 'Today, 4:00 PM - 6:00 PM',
    dropSlot: 'Jan 19, 10:00 AM - 12:00 PM',
    totalAmount: 0,
    items: [
      { id: 'i6', name: 'Wedding Lehenga', quantity: 1, price: 1200 },
    ],
    notes: 'Handle with extra care - heavy embroidery',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
    source: 'hq',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-16T11:00:00Z' }
    ],
    payments: [],
  },
  {
    id: '8',
    orderCode: 'MC-2024-008',
    challanNo: 'CH-008',
    customerName: 'Suresh Menon',
    customerPhone: '+91 9876543218',
    serviceType: 'laundry',
    status: 'cancelled',
    pickupSlot: 'Jan 14, 10:00 AM',
    dropSlot: 'Jan 16, 4:00 PM',
    totalAmount: 300,
    weight: 3.5,
    pieces: 7,
    createdAt: '2024-01-14T08:00:00Z',
    updatedAt: '2024-01-14T09:00:00Z',
    source: 'hq',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-14T08:00:00Z' },
      { status: 'cancelled', timestamp: '2024-01-14T09:00:00Z', note: 'Customer requested cancellation' }
    ],
    payments: [],
  },
  {
    id: '9',
    orderCode: 'MC-2024-009',
    challanNo: 'CH-009',
    customerName: 'Kavitha Nair',
    customerPhone: '+91 9876543219',
    serviceType: 'dryclean',
    status: 'processing',
    pickupSlot: 'Yesterday, 2:00 PM',
    dropSlot: 'Jan 18, 10:00 AM',
    totalAmount: 950,
    items: [
      { id: 'i7', name: 'Coat', quantity: 2, price: 300 },
      { id: 'i8', name: 'Dress', quantity: 1, price: 350 },
    ],
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    source: 'walkin',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-15T14:00:00Z' },
      { status: 'pickup_assigned', timestamp: '2024-01-15T15:00:00Z' },
      { status: 'processing', timestamp: '2024-01-16T09:00:00Z' }
    ],
    payments: [
      { id: 'p5', amount: 500, method: 'UPI', date: '2024-01-15' }
    ],
  },
  {
    id: '10',
    orderCode: 'MC-2024-010',
    challanNo: 'CH-010',
    customerName: 'Arjun Das',
    customerPhone: '+91 9876543220',
    serviceType: 'laundry',
    status: 'delivered',
    pickupSlot: 'Jan 12, 10:00 AM',
    dropSlot: 'Jan 14, 4:00 PM',
    totalAmount: 480,
    weight: 6.0,
    pieces: 14,
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-14T16:00:00Z',
    source: 'hq',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-12T10:00:00Z' },
      { status: 'pickup_assigned', timestamp: '2024-01-12T11:00:00Z' },
      { status: 'processing', timestamp: '2024-01-13T09:00:00Z' },
      { status: 'ready', timestamp: '2024-01-14T10:00:00Z' },
      { status: 'drop_assigned', timestamp: '2024-01-14T14:00:00Z' },
      { status: 'delivered', timestamp: '2024-01-14T16:00:00Z' }
    ],
    payments: [
      { id: 'p6', amount: 480, method: 'Cash', date: '2024-01-14' }
    ],
  },
  {
    id: '11',
    orderCode: 'MC-2024-011',
    challanNo: 'CH-011',
    customerName: 'Divya Prasad',
    customerPhone: '+91 9876543221',
    serviceType: 'home_cleaning',
    status: 'ready',
    pickupSlot: 'Jan 15, 10:00 AM',
    dropSlot: 'Today, 6:00 PM',
    totalAmount: 2000,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T12:00:00Z',
    source: 'hq',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-15T10:00:00Z' },
      { status: 'pickup_assigned', timestamp: '2024-01-15T11:00:00Z' },
      { status: 'processing', timestamp: '2024-01-16T09:00:00Z' },
      { status: 'ready', timestamp: '2024-01-16T12:00:00Z' }
    ],
    payments: [
      { id: 'p7', amount: 1000, method: 'UPI', date: '2024-01-15' }
    ],
  },
  {
    id: '12',
    orderCode: 'MC-2024-012',
    challanNo: 'CH-012',
    customerName: 'Karthik Rao',
    customerPhone: '+91 9876543222',
    serviceType: 'laundry',
    status: 'pickup_assigned',
    pickupSlot: 'Today, 12:00 PM - 2:00 PM',
    dropSlot: 'Tomorrow, 4:00 PM',
    totalAmount: 520,
    weight: 6.5,
    pieces: 13,
    createdAt: '2024-01-16T10:30:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
    source: 'hq',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-16T10:30:00Z' },
      { status: 'pickup_assigned', timestamp: '2024-01-16T11:00:00Z' }
    ],
    payments: [],
  },
  {
    id: '13',
    orderCode: 'MC-2024-013',
    challanNo: null,
    customerName: 'Lakshmi Venkat',
    customerPhone: '+91 9876543223',
    serviceType: 'dryclean',
    status: 'pending',
    pickupSlot: 'Today, 6:00 PM - 8:00 PM',
    dropSlot: 'Jan 20, 10:00 AM',
    totalAmount: 0,
    items: [
      { id: 'i9', name: 'Curtains (Heavy)', quantity: 4, price: 250 },
    ],
    createdAt: '2024-01-16T12:00:00Z',
    updatedAt: '2024-01-16T12:00:00Z',
    source: 'walkin',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-16T12:00:00Z' }
    ],
    payments: [],
  },
  {
    id: '14',
    orderCode: 'MC-2024-014',
    challanNo: 'CH-014',
    customerName: 'Nitin Joshi',
    customerPhone: '+91 9876543224',
    serviceType: 'laundry',
    status: 'delivered',
    pickupSlot: 'Jan 11, 10:00 AM',
    dropSlot: 'Jan 13, 4:00 PM',
    totalAmount: 350,
    weight: 4.0,
    pieces: 9,
    createdAt: '2024-01-11T10:00:00Z',
    updatedAt: '2024-01-13T16:00:00Z',
    source: 'hq',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-11T10:00:00Z' },
      { status: 'pickup_assigned', timestamp: '2024-01-11T11:00:00Z' },
      { status: 'processing', timestamp: '2024-01-12T09:00:00Z' },
      { status: 'ready', timestamp: '2024-01-13T10:00:00Z' },
      { status: 'drop_assigned', timestamp: '2024-01-13T14:00:00Z' },
      { status: 'delivered', timestamp: '2024-01-13T16:00:00Z' }
    ],
    payments: [
      { id: 'p8', amount: 350, method: 'Cash', date: '2024-01-13' }
    ],
  },
  {
    id: '15',
    orderCode: 'MC-2024-015',
    challanNo: 'CH-015',
    customerName: 'Pooja Hegde',
    customerPhone: '+91 9876543225',
    serviceType: 'dryclean',
    status: 'cancelled',
    pickupSlot: 'Jan 13, 2:00 PM',
    dropSlot: 'Jan 16, 10:00 AM',
    totalAmount: 750,
    items: [
      { id: 'i10', name: 'Jacket', quantity: 1, price: 350 },
      { id: 'i11', name: 'Trousers', quantity: 2, price: 200 },
    ],
    createdAt: '2024-01-13T12:00:00Z',
    updatedAt: '2024-01-13T14:00:00Z',
    source: 'hq',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-13T12:00:00Z' },
      { status: 'cancelled', timestamp: '2024-01-13T14:00:00Z', note: 'Wrong items selected' }
    ],
    payments: [],
  },
  {
    id: '16',
    orderCode: 'MC-2024-016',
    challanNo: 'CH-016',
    customerName: 'Ravi Shankar',
    customerPhone: '+91 9876543226',
    serviceType: 'laundry',
    status: 'drop_assigned',
    pickupSlot: 'Jan 14, 10:00 AM',
    dropSlot: 'Today, 4:00 PM',
    totalAmount: 580,
    weight: 7.2,
    pieces: 16,
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
    source: 'walkin',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-14T10:00:00Z' },
      { status: 'pickup_assigned', timestamp: '2024-01-14T11:00:00Z' },
      { status: 'processing', timestamp: '2024-01-15T09:00:00Z' },
      { status: 'ready', timestamp: '2024-01-16T08:00:00Z' },
      { status: 'drop_assigned', timestamp: '2024-01-16T11:00:00Z' }
    ],
    payments: [
      { id: 'p9', amount: 580, method: 'UPI', date: '2024-01-14' }
    ],
  },
  {
    id: '17',
    orderCode: 'MC-2024-017',
    challanNo: 'CH-017',
    customerName: 'Sanjay Malhotra',
    customerPhone: '+91 9876543227',
    serviceType: 'home_cleaning',
    status: 'processing',
    pickupSlot: 'Yesterday, 4:00 PM',
    dropSlot: 'Tomorrow, 10:00 AM',
    totalAmount: 1800,
    createdAt: '2024-01-15T16:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    source: 'hq',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-15T16:00:00Z' },
      { status: 'pickup_assigned', timestamp: '2024-01-15T17:00:00Z' },
      { status: 'processing', timestamp: '2024-01-16T10:00:00Z' }
    ],
    payments: [],
  },
  {
    id: '18',
    orderCode: 'MC-2024-018',
    challanNo: 'CH-018',
    customerName: 'Tanya Kapoor',
    customerPhone: '+91 9876543228',
    serviceType: 'dryclean',
    status: 'delivered',
    pickupSlot: 'Jan 10, 10:00 AM',
    dropSlot: 'Jan 13, 4:00 PM',
    totalAmount: 1100,
    items: [
      { id: 'i12', name: 'Evening Gown', quantity: 1, price: 600 },
      { id: 'i13', name: 'Blouse (Silk)', quantity: 2, price: 250 },
    ],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-13T16:00:00Z',
    source: 'hq',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-10T10:00:00Z' },
      { status: 'pickup_assigned', timestamp: '2024-01-10T11:00:00Z' },
      { status: 'processing', timestamp: '2024-01-11T09:00:00Z' },
      { status: 'ready', timestamp: '2024-01-12T16:00:00Z' },
      { status: 'drop_assigned', timestamp: '2024-01-13T10:00:00Z' },
      { status: 'delivered', timestamp: '2024-01-13T16:00:00Z' }
    ],
    payments: [
      { id: 'p10', amount: 1100, method: 'Card', date: '2024-01-13' }
    ],
  },
];

export const dryCleanItems = [
  { name: 'Suit (2 Piece)', price: 500 },
  { name: 'Suit (3 Piece)', price: 650 },
  { name: 'Blazer', price: 350 },
  { name: 'Coat', price: 300 },
  { name: 'Jacket', price: 350 },
  { name: 'Sherwani', price: 450 },
  { name: 'Kurta Fancy', price: 200 },
  { name: 'Saree (Silk)', price: 400 },
  { name: 'Saree (Cotton)', price: 250 },
  { name: 'Wedding Lehenga', price: 1200 },
  { name: 'Evening Gown', price: 600 },
  { name: 'Dress', price: 350 },
  { name: 'Blouse (Silk)', price: 250 },
  { name: 'Curtains (Light)', price: 150 },
  { name: 'Curtains (Heavy)', price: 250 },
  { name: 'Trousers', price: 200 },
  { name: 'Bedsheet (Double)', price: 200 },
  { name: 'Blanket', price: 350 },
];

export const homeCleaningServices = [
  { name: 'Deep Cleaning - 1BHK', price: 1500 },
  { name: 'Deep Cleaning - 2BHK', price: 2000 },
  { name: 'Deep Cleaning - 3BHK', price: 2500 },
  { name: 'Sofa Cleaning (Per Seat)', price: 300 },
  { name: 'Carpet Cleaning (Per Sqft)', price: 10 },
  { name: 'Mattress Cleaning (Single)', price: 500 },
  { name: 'Mattress Cleaning (Double)', price: 800 },
  { name: 'AC Cleaning (Split)', price: 450 },
  { name: 'Kitchen Deep Clean', price: 1000 },
  { name: 'Bathroom Deep Clean', price: 600 },
];

export const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pending',
    pickup_assigned: 'Pickup Assigned',
    processing: 'Processing',
    ready: 'Ready',
    drop_assigned: 'Drop Assigned',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return labels[status];
};

export const getServiceLabel = (service: ServiceType): string => {
  const labels: Record<ServiceType, string> = {
    laundry: 'Laundry',
    dryclean: 'Dry Clean',
    home_cleaning: 'Home Cleaning',
  };
  return labels[service];
};

export const canCancelOrder = (status: OrderStatus): boolean => {
  return status === 'pending';
};

export const getNextStatus = (status: OrderStatus): OrderStatus | null => {
  const flow: Record<OrderStatus, OrderStatus | null> = {
    pending: 'pickup_assigned',
    pickup_assigned: 'processing',
    processing: 'ready',
    ready: 'drop_assigned',
    drop_assigned: 'delivered',
    delivered: null,
    cancelled: null,
  };
  return flow[status];
};
