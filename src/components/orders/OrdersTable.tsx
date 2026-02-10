import { useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  Eye,
  RefreshCw,
  Tags,
  Receipt,
  XCircle,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Order, getServiceLabel, canCancelOrder } from '@/lib/mockData';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';

interface OrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
  onUpdateStatus?: (order: Order) => void;
  onPrintTags?: (order: Order) => void;
  onPrintInvoice?: (order: Order) => void;
  onCancel?: (order: Order) => void;
}

export const OrdersTable = ({
  orders,
  isLoading = false,
  onUpdateStatus,
  onPrintTags,
  onPrintInvoice,
  onCancel,
}: OrdersTableProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Receipt className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No orders found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your filters or create a new walk-in order.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Order Code</TableHead>
            <TableHead className="font-semibold">Challan No</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold">Service</TableHead>
            <TableHead className="font-semibold">Pickup Slot</TableHead>
            <TableHead className="font-semibold">Drop Slot</TableHead>
            <TableHead className="font-semibold text-right">Amount</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="hover:bg-muted/30 cursor-pointer"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <TableCell className="font-medium text-primary">
                {order.orderCode}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {order.challanNo || (
                  <span className="text-destructive text-xs">Missing</span>
                )}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customerPhone}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-xs font-medium">
                  {getServiceLabel(order.serviceType)}
                </span>
              </TableCell>
              <TableCell className="text-sm">{order.pickupSlot}</TableCell>
              <TableCell className="text-sm">{order.dropSlot}</TableCell>
              <TableCell className="text-right font-medium">
                {order.totalAmount > 0 ? (
                  `₹${order.totalAmount.toLocaleString()}`
                ) : (
                  <span className="text-muted-foreground">₹0</span>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(order.createdAt), 'MMM dd, hh:mm a')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${order.id}`);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Order
                    </DropdownMenuItem>
                    {order.status !== 'delivered' &&
                      order.status !== 'cancelled' && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus?.(order);
                          }}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Update Status
                        </DropdownMenuItem>
                      )}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onPrintTags?.(order);
                      }}
                    >
                      <Tags className="mr-2 h-4 w-4" />
                      Print Tags
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onPrintInvoice?.(order);
                      }}
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      Print Invoice
                    </DropdownMenuItem>
                    {canCancelOrder(order.status) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancel?.(order);
                          }}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Order
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
