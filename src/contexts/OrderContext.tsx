import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Order, OrderStatus } from '@/lib/mockData';
import { toast } from 'sonner';
import { fetchOrders, createOrderApi, updateOrderStatusApi, recordPaymentApi, fetchOrderByIdApi, fetchPickupsApi, convertPickupApi } from '@/services/api';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  totalOrders: number;
  isLoading: boolean;
  pickups: any[];
  fetchOrdersData: (page?: number, status?: OrderStatus, q?: string) => Promise<void>;
  fetchPickups: () => Promise<void>;
  convertPickup: (id: string, challanNo: string) => Promise<boolean>;
  fetchOrderById: (id: string) => Promise<Order | null>;
  getOrder: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus, note?: string) => Promise<void>;
  cancelOrder: (id: string, reason: string) => Promise<boolean>;
  addOrder: (orderData: any) => Promise<Order | null>;
  addPayment: (orderId: string, amount: number, method: string, note?: string) => Promise<void>;
  updateChallan: (id: string, challanNo: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pickups, setPickups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const mapBackendOrder = (o: any): Order => ({
    id: o.id,
    orderCode: o.order_code,
    challanNo: o.challan_no,
    customerName: o.customer?.full_name || 'Unknown',
    customerPhone: o.customer?.mobile || '',
    serviceType: o.source === 'WALK_IN' ? 'laundry' : 'laundry', // source mapping or default
    status: o.status.toLowerCase() as OrderStatus,
    pickupSlot: 'N/A', // Not in basic order model
    dropSlot: 'N/A',
    totalAmount: 0, // Needs calculation or backend field
    createdAt: o.created_at,
    updatedAt: o.updated_at,
    source: o.source.toLowerCase() as 'hq' | 'walkin',
    statusHistory: [], // Map if available
    payments: [], // Map if available
  });

  const fetchOrdersData = async (page = 1, status?: string, q?: string) => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const result = await fetchOrders({ page, limit: 10, status, q });
      setOrders(result.data.map(mapBackendOrder));
      setTotalOrders(result.meta.total);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPickups = async () => {
    try {
      const result = await fetchPickupsApi();
      setPickups(result.pickups);
    } catch (error) {
      toast.error('Failed to fetch pickups');
    }
  };

  const convertPickup = async (id: string, challanNo: string): Promise<boolean> => {
    try {
      await convertPickupApi(id, { challan_no: challanNo });
      toast.success('Pickup converted to order');
      fetchPickups();
      fetchOrdersData();
      return true;
    } catch (error) {
      toast.error('Failed to convert pickup');
      return false;
    }
  };

  const fetchOrderById = async (id: string): Promise<Order | null> => {
    setIsLoading(true);
    try {
      const result = await fetchOrderByIdApi(id);
      const mapped = mapBackendOrder(result.order);
      return mapped;
    } catch (error) {
      toast.error('Failed to fetch order details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrdersData();
    }
  }, [isAuthenticated]);

  const getOrder = (id: string): Order | undefined => {
    return orders.find((o) => o.id === id);
  };

  const updateOrderStatus = async (id: string, status: OrderStatus, note?: string) => {
    try {
      await updateOrderStatusApi(id, status.toUpperCase());
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order))
      );
      toast.success(`Order status updated to ${status.replace('_', ' ')}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const cancelOrder = async (id: string, reason: string): Promise<boolean> => {
    const order = getOrder(id);
    if (!order) return false;

    if (order.status !== 'pending') {
      toast.error('Cannot cancel order after pickup stage');
      return false;
    }

    try {
      await updateOrderStatusApi(id, 'CANCELLED');
      updateOrderStatus(id, 'cancelled', reason);
      return true;
    } catch (error) {
      return false;
    }
  };

  const addOrder = async (orderData: any): Promise<Order | null> => {
    try {
      const data = await createOrderApi(orderData);
      const newOrder = mapBackendOrder(data.order);
      setOrders((prev) => [newOrder, ...prev]);
      toast.success('Walk-in order created successfully');
      return newOrder;
    } catch (error) {
      toast.error('Failed to create order');
      return null;
    }
  };

  const addPayment = async (orderId: string, amount: number, method: string, note?: string) => {
    try {
      await recordPaymentApi(orderId, { amount, method, note });
      toast.success('Payment added successfully');
      // Potentially re-fetch order or update state
    } catch (error) {
      toast.error('Failed to add payment');
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        totalOrders,
        isLoading,
        pickups,
        fetchOrdersData,
        fetchPickups,
        convertPickup,
        fetchOrderById,
        getOrder,
        updateOrderStatus,
        cancelOrder,
        addOrder,
        addPayment,
        updateChallan: () => { }, // Not implemented in current backend
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
