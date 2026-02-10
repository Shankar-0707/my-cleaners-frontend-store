import { Check, Circle } from 'lucide-react';
import { OrderStatus, getStatusLabel } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface StatusTimelineProps {
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  currentStatus: OrderStatus;
}

const statusOrder: OrderStatus[] = [
  'pending',
  'pickup_assigned',
  'processing',
  'ready',
  'drop_assigned',
  'delivered',
];

export const StatusTimeline = ({
  statusHistory,
  currentStatus,
}: StatusTimelineProps) => {
  const isCancelled = currentStatus === 'cancelled';
  const currentIndex = statusOrder.indexOf(currentStatus);

  const getStatusFromHistory = (status: OrderStatus) => {
    return statusHistory.find((h) => h.status === status);
  };

  return (
    <div className="space-y-4">
      {statusOrder.map((status, index) => {
        const historyEntry = getStatusFromHistory(status);
        const isCompleted = historyEntry !== undefined;
        const isCurrent = status === currentStatus && !isCancelled;
        const isPending = !isCompleted && !isCancelled;

        return (
          <div key={status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2',
                  isCompleted && 'border-green-500 bg-green-500',
                  isCurrent && 'border-primary bg-primary',
                  isPending && 'border-muted-foreground/30 bg-background'
                )}
              >
                {isCompleted || isCurrent ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <Circle className="h-3 w-3 text-muted-foreground/30" />
                )}
              </div>
              {index < statusOrder.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-[24px]',
                    isCompleted ? 'bg-green-500' : 'bg-muted-foreground/20'
                  )}
                />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p
                className={cn(
                  'font-medium',
                  isCompleted || isCurrent
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {getStatusLabel(status)}
              </p>
              {historyEntry && (
                <p className="text-sm text-muted-foreground">
                  {format(new Date(historyEntry.timestamp), 'MMM dd, yyyy hh:mm a')}
                </p>
              )}
              {historyEntry?.note && (
                <p className="text-sm text-muted-foreground mt-1 italic">
                  "{historyEntry.note}"
                </p>
              )}
            </div>
          </div>
        );
      })}
      
      {isCancelled && (
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-500 bg-red-500">
              <span className="text-white text-lg font-bold">×</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-red-600">Cancelled</p>
            {getStatusFromHistory('cancelled') && (
              <>
                <p className="text-sm text-muted-foreground">
                  {format(
                    new Date(getStatusFromHistory('cancelled')!.timestamp),
                    'MMM dd, yyyy hh:mm a'
                  )}
                </p>
                {getStatusFromHistory('cancelled')?.note && (
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    "{getStatusFromHistory('cancelled')?.note}"
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
