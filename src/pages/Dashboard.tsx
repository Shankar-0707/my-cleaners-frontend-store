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
  const { orders, pickups, fetchOrdersData, convertPickup } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle('Dashboard');
    fetchOrdersData(1); // Fetch first page on load
  }, [setPageTitle, fetchOrdersData]);

  const handleConvertPickup = async (id: string) => {
    const challanNo = prompt('Enter Challan Number for this order:');
    if (challanNo) {
      await convertPickup(id, challanNo);
    }
  };

  const stats = useMemo(() => {
    // Note: Backend might provide these stats directly in a future API
    // For now we calculate from the first page of loaded orders
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

  const todayOrdersList = useMemo(() => {
    return orders.filter((o) => isToday(parseISO(o.createdAt)));
  }, [orders]);

  const todayDeliveries = useMemo(() => {
    return orders.filter(
      (o) => (o.status === 'ready' || o.status === 'drop_assigned')
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
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {/* ... (existing kpi cards) */}
      </div>

      {/* Assigned Pickups */}
      {pickups.length > 0 && (
        <div className="card-elevated p-6 border-l-4 border-primary">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Assigned Pickup Requests</h2>
          </div>
          <div className="space-y-4">
            {pickups.map((pickup) => (
              <div key={pickup.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 rounded-lg gap-4">
                <div>
                  <p className="font-bold text-lg">{pickup.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{pickup.customer_mobile}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{pickup.customer_address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{pickup.pickup_date}</p>
                    <p className="text-xs text-muted-foreground">{pickup.pickup_slot}</p>
                  </div>
                  <Button size="sm" onClick={() => handleConvertPickup(pickup.id)}>
                    Convert to Order
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Orders</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/orders?status=pending')}
          >
            View All
          </Button>
        </div>
        <OrdersTable orders={todayOrdersList.slice(0, 5)} />
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
