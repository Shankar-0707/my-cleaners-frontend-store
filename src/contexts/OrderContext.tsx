import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, OrderStatus, mockOrders, getNextStatus } from '@/lib/mockData';
import { toast } from 'sonner';

interface OrderContextType {
  orders: Order[];
  getOrder: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus, note?: string) => void;
  cancelOrder: (id: string, reason: string) => boolean;
  updateChallan: (id: string, challanNo: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'orderCode' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'payments'>) => Order;
  addPayment: (orderId: string, amount: number, method: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const getOrder = (id: string): Order | undefined => {
    return orders.find((o) => o.id === id);
  };

  const updateOrderStatus = (id: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          const now = new Date().toISOString();
          return {
            ...order,
            status,
            updatedAt: now,
            statusHistory: [
              ...order.statusHistory,
              { status, timestamp: now, note },
            ],
          };
        }
        return order;
      })
    );
    toast.success(`Order status updated to ${status.replace('_', ' ')}`);
  };

  const cancelOrder = (id: string, reason: string): boolean => {
    const order = getOrder(id);
    if (!order) return false;
    
    if (order.status !== 'pending') {
      toast.error('Cannot cancel order after pickup stage');
      return false;
    }

    updateOrderStatus(id, 'cancelled', reason);
    return true;
  };

  const updateChallan = (id: string, challanNo: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          return {
            ...order,
            challanNo,
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );
    toast.success('Challan number updated');
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'orderCode' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'payments'>): Order => {
    const now = new Date().toISOString();
    const newId = `${orders.length + 1}`;
    const orderCode = `MC-2024-${String(orders.length + 1).padStart(3, '0')}`;
    
    const newOrder: Order = {
      ...orderData,
      id: newId,
      orderCode,
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ status: 'pending', timestamp: now }],
      payments: [],
    };

    setOrders((prev) => [newOrder, ...prev]);
    toast.success('Walk-in order created successfully');
    return newOrder;
  };

  const addPayment = (orderId: string, amount: number, method: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            payments: [
              ...order.payments,
              {
                id: `p-${Date.now()}`,
                amount,
                method,
                date: new Date().toISOString().split('T')[0],
              },
            ],
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );
    toast.success('Payment added successfully');
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        getOrder,
        updateOrderStatus,
        cancelOrder,
        updateChallan,
        addOrder,
        addPayment,
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
