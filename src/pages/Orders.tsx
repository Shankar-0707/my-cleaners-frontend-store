import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/components/layout/AppLayout';
import { useOrders } from '@/contexts/OrderContext';
import { KPICard } from '@/components/orders/KPICard';
import { StatusTabs, StatusFilter } from '@/components/orders/StatusTabs';
import { FiltersBar } from '@/components/orders/FiltersBar';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { CancelOrderDialog } from '@/components/orders/CancelOrderDialog';
import { Order, OrderStatus, ServiceType, getNextStatus } from '@/lib/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Orders = () => {
  const { setPageTitle } = useLayout();
  const { orders, updateOrderStatus, cancelOrder } = useOrders();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState<ServiceType | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');

  useEffect(() => {
    setPageTitle('Orders');
  }, [setPageTitle]);

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      all: orders.length,
      pending: 0,
      pickup_assigned: 0,
      processing: 0,
      ready: 0,
      drop_assigned: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      counts[order.status]++;
    });

    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (activeTab !== 'all' && order.status !== activeTab) {
        return false;
      }

      // Service filter
      if (serviceFilter !== 'all' && order.serviceType !== serviceFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches =
          order.orderCode.toLowerCase().includes(query) ||
          order.challanNo?.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerPhone.includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [orders, activeTab, serviceFilter, searchQuery]);

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(getNextStatus(order.status) || '');
    setStatusDialogOpen(true);
  };

  const handleConfirmStatusUpdate = () => {
    if (selectedOrder && newStatus) {
      updateOrderStatus(selectedOrder.id, newStatus);
      setStatusDialogOpen(false);
      setSelectedOrder(null);
      setNewStatus('');
    }
  };

  const handleCancel = (order: Order) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = (reason: string) => {
    if (selectedOrder) {
      cancelOrder(selectedOrder.id, reason);
      setCancelDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  const handlePrintTags = (order: Order) => {
    navigate(`/tags?order=${order.id}`);
  };

  const handlePrintInvoice = (order: Order) => {
    navigate(`/invoices?order=${order.id}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setServiceFilter('all');
    setDateRange({});
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Summary */}
      <div className="grid gap-3 grid-cols-4 lg:grid-cols-8">
        {(Object.keys(statusCounts) as StatusFilter[]).map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`kpi-card text-left ${
              activeTab === status ? 'ring-2 ring-primary' : ''
            }`}
          >
            <p className="text-xs text-muted-foreground capitalize">
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </p>
            <p className="text-2xl font-bold">{statusCounts[status]}</p>
          </button>
        ))}
      </div>

      {/* Status Tabs */}
      <StatusTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={statusCounts}
      />

      {/* Filters */}
      <FiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        serviceFilter={serviceFilter}
        onServiceChange={setServiceFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onClearFilters={clearFilters}
      />

      {/* Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        onUpdateStatus={handleUpdateStatus}
        onPrintTags={handlePrintTags}
        onPrintInvoice={handlePrintInvoice}
        onCancel={handleCancel}
      />

      {/* Cancel Dialog */}
      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        orderCode={selectedOrder?.orderCode || ''}
        onConfirm={handleConfirmCancel}
      />

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Order: <span className="font-medium">{selectedOrder?.orderCode}</span>
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value as OrderStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="pickup_assigned">Pickup Assigned</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="drop_assigned">Drop Assigned</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmStatusUpdate} disabled={!newStatus}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
