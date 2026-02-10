import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  Truck,
  Loader2,
  CheckCircle2,
  Package,
  PlusCircle,
  Receipt,
} from 'lucide-react';
import { useLayout } from '@/components/layout/AppLayout';
import { useOrders } from '@/contexts/OrderContext';
import { KPICard } from '@/components/orders/KPICard';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { Button } from '@/components/ui/button';
import { isToday, parseISO } from 'date-fns';

const Dashboard = () => {
  const { setPageTitle } = useLayout();
  const { orders } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle('Dashboard');
  }, [setPageTitle]);

  const stats = useMemo(() => {
    const today = orders.filter((o) => isToday(parseISO(o.createdAt)));
    
    return {
      todayOrders: today.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      pickupAssigned: orders.filter((o) => o.status === 'pickup_assigned').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      ready: orders.filter((o) => o.status === 'ready').length,
      deliveredToday: orders.filter(
        (o) => o.status === 'delivered' && isToday(parseISO(o.updatedAt))
      ).length,
    };
  }, [orders]);

  const todayPickups = useMemo(() => {
    return orders.filter(
      (o) =>
        (o.status === 'pending' || o.status === 'pickup_assigned') &&
        o.pickupSlot.toLowerCase().includes('today')
    );
  }, [orders]);

  const todayDeliveries = useMemo(() => {
    return orders.filter(
      (o) =>
        (o.status === 'ready' || o.status === 'drop_assigned') &&
        o.dropSlot.toLowerCase().includes('today')
    );
  }, [orders]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button
          onClick={() => navigate('/orders/create')}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <PlusCircle className="h-4 w-4" />
          Create Walk-in Order
        </Button>
        <Button variant="outline" className="gap-2">
          <Receipt className="h-4 w-4" />
          Print Last Invoice
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KPICard
          title="Today Orders"
          value={stats.todayOrders}
          icon={ClipboardList}
          variant="primary"
          compact
        />
        <KPICard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          variant="warning"
          compact
        />
        <KPICard
          title="Pickup Assigned"
          value={stats.pickupAssigned}
          icon={Truck}
          compact
        />
        <KPICard
          title="Processing"
          value={stats.processing}
          icon={Loader2}
          variant="info"
          compact
        />
        <KPICard
          title="Ready"
          value={stats.ready}
          icon={Package}
          compact
        />
        <KPICard
          title="Delivered Today"
          value={stats.deliveredToday}
          icon={CheckCircle2}
          variant="success"
          compact
        />
      </div>

      {/* Today's Pickups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Today's Pickups</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/orders?status=pending')}
          >
            View All
          </Button>
        </div>
        <OrdersTable orders={todayPickups.slice(0, 5)} />
      </div>

      {/* Today's Deliveries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Today's Deliveries</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/orders?status=ready')}
          >
            View All
          </Button>
        </div>
        <OrdersTable orders={todayDeliveries.slice(0, 5)} />
      </div>
    </div>
  );
};

export default Dashboard;
