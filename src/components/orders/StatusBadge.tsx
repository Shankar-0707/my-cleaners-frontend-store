import { OrderStatus, getStatusLabel } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusStyles: Record<OrderStatus, string> = {
  pending: 'status-pending',
  pickup_assigned: 'status-pickup-assigned',
  processing: 'status-processing',
  ready: 'status-ready',
  drop_assigned: 'status-drop-assigned',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span className={cn('status-badge', statusStyles[status], className)}>
      {getStatusLabel(status)}
    </span>
  );
};
